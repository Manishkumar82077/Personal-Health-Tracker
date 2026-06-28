'use client';
import { useState } from 'react';
import { LuHeart } from 'react-icons/lu';
import { toggleLike } from '@/lib/api';

interface Props {
  postId: string;
  liked: boolean;
  count: number;
}

export function LikeButton({ postId, liked: likedInit, count: countInit }: Props) {
  const [liked, setLiked] = useState(likedInit);
  const [count, setCount] = useState(countInit);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    // Optimistic update.
    const prev = { liked, count };
    setLiked(!liked);
    setCount(c => c + (liked ? -1 : 1));
    setBusy(true);
    try {
      const res = await toggleLike(postId);
      setLiked(res.liked);
      setCount(res.likeCount);
    } catch {
      setLiked(prev.liked);
      setCount(prev.count);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        liked ? 'text-rose-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
      }`}
    >
      <LuHeart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
