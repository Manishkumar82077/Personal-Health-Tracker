import {
  Dashboard, FoodEntry, FoodItem, FoodItemInput, Meal, WaterLog, Workout,
  StepsEntry, SleepEntry, Profile, Goals,
} from './types';

const NOW = new Date().toISOString();
const TODAY = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const DEFAULT_GOALS: Goals = {
  calorieGoal: 2000, proteinGoal: 120, carbsGoal: 250,
  fatGoal: 65, fiberGoal: 30, waterGoalMl: 3000,
  stepGoal: 10000, sleepGoalHours: 8,
};

const MOCK_PROFILE: Profile = {
  uid: 'mock-user-1',
  email: 'demo@example.com',
  displayName: 'Demo User',
  weightKg: 75,
  goals: DEFAULT_GOALS,
  createdAt: NOW,
  updatedAt: NOW,
};

const MOCK_FOOD: FoodEntry[] = [
  { id: 'f1', name: 'Oatmeal', quantity: 80, calories: 300, protein: 10, carbs: 54, fat: 5, fiber: 8, date: TODAY, createdAt: NOW },
  { id: 'f2', name: 'Banana', quantity: 120, calories: 107, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, date: TODAY, createdAt: NOW },
  { id: 'f3', name: 'Grilled Chicken Breast', quantity: 200, calories: 330, protein: 62, carbs: 0, fat: 7, fiber: 0, date: TODAY, createdAt: NOW },
  { id: 'f4', name: 'Brown Rice', quantity: 200, calories: 230, protein: 5, carbs: 48, fat: 1.8, fiber: 3.5, date: TODAY, createdAt: NOW },
];

const MOCK_WATER: WaterLog[] = [
  { id: 'w1', amountMl: 500, date: TODAY, createdAt: NOW },
  { id: 'w2', amountMl: 300, date: TODAY, createdAt: NOW },
  { id: 'w3', amountMl: 250, date: TODAY, createdAt: NOW },
];

const MOCK_WORKOUTS: Workout[] = [
  { id: 'wo1', exercise: 'Bench Press', weightKg: 80, reps: 8, sets: 4, date: TODAY, createdAt: NOW },
  { id: 'wo2', exercise: 'Squat', weightKg: 100, reps: 5, sets: 5, date: TODAY, createdAt: NOW },
];

const MOCK_STEPS: StepsEntry = { date: TODAY, count: 7842, updatedAt: NOW };

const MOCK_SLEEP: SleepEntry = {
  date: TODAY, sleepTime: '23:00', wakeTime: '07:00',
  durationMinutes: 480, updatedAt: NOW,
};

const MOCK_FOOD_ITEMS: FoodItem[] = [
  { id: 'fi1', name: 'Roti', caloriesPer100: 297, proteinPer100: 11, carbsPer100: 50, fatPer100: 7, fiberPer100: 5, defaultQuantity: 40, usageCount: 12, createdAt: NOW, updatedAt: NOW },
  { id: 'fi2', name: 'Boiled Egg', caloriesPer100: 155, proteinPer100: 13, carbsPer100: 1.1, fatPer100: 11, fiberPer100: 0, defaultQuantity: 50, usageCount: 8, createdAt: NOW, updatedAt: NOW },
  { id: 'fi3', name: 'Apple', caloriesPer100: 52, proteinPer100: 0.3, carbsPer100: 14, fatPer100: 0.2, fiberPer100: 2.4, defaultQuantity: 150, usageCount: 3, createdAt: NOW, updatedAt: NOW },
];

const MOCK_MEALS: Meal[] = [
  {
    id: 'm1', name: 'Rice + Dal',
    items: [
      { name: 'Cooked rice', caloriesPer100: 130, proteinPer100: 2.7, carbsPer100: 28, fatPer100: 0.3, fiberPer100: 0.4, quantity: 300 },
      { name: 'Cooked dal',  caloriesPer100: 116, proteinPer100: 9, carbsPer100: 20, fatPer100: 0.4, fiberPer100: 8, quantity: 200 },
    ],
    totals: { calories: 623, protein: 26.1, carbs: 124, fat: 1.7, fiber: 17.2 },
    createdAt: NOW, updatedAt: NOW,
  },
];

function calcDashboard(date: string): Dashboard {
  const dayFood = MOCK_FOOD.filter(f => f.date === date);
  const dayWater = MOCK_WATER.filter(w => w.date === date);
  const dayWorkouts = MOCK_WORKOUTS.filter(w => w.date === date);

  const totals = {
    calories: dayFood.reduce((s, f) => s + f.calories, 0),
    protein:  dayFood.reduce((s, f) => s + f.protein, 0),
    carbs:    dayFood.reduce((s, f) => s + f.carbs, 0),
    fat:      dayFood.reduce((s, f) => s + f.fat, 0),
    fiber:    dayFood.reduce((s, f) => s + f.fiber, 0),
    waterMl:  dayWater.reduce((s, w) => s + w.amountMl, 0),
    steps:    date === TODAY ? MOCK_STEPS.count : 0,
    sleepHours: date === TODAY ? MOCK_SLEEP.durationMinutes / 60 : 0,
  };

  const g = MOCK_PROFILE.goals;
  const clamp = (v: number) => Math.max(0, v);
  const prog = (v: number, goal: number) => goal > 0 ? Math.min(1, v / goal) : 0;

  return {
    date,
    goals: g,
    totals,
    remaining: {
      calories: clamp(g.calorieGoal - totals.calories),
      protein:  clamp(g.proteinGoal - totals.protein),
      carbs:    clamp(g.carbsGoal - totals.carbs),
      fat:      clamp(g.fatGoal - totals.fat),
      fiber:    clamp(g.fiberGoal - totals.fiber),
      waterMl:  clamp(g.waterGoalMl - totals.waterMl),
      steps:    clamp(g.stepGoal - totals.steps),
    },
    progress: {
      calories: prog(totals.calories, g.calorieGoal),
      protein:  prog(totals.protein, g.proteinGoal),
      carbs:    prog(totals.carbs, g.carbsGoal),
      fat:      prog(totals.fat, g.fatGoal),
      fiber:    prog(totals.fiber, g.fiberGoal),
      water:    prog(totals.waterMl, g.waterGoalMl),
      steps:    prog(totals.steps, g.stepGoal),
      sleep:    prog(totals.sleepHours, g.sleepGoalHours),
    },
    workouts: dayWorkouts,
  };
}

let nextId = 100;
const uid = () => String(++nextId);

export const mockApi = {
  // Profile
  getProfile: async (): Promise<Profile> => structuredClone(MOCK_PROFILE),
  updateProfile: async (body: Partial<Goals> & { weightKg?: number; displayName?: string }): Promise<Profile> => {
    Object.assign(MOCK_PROFILE.goals, body);
    if (body.weightKg !== undefined) MOCK_PROFILE.weightKg = body.weightKg;
    if (body.displayName !== undefined) MOCK_PROFILE.displayName = body.displayName;
    MOCK_PROFILE.updatedAt = new Date().toISOString();
    return structuredClone(MOCK_PROFILE);
  },

  // Dashboard
  getDashboard: async (date: string): Promise<Dashboard> => calcDashboard(date),

  // Food
  getFood: async (date: string): Promise<FoodEntry[]> => MOCK_FOOD.filter(f => f.date === date),
  addFood: async (body: Omit<FoodEntry, 'id' | 'createdAt'>): Promise<FoodEntry> => {
    const entry: FoodEntry = { ...body, id: uid(), createdAt: new Date().toISOString() };
    MOCK_FOOD.push(entry);
    return structuredClone(entry);
  },
  deleteFood: async (id: string): Promise<void> => {
    const i = MOCK_FOOD.findIndex(f => f.id === id);
    if (i !== -1) MOCK_FOOD.splice(i, 1);
  },

  // Food library (single items)
  getLibrary: async (): Promise<{ items: FoodItem[]; meals: Meal[] }> => ({
    items: structuredClone(MOCK_FOOD_ITEMS).sort((a, b) => b.usageCount - a.usageCount),
    meals: structuredClone(MOCK_MEALS),
  }),
  getFoodItems: async (q?: string): Promise<FoodItem[]> => {
    let items = structuredClone(MOCK_FOOD_ITEMS);
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase();
      items = items.filter(it => it.name.toLowerCase().includes(needle));
    }
    return items.sort((a, b) => (b.usageCount - a.usageCount) || a.name.localeCompare(b.name));
  },
  addFoodItem: async (body: FoodItemInput): Promise<FoodItem> => {
    const now = new Date().toISOString();
    const item: FoodItem = { ...body, id: uid(), usageCount: 0, createdAt: now, updatedAt: now };
    MOCK_FOOD_ITEMS.push(item);
    return structuredClone(item);
  },
  updateFoodItem: async (id: string, body: Partial<FoodItemInput>): Promise<FoodItem> => {
    const item = MOCK_FOOD_ITEMS.find(i => i.id === id);
    if (!item) throw new Error('Food item not found');
    Object.assign(item, body, { updatedAt: new Date().toISOString() });
    return structuredClone(item);
  },
  deleteFoodItem: async (id: string): Promise<void> => {
    const i = MOCK_FOOD_ITEMS.findIndex(it => it.id === id);
    if (i !== -1) MOCK_FOOD_ITEMS.splice(i, 1);
  },
  logFoodItem: async (id: string, date: string, quantity?: number): Promise<FoodEntry> => {
    const item = MOCK_FOOD_ITEMS.find(i => i.id === id);
    if (!item) throw new Error('Food item not found');
    const grams = quantity && quantity > 0 ? quantity : item.defaultQuantity;
    const f = grams / 100;
    const entry: FoodEntry = {
      id: uid(), name: item.name, quantity: grams,
      calories: item.caloriesPer100 * f, protein: item.proteinPer100 * f,
      carbs: item.carbsPer100 * f, fat: item.fatPer100 * f, fiber: item.fiberPer100 * f,
      date, foodItemId: id, createdAt: new Date().toISOString(),
    };
    MOCK_FOOD.push(entry);
    item.usageCount += 1;
    item.lastUsedAt = entry.createdAt;
    return structuredClone(entry);
  },

  // Meals
  getMeals: async (): Promise<Meal[]> => structuredClone(MOCK_MEALS),
  addMeal: async (body: { name: string; items: Meal['items'] }): Promise<Meal> => {
    const totals = body.items.reduce(
      (acc, item) => {
        const f = item.quantity / 100;
        acc.calories += item.caloriesPer100 * f;
        acc.protein  += item.proteinPer100 * f;
        acc.carbs    += item.carbsPer100 * f;
        acc.fat      += item.fatPer100 * f;
        acc.fiber    += item.fiberPer100 * f;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
    const meal: Meal = { ...body, id: uid(), totals, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    MOCK_MEALS.push(meal);
    return structuredClone(meal);
  },
  updateMeal: async (id: string, body: { name?: string; items?: Meal['items'] }): Promise<Meal> => {
    const meal = MOCK_MEALS.find(m => m.id === id);
    if (!meal) throw new Error('Meal not found');
    if (body.name !== undefined) meal.name = body.name;
    if (body.items !== undefined) {
      meal.items = body.items;
      meal.totals = body.items.reduce(
        (acc, item) => {
          const f = item.quantity / 100;
          acc.calories += item.caloriesPer100 * f;
          acc.protein  += item.proteinPer100 * f;
          acc.carbs    += item.carbsPer100 * f;
          acc.fat      += item.fatPer100 * f;
          acc.fiber    += item.fiberPer100 * f;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );
    }
    meal.updatedAt = new Date().toISOString();
    return structuredClone(meal);
  },
  deleteMeal: async (id: string): Promise<void> => {
    const i = MOCK_MEALS.findIndex(m => m.id === id);
    if (i !== -1) MOCK_MEALS.splice(i, 1);
  },
  logMeal: async (id: string, date: string): Promise<{ entries: FoodEntry[] }> => {
    const meal = MOCK_MEALS.find(m => m.id === id);
    if (!meal) throw new Error('Meal not found');
    const entries: FoodEntry[] = meal.items.map(item => {
      const f = item.quantity / 100;
      const entry: FoodEntry = {
        id: uid(), name: item.name, quantity: item.quantity,
        calories: item.caloriesPer100 * f, protein: item.proteinPer100 * f,
        carbs: item.carbsPer100 * f, fat: item.fatPer100 * f,
        fiber: item.fiberPer100 * f, date, mealId: id,
        createdAt: new Date().toISOString(),
      };
      MOCK_FOOD.push(entry);
      return entry;
    });
    return { entries };
  },

  // Water
  getWater: async (date: string): Promise<{ logs: WaterLog[]; totalMl: number }> => {
    const logs = MOCK_WATER.filter(w => w.date === date);
    return { logs, totalMl: logs.reduce((s, w) => s + w.amountMl, 0) };
  },
  addWater: async (body: { amountMl: number; date: string }): Promise<WaterLog> => {
    const entry: WaterLog = { ...body, id: uid(), createdAt: new Date().toISOString() };
    MOCK_WATER.push(entry);
    return structuredClone(entry);
  },
  deleteWater: async (id: string): Promise<void> => {
    const i = MOCK_WATER.findIndex(w => w.id === id);
    if (i !== -1) MOCK_WATER.splice(i, 1);
  },

  // Workouts
  getWorkouts: async (date: string): Promise<Workout[]> => MOCK_WORKOUTS.filter(w => w.date === date),
  addWorkout: async (body: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> => {
    const entry: Workout = { ...body, id: uid(), createdAt: new Date().toISOString() };
    MOCK_WORKOUTS.push(entry);
    return structuredClone(entry);
  },
  deleteWorkout: async (id: string): Promise<void> => {
    const i = MOCK_WORKOUTS.findIndex(w => w.id === id);
    if (i !== -1) MOCK_WORKOUTS.splice(i, 1);
  },

  // Steps
  getSteps: async (date: string): Promise<StepsEntry> =>
    date === TODAY ? structuredClone(MOCK_STEPS) : { date, count: 0, updatedAt: NOW },
  updateSteps: async (date: string, count: number): Promise<StepsEntry> => {
    MOCK_STEPS.date = date; MOCK_STEPS.count = count; MOCK_STEPS.updatedAt = new Date().toISOString();
    return structuredClone(MOCK_STEPS);
  },

  // Sleep
  getSleep: async (date: string): Promise<SleepEntry | null> =>
    date === TODAY ? structuredClone(MOCK_SLEEP) : null,
  updateSleep: async (date: string, body: { sleepTime: string; wakeTime: string }): Promise<SleepEntry> => {
    const [sh, sm] = body.sleepTime.split(':').map(Number);
    const [wh, wm] = body.wakeTime.split(':').map(Number);
    let duration = (wh * 60 + wm) - (sh * 60 + sm);
    if (duration <= 0) duration += 24 * 60;
    const entry: SleepEntry = { date, ...body, durationMinutes: duration, updatedAt: new Date().toISOString() };
    Object.assign(MOCK_SLEEP, entry);
    return structuredClone(entry);
  },
};
