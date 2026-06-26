'use client';
import useSWR from 'swr';
import { getMeals } from '@/lib/api';
import type { Meal } from '@/lib/types';

export function useMeals() {
  const { data, error, isLoading, mutate } = useSWR<Meal[]>('meals', getMeals);
  return { meals: data ?? [], error, loading: isLoading, refresh: mutate };
}
