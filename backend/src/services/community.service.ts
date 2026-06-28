import { db } from '../config/firebase';
import { Post, Comment, PublicProfile } from '../interface/post.model';
import { Profile } from '../interface/profile.model';
import { AppError } from '../utils/AppError';

const postCol = () => db.collection('posts');
const commentCol = (postId: string) => postCol().doc(postId).collection('comments');
const likeCol = (postId: string) => postCol().doc(postId).collection('likes');

/** Resolve a friendly display name for a user, with sensible fallbacks. */
async function resolveName(uid: string, email?: string): Promise<string> {
  const snap = await db.collection('users').doc(uid).get();
  const profile = snap.exists ? (snap.data() as Profile) : null;
  return profile?.displayName?.trim()
    || (profile?.email ?? email)?.split('@')[0]
    || 'User';
}

export async function listPosts(
  uid: string,
  limit = 20,
  cursor?: string
): Promise<{ posts: (Post & { likedByMe: boolean })[]; nextCursor: string | null }> {
  let query = postCol().orderBy('createdAt', 'desc').limit(limit);
  if (cursor) query = postCol().orderBy('createdAt', 'desc').startAfter(cursor).limit(limit);

  const snap = await query.get();
  const posts = snap.docs.map(d => ({ ...(d.data() as Post), id: d.id }));

  // Mark which posts the requester has liked.
  const liked = await Promise.all(
    posts.map(p => likeCol(p.id).doc(uid).get().then(s => s.exists))
  );
  const withLiked = posts.map((p, i) => ({ ...p, likedByMe: liked[i] }));

  const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt : null;
  return { posts: withLiked, nextCursor };
}

export async function createPost(uid: string, email: string | undefined, text: string): Promise<Post> {
  const authorName = await resolveName(uid, email);
  const ref = postCol().doc();
  const post: Post = {
    id: ref.id,
    authorUid: uid,
    authorName,
    text: text.trim(),
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };
  await ref.set(post);
  return post;
}

export async function deletePost(uid: string, id: string): Promise<void> {
  const ref = postCol().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Post not found');
  if ((snap.data() as Post).authorUid !== uid) {
    throw new AppError(403, 'FORBIDDEN', 'You can only delete your own posts');
  }
  await ref.delete();
}

export async function listComments(postId: string): Promise<Comment[]> {
  const snap = await commentCol(postId).get();
  return snap.docs
    .map(d => ({ ...(d.data() as Comment), id: d.id }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addComment(
  uid: string,
  email: string | undefined,
  postId: string,
  text: string
): Promise<Comment> {
  const postRef = postCol().doc(postId);
  const postSnap = await postRef.get();
  if (!postSnap.exists) throw new AppError(404, 'NOT_FOUND', 'Post not found');

  const authorName = await resolveName(uid, email);
  const ref = commentCol(postId).doc();
  const comment: Comment = {
    id: ref.id,
    authorUid: uid,
    authorName,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  const batch = db.batch();
  batch.set(ref, comment);
  batch.update(postRef, { commentCount: (postSnap.data() as Post).commentCount + 1 });
  await batch.commit();
  return comment;
}

export async function toggleLike(uid: string, postId: string): Promise<{ liked: boolean; likeCount: number }> {
  const postRef = postCol().doc(postId);
  const postSnap = await postRef.get();
  if (!postSnap.exists) throw new AppError(404, 'NOT_FOUND', 'Post not found');

  const likeRef = likeCol(postId).doc(uid);
  const likeSnap = await likeRef.get();
  const current = (postSnap.data() as Post).likeCount;

  const batch = db.batch();
  let liked: boolean;
  let likeCount: number;
  if (likeSnap.exists) {
    batch.delete(likeRef);
    likeCount = Math.max(0, current - 1);
    liked = false;
  } else {
    batch.set(likeRef, { uid, createdAt: new Date().toISOString() });
    likeCount = current + 1;
    liked = true;
  }
  batch.update(postRef, { likeCount });
  await batch.commit();
  return { liked, likeCount };
}

export async function getPublicProfile(uid: string): Promise<PublicProfile> {
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'User not found');
  const profile = snap.data() as Profile;

  const postsSnap = await postCol().where('authorUid', '==', uid).get();
  const posts = postsSnap.docs
    .map(d => ({ ...(d.data() as Post), id: d.id }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    uid,
    displayName: profile.displayName?.trim() || profile.email?.split('@')[0] || 'User',
    joinedAt: profile.createdAt,
    posts,
  };
}
