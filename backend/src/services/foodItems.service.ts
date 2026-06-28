import { db } from '../config/firebase';
import { FoodItem, FoodItemInput } from '../interface/foodItem.model';
import { FoodEntry } from '../interface/food.model';
import { Meal } from '../interface/meal.model';
import { AppError } from '../utils/AppError';

const col = (uid: string) => db.collection('users').doc(uid).collection('foodItems');
const foodCol = (uid: string) => db.collection('users').doc(uid).collection('foodEntries');
const mealCol = (uid: string) => db.collection('users').doc(uid).collection('meals');
const catalogCol = () => db.collection('foodCatalog');     // global shared items
const mealCatalogCol = () => db.collection('mealCatalog');  // global shared meals

export async function getFoodItems(uid: string, q?: string): Promise<FoodItem[]> {
  const [personalSnap, globalSnap] = await Promise.all([col(uid).get(), catalogCol().get()]);
  let items = [
    ...personalSnap.docs.map(d => ({ ...(d.data() as FoodItem), id: d.id })),
    ...globalSnap.docs.map(d => ({ ...(d.data() as FoodItem), id: d.id })),
  ];
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    items = items.filter(it => it.nameLower.includes(needle));
  }
  // Most-used first (personal favourites bubble up), then alphabetical.
  return items.sort((a, b) => (b.usageCount - a.usageCount) || a.name.localeCompare(b.name));
}

/** Combined library payload for the search UI: items + meals in one round trip. */
export async function getLibrary(uid: string): Promise<{ items: FoodItem[]; meals: Meal[] }> {
  const [items, personalMeals, globalMeals] = await Promise.all([
    getFoodItems(uid),
    mealCol(uid).get(),
    mealCatalogCol().get(),
  ]);
  const meals = [
    ...personalMeals.docs.map(d => ({ ...(d.data() as Meal), id: d.id })),
    ...globalMeals.docs.map(d => ({ ...(d.data() as Meal), id: d.id })),
  ];
  return { items, meals };
}

export async function createFoodItem(uid: string, data: FoodItemInput): Promise<FoodItem> {
  const now = new Date().toISOString();
  const ref = col(uid).doc();
  const item: FoodItem = {
    id: ref.id,
    name: data.name,
    nameLower: data.name.toLowerCase(),
    caloriesPer100: data.caloriesPer100,
    proteinPer100: data.proteinPer100,
    carbsPer100: data.carbsPer100,
    fatPer100: data.fatPer100,
    fiberPer100: data.fiberPer100,
    defaultQuantity: data.defaultQuantity,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(item);
  return item;
}

export async function updateFoodItem(
  uid: string,
  id: string,
  data: Partial<FoodItemInput>
): Promise<FoodItem> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Food item not found');

  const current = snap.data() as FoodItem;
  const patch: Partial<FoodItem> = {
    ...data,
    ...(data.name ? { nameLower: data.name.toLowerCase() } : {}),
    updatedAt: new Date().toISOString(),
  };
  await ref.update(patch);
  return { ...current, ...patch, id };
}

export async function deleteFoodItem(uid: string, id: string): Promise<void> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Food item not found');
  await ref.delete();
}

/** Log a library item to a date as a FoodEntry, scaled to `quantity` grams. */
export async function logFoodItem(
  uid: string,
  id: string,
  date: string,
  quantity?: number
): Promise<FoodEntry> {
  // Look in the user's personal items first, then fall back to the global catalog.
  const personalRef = col(uid).doc(id);
  let snap = await personalRef.get();
  const isPersonal = snap.exists;
  if (!snap.exists) snap = await catalogCol().doc(id).get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Food item not found');

  const item = snap.data() as FoodItem;
  const grams = quantity && quantity > 0 ? quantity : item.defaultQuantity;
  const f = grams / 100;
  const now = new Date().toISOString();

  const entryRef = foodCol(uid).doc();
  const entry: FoodEntry = {
    id: entryRef.id,
    name: item.name,
    quantity: grams,
    calories: item.caloriesPer100 * f,
    protein: item.proteinPer100 * f,
    carbs: item.carbsPer100 * f,
    fat: item.fatPer100 * f,
    fiber: item.fiberPer100 * f,
    date,
    foodItemId: id,
    createdAt: now,
  };

  const batch = db.batch();
  batch.set(entryRef, entry);
  // Usage tracking only applies to the user's own items, not the shared catalog.
  if (isPersonal) {
    batch.update(personalRef, { usageCount: (item.usageCount ?? 0) + 1, lastUsedAt: now });
  }
  await batch.commit();

  return entry;
}
