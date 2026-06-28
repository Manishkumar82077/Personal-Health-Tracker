'use client';
import { useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { createPost } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function PostComposer({ onPosted }: { onPosted: () => void }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await createPost(text);
      setText('');
      onPosted();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Share your progress or ask the community…"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!text.trim() || busy}>
            {busy ? <Spinner size="sm" /> : <LuSend className="w-4 h-4" />}
            {busy ? 'Posting…' : 'Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
