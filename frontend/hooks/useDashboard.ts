'use client';
import useSWR from 'swr';
import { getDashboard } from '@/lib/api';
import type { Dashboard } from '@/lib/types';

export function useDashboard(date: string) {
  const { data, error, isLoading, mutate } = useSWR<Dashboard>(
    `dashboard:${date}`,
    () => getDashboard(date),
    { revalidateOnFocus: true },
  );
  return { dashboard: data, error, loading: isLoading, refresh: mutate };
}
