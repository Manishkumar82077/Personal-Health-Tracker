export interface Post {
  id: string;
  authorUid: string;
  authorName: string;   // denormalized for cheap feed reads
  text: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;    // ISO 8601
}

export interface Comment {
  id: string;
  authorUid: string;
  authorName: string;
  text: string;
  createdAt: string;
}

/** Public-safe view of a user — never exposes email/weight/goals. */
export interface PublicProfile {
  uid: string;
  displayName: string;
  joinedAt: string;
  posts: Post[];
}
