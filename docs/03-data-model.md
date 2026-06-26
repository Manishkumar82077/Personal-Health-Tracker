# 03 — Data Model

This is the second half of the shared contract. The TypeScript interfaces below go into **both** repos, identically:

- Backend: split across `backend/src/interface/*.model.ts`
- Frontend: all in `frontend/lib/types.ts`

If a type changes, change it in this file first, then update both repos.

## Firestore layout

Everything is nested under the signed-in user, so isolation is automatic and the security rule is trivial.

```
users/{uid}                          ← Profile (fields + goals)
  ├── foodEntries/{autoId}           ← FoodEntry      (many per day, has `date`)
  ├── meals/{autoId}                 ← Meal           (reusable templates)
  ├── waterLogs/{autoId}             ← WaterLog       (many per day, has `date`)
  ├── workouts/{autoId}              ← Workout        (many per day, has `date`)
  ├── steps/{YYYY-MM-DD}             ← StepsEntry     (one per day, id = date)
  └── sleep/{YYYY-MM-DD}             ← SleepEntry     (one per day, id = date)
```

Because the backend uses the Firebase Admin SDK (server-side, fully trusted), Firestore security rules are a backstop rather than the main guard. Still, lock the database down so nothing else can read it:

```
// firestore.rules — deny all client access; only the Admin SDK (backend) gets in
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
  }
}
```

## Query patterns the backend uses

- **A day's food/water/workouts:** `collection('users/{uid}/foodEntries').where('date','==',date)`. Add a Firestore index on `date` if prompted (the console gives you a one-click link).
- **A day's steps/sleep:** direct `doc('users/{uid}/steps/{date}')` get — no query.
- **Dashboard:** run the day's food, water, steps, sleep, and workouts reads in parallel (`Promise.all`), then sum in code.

## TypeScript interfaces

```ts
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
  createdAt: string;
}

// ---- Meals ----
export interface MealItem {
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  fiberPer100: number;
  quantity: number;      // grams of this item in the meal
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

// ---- Error envelope ----
export interface ApiError {
  error: { code: string; message: string };
}
```

## Computation rules (backend owns these)

- **Meal totals:** for each item, `factor = quantity / 100`; multiply each `*Per100` by `factor`; sum across items. Micros sum key-by-key.
- **Logging a meal:** convert each `MealItem` into a `FoodEntry` for the target date — `quantity` = the item's grams, macros = the per-100 values × factor, `mealId` = the meal's id.
- **Sleep duration:** minutes from `sleepTime` to `wakeTime`; if `wakeTime <= sleepTime`, add 24h (slept past midnight).
- **Dashboard `remaining`:** `max(0, goal - total)` per metric.
- **Dashboard `progress`:** `min(1, total / goal)` per metric (guard divide-by-zero when a goal is 0).
