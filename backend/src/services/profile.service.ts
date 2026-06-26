import { db } from '../config/firebase';
import { Profile, Goals } from '../interface/profile.model';
import { AppError } from '../utils/AppError';

export const DEFAULT_GOALS: Goals = {
  calorieGoal: 2000,
  proteinGoal: 120,
  carbsGoal: 250,
  fatGoal: 65,
  fiberGoal: 30,
  waterGoalMl: 3000,
  stepGoal: 10000,
  sleepGoalHours: 8,
};

const GOAL_FIELDS = new Set<string>([
  'calorieGoal', 'proteinGoal', 'carbsGoal', 'fatGoal',
  'fiberGoal', 'waterGoalMl', 'stepGoal', 'sleepGoalHours',
]);

export async function getOrCreateProfile(uid: string, email: string): Promise<Profile> {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();

  if (snap.exists) {
    return { ...(snap.data() as Profile), uid };
  }

  const now = new Date().toISOString();
  const profile: Profile = { uid, email, goals: DEFAULT_GOALS, createdAt: now, updatedAt: now };
  await ref.set(profile);
  return profile;
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) return null;
  return { ...(snap.data() as Profile), uid };
}

export async function updateProfile(
  uid: string,
  updates: Partial<Goals> & { weightKg?: number; displayName?: string }
): Promise<Profile> {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) throw new AppError(404, 'NOT_FOUND', 'Profile not found');

  const current = snap.data() as Profile;
  const now = new Date().toISOString();

  const goalUpdates: Partial<Goals> = {};
  const topLevel: { weightKg?: number; displayName?: string } = {};

  for (const [key, value] of Object.entries(updates)) {
    if (GOAL_FIELDS.has(key)) {
      (goalUpdates as Record<string, number>)[key] = value as number;
    } else if (key === 'weightKg' || key === 'displayName') {
      (topLevel as Record<string, unknown>)[key] = value;
    }
  }

  const updatedGoals = { ...current.goals, ...goalUpdates };
  await ref.update({ ...topLevel, goals: updatedGoals, updatedAt: now });
  return { ...current, ...topLevel, goals: updatedGoals, updatedAt: now, uid };
}
