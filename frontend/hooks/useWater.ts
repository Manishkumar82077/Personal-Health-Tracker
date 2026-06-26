'use client';
import useSWR, { useSWRConfig } from 'swr';
import { getWater } from '@/lib/api';
import type { WaterLog } from '@/lib/types';

interface WaterData { logs: WaterLog[]; totalMl: number }

export function useWater(date: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, error, isLoading, mutate } = useSWR<WaterData>(
    `water:${date}`,
    () => getWater(date),
  );

  const refresh = () => {
    mutate();
    mutateGlobal(`dashboard:${date}`);
  };

  return { logs: data?.logs ?? [], totalMl: data?.totalMl ?? 0, error, loading: isLoading, refresh };
}
