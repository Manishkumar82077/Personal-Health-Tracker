'use client';
import useSWR from 'swr';
import { getLibrary } from '@/lib/api';
import type { FoodItem, Meal } from '@/lib/types';

export function useLibrary() {
  const { data, error, isLoading, mutate } = useSWR<{ items: FoodItem[]; meals: Meal[] }>(
    'library',
    getLibrary,
  );
  return {
    items: data?.items ?? [],
    meals: data?.meals ?? [],
    error,
    loading: isLoading,
    refresh: mutate,
  };
}
