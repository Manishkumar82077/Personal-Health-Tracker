import { db } from '../config/firebase';
import { Post, PublicProfile, ReplyRef } from '../interface/post.model';
import { Profile } from '../interface/profile.model';
import { AppError } from '../utils/AppError';

const postCol = () => db.collection('posts');
const reactionCol = (postId: string) => postCol().doc(postId).collection('reactions');

/** Resolve a friendly display name for a user, with sensible fallbacks. */
async function resolveName(uid: string, email?: string): Promise<string> {
  const snap = await db.collection('users').doc(uid).get();
  const profile = snap.exists ? (snap.data() as Profile) : null;
  return profile?.displayName?.trim()
    || (profile?.email ?? email)?.split('@')[0]
    || 'User';
}

/** Newest `limit` messages, returned oldest→newest (chat order), with the
 *  requester's own reaction marked on each. */
export async function listPosts(
  uid: string,
  limit = 50,
  cursor?: string
): Promise<{ posts: Post[]; nextCursor: string | null }> {
  let query = postCol().orderBy('createdAt', 'desc').limit(limit);
  if (cursor) query = postCol().orderBy('createdAt', 'desc').startAfter(cursor).limit(limit);

  const snap = await query.get();
  const desc = snap.docs.map(d => ({ ...(d.data() as Post), id: d.id }));

  const mine = await Promise.all(
    desc.map(p => reactionCol(p.id).doc(uid).get().then(s => (s.exists ? (s.data() as { emoji: string }).emoji : null)))
  );
  desc.forEach((p, i) => { p.myReaction = mine[i]; p.reactions = p.reactions ?? {}; });

  const nextCursor = desc.length === limit ? desc[desc.length - 1].createdAt : null;
  return { posts: desc.reverse(), nextCursor }; // oldest→newest for the chat view
}

export async function createPost(
  uid: string,
  email: string | undefined,
  text: string,
  replyToId?: string
): Promise<Post> {
  const authorName = await resolveName(uid, email);

  let replyTo: ReplyRef | undefined;
  if (replyToId) {
    const parent = await postCol().doc(replyToId).get();
    if (parent.exists) {
      const d = parent.data() as Post;
      replyTo = { id: replyToId, authorName: d.authorName, text: d.text.slice(0, 140) };
    }
  }

  const ref = postCol().doc();
  const post: Post = {
    id: ref.id,
    authorUid: uid,
    authorName,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    reactions: {},
    ...(replyTo ? { replyTo } : {}),
  };
  await ref.set(post);
  return { ...post, myReaction: null };
}

export async function deletePost(uid: string, id: string): Promise<void> {
  const ref = postCol().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Message not found');
  if ((snap.data() as Post).authorUid !== uid) {
    throw new AppError(403, 'FORBIDDEN', 'You can only delete your own messages');
  }
  await ref.delete();
}

/** Toggle/switch a single emoji reaction for the requester (Telegram-style). */
export async function react(
  uid: string,
  postId: string,
  emoji: string
): Promise<{ reactions: Record<string, number>; myReaction: string | null }> {
  const postRef = postCol().doc(postId);
  const postSnap = await postRef.get();
  if (!postSnap.exists) throw new AppError(404, 'NOT_FOUND', 'Message not found');

  const reactRef = reactionCol(postId).doc(uid);
  const reactSnap = await reactRef.get();
  const reactions = { ...((postSnap.data() as Post).reactions ?? {}) };
  const oldEmoji = reactSnap.exists ? (reactSnap.data() as { emoji: string }).emoji : null;

  const dec = (e: string) => {
    reactions[e] = Math.max(0, (reactions[e] ?? 0) - 1);
    if (reactions[e] === 0) delete reactions[e];
  };

  const batch = db.batch();
  let myReaction: string | null;
  if (oldEmoji === emoji) {
    dec(emoji);
    batch.delete(reactRef);
    myReaction = null;
  } else {
    if (oldEmoji) dec(oldEmoji);
    reactions[emoji] = (reactions[emoji] ?? 0) + 1;
    batch.set(reactRef, { emoji, createdAt: new Date().toISOString() });
    myReaction = emoji;
  }
  batch.update(postRef, { reactions });
  await batch.commit();
  return { reactions, myReaction };
}

export async function getPublicProfile(uid: string): Promise<PublicProfile> {
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'User not found');
  const profile = snap.data() as Profile;

  const postsSnap = await postCol().where('authorUid', '==', uid).get();
  const posts = postsSnap.docs
    .map(d => ({ ...(d.data() as Post), id: d.id, reactions: (d.data() as Post).reactions ?? {} }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    uid,
    displayName: profile.displayName?.trim() || profile.email?.split('@')[0] || 'User',
    joinedAt: profile.createdAt,
    posts,
  };
}
