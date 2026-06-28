'use client';
import { useState } from 'react';
import { LuSend, LuX, LuReply } from 'react-icons/lu';
import type { Post } from '@/lib/types';
import { createPost } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  replyingTo: Post | null;
  onCancelReply: () => void;
  onSent: () => void;
}

export function ChatComposer({ replyingTo, onCancelReply, onSent }: Props) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await createPost(text, replyingTo?.id);
      setText('');
      onCancelReply();
      onSent();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sticky bottom-20 z-30 -mx-4 px-4 pb-2">
      {replyingTo && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-xl px-3 py-2 text-xs">
          <LuReply className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-gray-700 dark:text-gray-200">{replyingTo.authorName}</span>
            <p className="text-gray-500 dark:text-gray-400 truncate">{replyingTo.text}</p>
          </div>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <LuX className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={submit} className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-1.5 shadow-sm">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message the community…"
          maxLength={1000}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
        />
        <button type="submit" disabled={!text.trim() || busy}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 disabled:opacity-40 flex-shrink-0">
          {busy ? <Spinner size="sm" /> : <LuSend className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
