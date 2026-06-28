import { mockApi } from './mock';
import type { Dashboard, FoodEntry, FoodItem, FoodItemInput, Meal, WaterLog, Workout, StepsEntry, SleepEntry, Profile, Goals, Post, Comment, PublicProfile, Feed } from './types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// Injected by AuthProvider — avoids circular imports
let _getToken: (() => Promise<string | null>) | null = null;
export function setTokenProvider(fn: () => Promise<string | null>) {
  _getToken = fn;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = _getToken ? await _getToken() : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (res.status === 204) return undefined as T;

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message ?? `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { code?: string };
    err.code = json?.error?.code;
    throw err;
  }
  return json as T;
}

// ---- Profile ----
export const getProfile  = (): Promise<Profile> =>
  USE_MOCK ? mockApi.getProfile() : request('/profile');
export const updateProfile = (body: Partial<Goals> & { weightKg?: number; displayName?: string }): Promise<Profile> =>
  USE_MOCK ? mockApi.updateProfile(body) : request('/profile', { method: 'PUT', body: JSON.stringify(body) });

// ---- Dashboard ----
export const getDashboard = (date: string): Promise<Dashboard> =>
  USE_MOCK ? mockApi.getDashboard(date) : request(`/dashboard?date=${date}`);

// ---- Food ----
export const getFood   = (date: string): Promise<FoodEntry[]> =>
  USE_MOCK ? mockApi.getFood(date) : request(`/food?date=${date}`);
export const addFood   = (body: Omit<FoodEntry, 'id' | 'createdAt'>): Promise<FoodEntry> =>
  USE_MOCK ? mockApi.addFood(body) : request('/food', { method: 'POST', body: JSON.stringify(body) });
export const deleteFood = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deleteFood(id) : request(`/food/${id}`, { method: 'DELETE' });

// ---- Food library (single items) ----
export const getLibrary = (): Promise<{ items: FoodItem[]; meals: Meal[] }> =>
  USE_MOCK ? mockApi.getLibrary() : request('/food-items/library');
export const getFoodItems = (q?: string): Promise<FoodItem[]> =>
  USE_MOCK ? mockApi.getFoodItems(q) : request(`/food-items${q ? `?q=${encodeURIComponent(q)}` : ''}`);
export const addFoodItem = (body: FoodItemInput): Promise<FoodItem> =>
  USE_MOCK ? mockApi.addFoodItem(body) : request('/food-items', { method: 'POST', body: JSON.stringify(body) });
export const updateFoodItem = (id: string, body: Partial<FoodItemInput>): Promise<FoodItem> =>
  USE_MOCK ? mockApi.updateFoodItem(id, body) : request(`/food-items/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteFoodItem = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deleteFoodItem(id) : request(`/food-items/${id}`, { method: 'DELETE' });
export const logFoodItem = (id: string, date: string, quantity?: number): Promise<FoodEntry> =>
  USE_MOCK ? mockApi.logFoodItem(id, date, quantity) : request(`/food-items/${id}/log`, { method: 'POST', body: JSON.stringify({ date, quantity }) });

// ---- Meals ----
export const getMeals   = (): Promise<Meal[]> =>
  USE_MOCK ? mockApi.getMeals() : request('/meals');
export const addMeal    = (body: { name: string; items: Meal['items'] }): Promise<Meal> =>
  USE_MOCK ? mockApi.addMeal(body) : request('/meals', { method: 'POST', body: JSON.stringify(body) });
export const updateMeal = (id: string, body: { name?: string; items?: Meal['items'] }): Promise<Meal> =>
  USE_MOCK ? mockApi.updateMeal(id, body) : request(`/meals/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteMeal = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deleteMeal(id) : request(`/meals/${id}`, { method: 'DELETE' });
export const logMeal    = (id: string, date: string): Promise<{ entries: FoodEntry[] }> =>
  USE_MOCK ? mockApi.logMeal(id, date) : request(`/meals/${id}/log`, { method: 'POST', body: JSON.stringify({ date }) });

// ---- Water ----
export const getWater   = (date: string): Promise<{ logs: WaterLog[]; totalMl: number }> =>
  USE_MOCK ? mockApi.getWater(date) : request(`/water?date=${date}`);
export const addWater   = (body: { amountMl: number; date: string }): Promise<WaterLog> =>
  USE_MOCK ? mockApi.addWater(body) : request('/water', { method: 'POST', body: JSON.stringify(body) });
export const deleteWater = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deleteWater(id) : request(`/water/${id}`, { method: 'DELETE' });

// ---- Workouts ----
export const getWorkouts   = (date: string): Promise<Workout[]> =>
  USE_MOCK ? mockApi.getWorkouts(date) : request(`/workouts?date=${date}`);
export const addWorkout    = (body: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> =>
  USE_MOCK ? mockApi.addWorkout(body) : request('/workouts', { method: 'POST', body: JSON.stringify(body) });
export const deleteWorkout = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deleteWorkout(id) : request(`/workouts/${id}`, { method: 'DELETE' });

// ---- Steps ----
export const getSteps    = (date: string): Promise<StepsEntry> =>
  USE_MOCK ? mockApi.getSteps(date) : request(`/steps?date=${date}`);
export const updateSteps = (date: string, count: number): Promise<StepsEntry> =>
  USE_MOCK ? mockApi.updateSteps(date, count) : request(`/steps/${date}`, { method: 'PUT', body: JSON.stringify({ count }) });

// ---- Community ----
export const getFeed = (cursor?: string): Promise<Feed> =>
  USE_MOCK ? mockApi.getFeed(cursor) : request(`/community/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
export const createPost = (text: string): Promise<Post> =>
  USE_MOCK ? mockApi.createPost(text) : request('/community/posts', { method: 'POST', body: JSON.stringify({ text }) });
export const deletePost = (id: string): Promise<void> =>
  USE_MOCK ? mockApi.deletePost(id) : request(`/community/posts/${id}`, { method: 'DELETE' });
export const getComments = (postId: string): Promise<Comment[]> =>
  USE_MOCK ? mockApi.getComments(postId) : request(`/community/posts/${postId}/comments`);
export const addComment = (postId: string, text: string): Promise<Comment> =>
  USE_MOCK ? mockApi.addComment(postId, text) : request(`/community/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const toggleLike = (postId: string): Promise<{ liked: boolean; likeCount: number }> =>
  USE_MOCK ? mockApi.toggleLike(postId) : request(`/community/posts/${postId}/like`, { method: 'POST' });
export const getPublicProfile = (uid: string): Promise<PublicProfile> =>
  USE_MOCK ? mockApi.getPublicProfile(uid) : request(`/community/profile/${uid}`);

// ---- Sleep ----
export const getSleep    = (date: string): Promise<SleepEntry | null> =>
  USE_MOCK ? mockApi.getSleep(date) : request(`/sleep?date=${date}`);
export const updateSleep = (date: string, body: { sleepTime: string; wakeTime: string }): Promise<SleepEntry> =>
  USE_MOCK ? mockApi.updateSleep(date, body) : request(`/sleep/${date}`, { method: 'PUT', body: JSON.stringify(body) });
