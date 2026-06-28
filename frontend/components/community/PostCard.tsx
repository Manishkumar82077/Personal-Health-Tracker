'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuMessageCircle, LuTrash2 } from 'react-icons/lu';
import type { Post } from '@/lib/types';
import { deletePost } from '@/lib/api';
import { timeAgo } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { LikeButton } from './LikeButton';
import { CommentThread } from './CommentThread';

interface Props {
  post: Post;
  currentUid?: string;
  onChanged: () => void;
}

export function PostCard({ post, currentUid, onChanged }: Props) {
  const [showComments, setShowComments] = useState(false);
  const isOwn = currentUid === post.authorUid;

  const remove = async () => {
    await deletePost(post.id);
    onChanged();
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-2.5">
        <Link href={`/community/profile/${post.authorUid}`}
          className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
          {post.authorName.charAt(0).toUpperCase()}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link href={`/community/profile/${post.authorUid}`}
                className="text-sm font-semibold text-gray-900 dark:text-gray-50 hover:underline truncate">
                {post.authorName}
              </Link>
              <span className="text-xs text-gray-400">· {timeAgo(post.createdAt)}</span>
            </div>
            {isOwn && (
              <button onClick={remove} className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400">
                <LuTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-words">{post.text}</p>

          <div className="flex items-center gap-5 mt-3">
            <LikeButton postId={post.id} liked={!!post.likedByMe} count={post.likeCount} />
            <button onClick={() => setShowComments(s => !s)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <LuMessageCircle className="w-4 h-4" />
              <span className="tabular-nums">{post.commentCount}</span>
            </button>
          </div>

          {showComments && <CommentThread postId={post.id} onChanged={onChanged} />}
        </div>
      </div>
    </Card>
  );
}
