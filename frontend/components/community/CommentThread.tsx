'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LuSend } from 'react-icons/lu';
import { addComment } from '@/lib/api';
import { useComments } from '@/hooks/useCommunity';
import { timeAgo } from '@/lib/date';
import { Spinner } from '@/components/ui/Spinner';

export function CommentThread({ postId, onChanged }: { postId: string; onChanged?: () => void }) {
  const { comments, loading, refresh } = useComments(postId);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await addComment(postId, text);
      setText('');
      refresh();
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 space-y-3">
      {loading && <div className="flex justify-center py-2"><Spinner size="sm" /></div>}

      {comments.map(c => (
        <div key={c.id} className="flex gap-2">
          <Link href={`/community/profile/${c.authorUid}`}
            className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
            {c.authorName.charAt(0).toUpperCase()}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-3 py-2">
              <Link href={`/community/profile/${c.authorUid}`} className="text-xs font-semibold text-gray-900 dark:text-gray-100 hover:underline">
                {c.authorName}
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{c.text}</p>
            </div>
            <span className="text-[11px] text-gray-400 ml-3">{timeAgo(c.createdAt)}</span>
          </div>
        </div>
      ))}

      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a reply…"
          className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
        />
        <button type="submit" disabled={!text.trim() || busy}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 disabled:opacity-40">
          {busy ? <Spinner size="sm" /> : <LuSend className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
