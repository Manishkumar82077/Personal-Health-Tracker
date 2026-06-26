'use client';
import useSWR from 'swr';
import { getProfile } from '@/lib/api';
import type { Profile } from '@/lib/types';

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<Profile>('profile', getProfile);
  return { profile: data ?? null, error, loading: isLoading, refresh: mutate };
}
