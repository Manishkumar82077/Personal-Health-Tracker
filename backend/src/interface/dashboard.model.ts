import { Goals } from './profile.model';
import { Workout } from './workout.model';

export interface DashboardTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
  steps: number;
  sleepHours: number;
}

export interface Dashboard {
  date: string;
  goals: Goals;
  totals: DashboardTotals;
  remaining: Omit<DashboardTotals, 'sleepHours'>;
  progress: Record<string, number>;
  workouts: Workout[];
}

export interface ApiError {
  error: { code: string; message: string };
}
