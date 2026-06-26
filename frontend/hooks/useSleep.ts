'use client';
import useSWR, { useSWRConfig } from 'swr';
import { getSleep } from '@/lib/api';
import type { SleepEntry } from '@/lib/types';

export function useSleep(date: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<SleepEntry | null>(
    `sleep:${date}`,
    () => getSleep(date),
  );

  const refresh = () => {
    mutate();
    mutateGlobal(`dashboard:${date}`);
  };

  return { sleep: data ?? null, error, loading: isLoading, refresh };
}
