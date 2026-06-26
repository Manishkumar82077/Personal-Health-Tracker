'use client';
import useSWR, { useSWRConfig } from 'swr';
import { getSteps } from '@/lib/api';
import type { StepsEntry } from '@/lib/types';

export function useSteps(date: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<StepsEntry>(
    `steps:${date}`,
    () => getSteps(date),
  );

  const refresh = () => {
    mutate();
    mutateGlobal(`dashboard:${date}`);
  };

  return { steps: data, error, loading: isLoading, refresh };
}
