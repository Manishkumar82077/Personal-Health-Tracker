import { db } from '../config/firebase';
import { StepsEntry } from '../interface/steps.model';

const col = (uid: string) => db.collection('users').doc(uid).collection('steps');

export async function getSteps(uid: string, date: string): Promise<StepsEntry> {
  const snap = await col(uid).doc(date).get();
  if (!snap.exists) return { date, count: 0, updatedAt: new Date().toISOString() };
  return snap.data() as StepsEntry;
}

export async function upsertSteps(uid: string, date: string, count: number): Promise<StepsEntry> {
  const entry: StepsEntry = { date, count, updatedAt: new Date().toISOString() };
  await col(uid).doc(date).set(entry);
  return entry;
}
