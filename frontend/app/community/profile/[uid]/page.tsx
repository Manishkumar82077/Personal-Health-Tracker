'use client';
import { useParams } from 'next/navigation';
import { LuCircleAlert } from 'react-icons/lu';
import { usePublicProfile } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from '@/components/community/PostCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/PageHeader';

export default function PublicProfilePage() {
  const params = useParams<{ uid: string }>();
  const uid = params.uid;
  const { profile, loading, error, refresh } = usePublicProfile(uid);
  const { user, mockMode } = useAuth();
  const currentUid = user?.uid ?? (mockMode ? 'mock-user-1' : undefined);

  const joined = profile
    ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <PageHeader title="Profile" backHref="/community" />

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {error && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl p-4 text-sm">
          <LuCircleAlert className="w-4 h-4 flex-shrink-0" />
          Failed to load profile: {(error as Error).message}
        </div>
      )}

      {profile && (
        <>
          <Card className="p-5 mb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 truncate">{profile.displayName}</h2>
              <p className="text-xs text-gray-400">Joined {joined} · {profile.posts.length} post{profile.posts.length !== 1 ? 's' : ''}</p>
            </div>
          </Card>

          {profile.posts.length === 0 ? (
            <Card className="p-8 text-center text-sm text-gray-400">No posts yet</Card>
          ) : (
            <div className="space-y-3">
              {profile.posts.map(post => (
                <PostCard key={post.id} post={post} currentUid={currentUid} onChanged={refresh} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
