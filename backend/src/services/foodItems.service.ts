import { db } from '../config/firebase';
import { FoodItem, FoodItemInput } from '../interface/foodItem.model';
import { FoodEntry } from '../interface/food.model';
import { Meal } from '../interface/meal.model';
import { AppError } from '../utils/AppError';

// Global shared library — every user reads from and writes to these.
const itemCol = () => db.collection('itemList');
const mealCol = () => db.collection('mealList');
// Daily food log stays per-user.
const foodCol = (uid: string) => db.collection('users').doc(uid).collection('foodEntries');

export async function getFoodItems(q?: string): Promise<FoodItem[]> {
  const snap = await itemCol().get();
  let items = snap.docs.map(d => ({ ...(d.data() as FoodItem), id: d.id }));
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    items = items.filter(it => it.nameLower.includes(needle));
  }
  // Most-used first, then alphabetical.
  return items.sort((a, b) => (b.usageCount - a.usageCount) || a.name.localeCompare(b.name));
}

/** Combined library payload for the search UI: shared items + meals in one round trip. */
export async function getLibrary(): Promise<{ items: FoodItem[]; meals: Meal[] }> {
  const [items, mealSnap] = await Promise.all([getFoodItems(), mealCol().get()]);
  const meals = mealSnap.docs.map(d => ({ ...(d.data() as Meal), id: d.id }));
  return { items, meals };
}

export async function createFoodItem(data: FoodItemInput): Promise<FoodItem> {
  // Avoid duplicates — if an item with the same name already exists, reuse it.
  const nameLower = data.name.toLowerCase();
  const existing = await itemCol().where('nameLower', '==', nameLower).limit(1).get();
  if (!existing.empty) {
    const doc = existing.docs[0];
    return { ...(doc.data() as FoodItem), id: doc.id };
  }

  const now = new Date().toISOString();
  const ref = itemCol().doc();
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

export async function updateFoodItem(id: string, data: Partial<FoodItemInput>): Promise<FoodItem> {
  const ref = itemCol().doc(id);
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

export async function deleteFoodItem(id: string): Promise<void> {
  const ref = itemCol().doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Food item not found');
  await ref.delete();
}

/** Log a shared item to a user's day as a FoodEntry, scaled to `quantity` grams. */
export async function logFoodItem(
  uid: string,
  id: string,
  date: string,
  quantity?: number
): Promise<FoodEntry> {
  const ref = itemCol().doc(id);
  const snap = await ref.get();
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
  batch.update(ref, { usageCount: (item.usageCount ?? 0) + 1, lastUsedAt: now });
  await batch.commit();

  return entry;
}
