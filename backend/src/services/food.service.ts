import { db } from '../config/firebase';
import { FoodEntry } from '../interface/food.model';
import { AppError } from '../utils/AppError';

const col = (uid: string) => db.collection('users').doc(uid).collection('foodEntries');

export async function getFoodByDate(uid: string, date: string): Promise<FoodEntry[]> {
  const snap = await col(uid).where('date', '==', date).get();
  return snap.docs.map(d => ({ ...(d.data() as FoodEntry), id: d.id }));
}

export async function createFood(
  uid: string,
  data: Omit<FoodEntry, 'id' | 'createdAt'>
): Promise<FoodEntry> {
  const ref = col(uid).doc();
  const entry: FoodEntry = { ...data, id: ref.id, createdAt: new Date().toISOString() };
  await ref.set(entry);
  return entry;
}

export async function deleteFood(uid: string, id: string): Promise<void> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Food entry not found');
  await ref.delete();
}
