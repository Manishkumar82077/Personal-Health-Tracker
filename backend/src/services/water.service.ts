import { db } from '../config/firebase';
import { WaterLog } from '../interface/water.model';
import { AppError } from '../utils/AppError';

const col = (uid: string) => db.collection('users').doc(uid).collection('waterLogs');

export async function getWaterByDate(
  uid: string,
  date: string
): Promise<{ logs: WaterLog[]; totalMl: number }> {
  const snap = await col(uid).where('date', '==', date).get();
  const logs = snap.docs.map(d => ({ ...(d.data() as WaterLog), id: d.id }));
  const totalMl = logs.reduce((sum, l) => sum + l.amountMl, 0);
  return { logs, totalMl };
}

export async function createWater(
  uid: string,
  data: { amountMl: number; date: string }
): Promise<WaterLog> {
  const ref = col(uid).doc();
  const log: WaterLog = { id: ref.id, ...data, createdAt: new Date().toISOString() };
  await ref.set(log);
  return log;
}

export async function deleteWater(uid: string, id: string): Promise<void> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Water log not found');
  await ref.delete();
}
