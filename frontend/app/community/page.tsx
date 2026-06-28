'use client';
import { useEffect, useRef, useState } from 'react';
import { LuUsers, LuCircleAlert } from 'react-icons/lu';
import type { Post } from '@/lib/types';
import { useFeed } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/components/community/ChatMessage';
import { ChatComposer } from '@/components/community/ChatComposer';
import { Spinner } from '@/components/ui/Spinner';

export default function CommunityPage() {
  const { posts, loading, error, refresh } = useFeed();
  const { user, mockMode } = useAuth();
  const currentUid = user?.uid ?? (mockMode ? 'mock-user-1' : undefined);

  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the view pinned to the newest message, like a chat.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts.length]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 flex flex-col min-h-[calc(100vh-5rem)]">
      <div className="flex items-center gap-2 mb-4">
        <LuUsers className="w-5 h-5 text-gray-500" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 leading-none">Community</h1>
          <p className="text-xs text-gray-400 mt-0.5">Share progress · react · reply</p>
        </div>
      </div>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {error && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-4 text-sm">
          <LuCircleAlert className="w-4 h-4 flex-shrink-0" />
          Failed to load chat: {(error as Error).message}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <LuUsers className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No messages yet</p>
          <p className="text-xs text-gray-400 mt-1">Say hello to the community 👋</p>
        </div>
      )}

      {/* Message stream */}
      <div className="flex-1 space-y-3 pb-3">
        {posts.map(post => (
          <ChatMessage
            key={post.id}
            post={post}
            currentUid={currentUid}
            onReply={setReplyingTo}
            onChanged={refresh}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatComposer
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSent={refresh}
      />
    </div>
  );
}
