import { db } from '../config/firebase';
import { SleepEntry } from '../interface/sleep.model';

const col = (uid: string) => db.collection('users').doc(uid).collection('sleep');

function computeDurationMinutes(sleepTime: string, wakeTime: string): number {
  const [sh, sm] = sleepTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let sleepMins = sh * 60 + sm;
  let wakeMins = wh * 60 + wm;
  if (wakeMins <= sleepMins) wakeMins += 24 * 60;
  return wakeMins - sleepMins;
}

export async function getSleep(uid: string, date: string): Promise<SleepEntry | null> {
  const snap = await col(uid).doc(date).get();
  if (!snap.exists) return null;
  return snap.data() as SleepEntry;
}

export async function upsertSleep(
  uid: string,
  date: string,
  data: { sleepTime: string; wakeTime: string }
): Promise<SleepEntry> {
  const entry: SleepEntry = {
    date,
    sleepTime: data.sleepTime,
    wakeTime: data.wakeTime,
    durationMinutes: computeDurationMinutes(data.sleepTime, data.wakeTime),
    updatedAt: new Date().toISOString(),
  };
  await col(uid).doc(date).set(entry);
  return entry;
}
