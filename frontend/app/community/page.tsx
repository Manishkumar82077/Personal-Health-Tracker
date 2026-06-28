'use client';
import { LuUsers, LuCircleAlert } from 'react-icons/lu';
import { useFeed } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { PostComposer } from '@/components/community/PostComposer';
import { PostCard } from '@/components/community/PostCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function CommunityPage() {
  const { posts, loading, error, refresh } = useFeed();
  const { user, mockMode } = useAuth();
  const currentUid = user?.uid ?? (mockMode ? 'mock-user-1' : undefined);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Community" subtitle="Share progress & cheer each other on" />

      <PostComposer onPosted={refresh} />

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {error && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-4 text-sm">
          <LuCircleAlert className="w-4 h-4 flex-shrink-0" />
          Failed to load feed: {(error as Error).message}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <Card className="p-8 text-center">
          <LuUsers className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No posts yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to share something!</p>
        </Card>
      )}

      <div className="space-y-3">
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUid={currentUid} onChanged={refresh} />
        ))}
      </div>
    </div>
  );
}
