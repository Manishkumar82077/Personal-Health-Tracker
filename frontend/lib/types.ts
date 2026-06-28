// ---- Goals & profile ----
export interface Goals {
  calorieGoal: number;
  proteinGoal: number;   // grams
  carbsGoal: number;     // grams
  fatGoal: number;       // grams
  fiberGoal: number;     // grams
  waterGoalMl: number;
  stepGoal: number;
  sleepGoalHours: number;
}

export interface Profile {
  uid: string;
  email: string;
  displayName?: string;
  weightKg?: number;
  goals: Goals;
  createdAt: string;     // ISO 8601
  updatedAt: string;
}

// ---- Nutrition ----
// Micronutrients are an open map so you can add vitamins/minerals freely.
// Keys are nutrient names, values are amounts in the nutrient's usual unit.
export type Micros = Record<string, number>;

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros?: Micros;
}

export interface FoodEntry {
  id: string;
  name: string;
  quantity: number;      // grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micros?: Micros;
  date: string;          // YYYY-MM-DD
  mealId?: string;       // set if logged from a saved meal
  foodItemId?: string;   // set if logged from a library food item
  createdAt: string;
}

// ---- Food library (reusable, searchable single items) ----
export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  defaultQuantity: number; // grams in one serving (e.g. roti = 50)
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type FoodItemInput = Omit<
  FoodItem,
  'id' | 'usageCount' | 'lastUsedAt' | 'createdAt' | 'updatedAt'
>;

// ---- Meals ----
export interface MealItem {
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  quantity: number;      // grams of this item in the meal
  sourceItemId?: string; // library FoodItem this was built from, if any
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  totals: MacroTotals;   // computed by the backend from items
  createdAt: string;
  updatedAt: string;
}

// ---- Water ----
export interface WaterLog {
  id: string;
  amountMl: number;
  date: string;          // YYYY-MM-DD
  createdAt: string;
}

// ---- Workouts ----
export interface Workout {
  id: string;
  exercise: string;
  weightKg: number;
  reps: number;
  sets: number;
  date: string;          // YYYY-MM-DD
  createdAt: string;
  // AI phase adds (optional): caloriesBurned?, intensity?, volume?
}

// ---- Steps (id = date) ----
export interface StepsEntry {
  date: string;          // YYYY-MM-DD (also the doc id)
  count: number;
  updatedAt: string;
}

// ---- Sleep (id = date) ----
export interface SleepEntry {
  date: string;          // YYYY-MM-DD (also the doc id)
  sleepTime: string;     // HH:MM
  wakeTime: string;      // HH:MM
  durationMinutes: number; // computed by the backend
  updatedAt: string;
}

// ---- Dashboard response ----
export interface DashboardTotals {
  calories: number; protein: number; carbs: number; fat: number; fiber: number;
  waterMl: number; steps: number; sleepHours: number;
}

export interface Dashboard {
  date: string;
  goals: Goals;
  totals: DashboardTotals;
  remaining: Omit<DashboardTotals, 'sleepHours'>; // clamped at 0
  progress: Record<string, number>;               // 0..1 per metric
  workouts: Workout[];
}

// ---- Community ----
export interface Post {
  id: string;
  authorUid: string;
  authorName: string;
  text: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  likedByMe?: boolean;
}

export interface Comment {
  id: string;
  authorUid: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface PublicProfile {
  uid: string;
  displayName: string;
  joinedAt: string;
  posts: Post[];
}

export interface Feed {
  posts: Post[];
  nextCursor: string | null;
}

// ---- Error envelope ----
export interface ApiError {
  error: { code: string; message: string };
}
