import { db } from '../config/firebase';
import { Workout } from '../interface/workout.model';
import { AppError } from '../utils/AppError';

const col = (uid: string) => db.collection('users').doc(uid).collection('workouts');

export async function getWorkoutsByDate(uid: string, date: string): Promise<Workout[]> {
  const snap = await col(uid).where('date', '==', date).get();
  return snap.docs.map(d => ({ ...(d.data() as Workout), id: d.id }));
}

export async function createWorkout(
  uid: string,
  data: Omit<Workout, 'id' | 'createdAt'>
): Promise<Workout> {
  const ref = col(uid).doc();
  const workout: Workout = { ...data, id: ref.id, createdAt: new Date().toISOString() };
  await ref.set(workout);
  return workout;
}

export async function deleteWorkout(uid: string, id: string): Promise<void> {
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Workout not found');
  await ref.delete();
}
