'use client';
import useSWR from 'swr';
import { getFeed, getComments, getPublicProfile } from '@/lib/api';
import type { Feed, Comment, PublicProfile } from '@/lib/types';

export function useFeed() {
  const { data, error, isLoading, mutate } = useSWR<Feed>('community:feed', () => getFeed(), {
    refreshInterval: 15000, // periodic refresh for a near-live feel
  });
  return { posts: data?.posts ?? [], nextCursor: data?.nextCursor ?? null, error, loading: isLoading, refresh: mutate };
}

export function useComments(postId: string) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    `community:comments:${postId}`,
    () => getComments(postId),
  );
  return { comments: data ?? [], error, loading: isLoading, refresh: mutate };
}

export function usePublicProfile(uid: string) {
  const { data, error, isLoading, mutate } = useSWR<PublicProfile>(
    uid ? `community:profile:${uid}` : null,
    () => getPublicProfile(uid),
  );
  return { profile: data, error, loading: isLoading, refresh: mutate };
}
