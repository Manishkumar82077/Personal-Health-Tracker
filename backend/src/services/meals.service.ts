import { db } from '../config/firebase';
import { Meal, MealItem } from '../interface/meal.model';
import { FoodEntry, MacroTotals } from '../interface/food.model';
import { AppError } from '../utils/AppError';

const col = (uid: string) => db.collection('users').doc(uid).collection('meals');
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

export async function getMeals(uid: string): Promise<Meal[]> {
  const snap = await col(uid).get();
  return snap.docs.map(d => ({ ...(d.data() as Meal), id: d.id }));
}

export async function createMeal(
  uid: string,
  data: { name: string; items: MealItem[] }
): Promise<Meal> {
  const now = new Date().toISOString();
  const ref = col(uid).doc();
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
  uid: string,
  id: string,
  data: { name?: string; items?: MealItem[] }
): Promise<Meal> {
  const ref = col(uid).doc(id);
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

export async function deleteMeal(uid: string, id: string): Promise<void> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Meal not found');
  await ref.delete();
}

export async function logMeal(uid: string, mealId: string, date: string): Promise<FoodEntry[]> {
  const mealSnap = await col(uid).doc(mealId).get();
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
