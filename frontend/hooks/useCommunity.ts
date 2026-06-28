'use client';
import useSWR from 'swr';
import { getFeed, getPublicProfile } from '@/lib/api';
import type { Feed, PublicProfile } from '@/lib/types';

export function useFeed() {
  const { data, error, isLoading, mutate } = useSWR<Feed>('community:feed', () => getFeed(), {
    refreshInterval: 10000, // periodic refresh for a near-live chat feel
  });
  return { posts: data?.posts ?? [], nextCursor: data?.nextCursor ?? null, error, loading: isLoading, refresh: mutate };
}

export function usePublicProfile(uid: string) {
  const { data, error, isLoading, mutate } = useSWR<PublicProfile>(
    uid ? `community:profile:${uid}` : null,
    () => getPublicProfile(uid),
  );
  return { profile: data, error, loading: isLoading, refresh: mutate };
}
