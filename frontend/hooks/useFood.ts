'use client';
import useSWR, { useSWRConfig } from 'swr';
import { getFood } from '@/lib/api';
import type { FoodEntry } from '@/lib/types';

export function useFood(date: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<FoodEntry[]>(
    `food:${date}`,
    () => getFood(date),
  );

  const refresh = () => {
    mutate();
    mutateGlobal(`dashboard:${date}`);
  };

  return { entries: data ?? [], error, loading: isLoading, refresh };
}
