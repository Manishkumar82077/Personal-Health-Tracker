/** A short snapshot of the message being replied to (Telegram-style quote). */
export interface ReplyRef {
  id: string;
  authorName: string;
  text: string;
}

export interface Post {
  id: string;
  authorUid: string;
  authorName: string;   // denormalized for cheap feed reads
  text: string;
  createdAt: string;    // ISO 8601
  replyTo?: ReplyRef;
  reactions: Record<string, number>; // emoji -> count
  myReaction?: string | null;        // emoji the requester reacted with (set on read)
}

/** Public-safe view of a user — never exposes email/weight/goals. */
export interface PublicProfile {
  uid: string;
  displayName: string;
  joinedAt: string;
  posts: Post[];
}

export const ALLOWED_REACTIONS = ['👍', '❤️', '🔥', '💪', '🎉', '😂'];
