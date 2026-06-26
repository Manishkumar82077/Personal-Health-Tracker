'use client';
import useSWR, { useSWRConfig } from 'swr';
import { getWorkouts } from '@/lib/api';
import type { Workout } from '@/lib/types';

export function useWorkouts(date: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<Workout[]>(
    `workouts:${date}`,
    () => getWorkouts(date),
  );

  const refresh = () => {
    mutate();
    mutateGlobal(`dashboard:${date}`);
  };

  return { workouts: data ?? [], error, loading: isLoading, refresh };
}
