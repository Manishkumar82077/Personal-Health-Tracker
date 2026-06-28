import { db } from '../config/firebase';
import { Meal, MealItem } from '../interface/meal.model';
import { FoodEntry, MacroTotals } from '../interface/food.model';
import { AppError } from '../utils/AppError';

// Global shared meal library.
const col = () => db.collection('mealList');
// Daily food log stays per-user.
const foodCol = (uid: string) => db.collection('users').doc(uid).collection('foodEntries');

function computeTotals(items: MealItem[]): MacroTotals {
  return items.reduce(
    (acc, item) => {
      const f = item.quantity / 100;
      return {
        calories: acc.calories + item.caloriesPer100 * f,
        protein: acc.protein + item.proteinPer100 * f,
        carbs: acc.carbs + item.carbsPer100 * f,
        fat: acc.fat + item.fatPer100 * f,
        fiber: acc.fiber + item.fiberPer100 * f,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

export async function getMeals(): Promise<Meal[]> {
  const snap = await col().get();
  return snap.docs.map(d => ({ ...(d.data() as Meal), id: d.id }));
}

export async function createMeal(data: { name: string; items: MealItem[] }): Promise<Meal> {
  // Avoid duplicates — if a meal with the same name already exists, reuse it.
  const existing = await col().where('name', '==', data.name).limit(1).get();
  if (!existing.empty) {
    const doc = existing.docs[0];
    return { ...(doc.data() as Meal), id: doc.id };
  }

  const now = new Date().toISOString();
  const ref = col().doc();
  const meal: Meal = {
    id: ref.id,
    name: data.name,
    items: data.items,
    totals: computeTotals(data.items),
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(meal);
  return meal;
}

export async function updateMeal(
  id: string,
  data: { name?: string; items?: MealItem[] }
): Promise<Meal> {
  const ref = col().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Meal not found');

  const current = snap.data() as Meal;
  const now = new Date().toISOString();
  const updatedItems = data.items ?? current.items;
  const patch = {
    name: data.name ?? current.name,
    items: updatedItems,
    totals: computeTotals(updatedItems),
    updatedAt: now,
  };

  await ref.update(patch);
  return { ...current, ...patch, id };
}

export async function deleteMeal(id: string): Promise<void> {
  const ref = col().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Meal not found');
  await ref.delete();
}

/** Log a shared meal to a user's day, expanding its items into FoodEntries. */
export async function logMeal(uid: string, mealId: string, date: string): Promise<FoodEntry[]> {
  const mealSnap = await col().doc(mealId).get();
  if (!mealSnap.exists) throw new AppError(404, 'NOT_FOUND', 'Meal not found');

  const meal = mealSnap.data() as Meal;
  const now = new Date().toISOString();
  const entries: FoodEntry[] = [];
  const batch = db.batch();

  for (const item of meal.items) {
    const f = item.quantity / 100;
    const ref = foodCol(uid).doc();
    const entry: FoodEntry = {
      id: ref.id,
      name: item.name,
      quantity: item.quantity,
      calories: item.caloriesPer100 * f,
      protein: item.proteinPer100 * f,
      carbs: item.carbsPer100 * f,
      fat: item.fatPer100 * f,
      fiber: item.fiberPer100 * f,
      date,
      mealId,
      createdAt: now,
    };
    batch.set(ref, entry);
    entries.push(entry);
  }

  await batch.commit();
  return entries;
}
