import { Request, Response, NextFunction } from 'express';
import { getProfile, DEFAULT_GOALS } from '../../services/profile.service';
import { getFoodByDate } from '../../services/food.service';
import { getWaterByDate } from '../../services/water.service';
import { getSteps } from '../../services/steps.service';
import { getSleep } from '../../services/sleep.service';
import { getWorkoutsByDate } from '../../services/workout.service';

const safeDiv = (a: number, b: number) => (b === 0 ? 0 : Math.min(1, a / b));

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }

  try {
    const [profile, food, water, steps, sleep, workouts] = await Promise.all([
      getProfile(req.uid),
      getFoodByDate(req.uid, date),
      getWaterByDate(req.uid, date),
      getSteps(req.uid, date),
      getSleep(req.uid, date),
      getWorkoutsByDate(req.uid, date),
    ]);

    const goals = profile?.goals ?? DEFAULT_GOALS;

    const totals = {
      calories: food.reduce((s, e) => s + e.calories, 0),
      protein: food.reduce((s, e) => s + e.protein, 0),
      carbs: food.reduce((s, e) => s + e.carbs, 0),
      fat: food.reduce((s, e) => s + e.fat, 0),
      fiber: food.reduce((s, e) => s + e.fiber, 0),
      waterMl: water.totalMl,
      steps: steps.count,
      sleepHours: sleep ? sleep.durationMinutes / 60 : 0,
    };

    const remaining = {
      calories: Math.max(0, goals.calorieGoal - totals.calories),
      protein: Math.max(0, goals.proteinGoal - totals.protein),
      carbs: Math.max(0, goals.carbsGoal - totals.carbs),
      fat: Math.max(0, goals.fatGoal - totals.fat),
      fiber: Math.max(0, goals.fiberGoal - totals.fiber),
      waterMl: Math.max(0, goals.waterGoalMl - totals.waterMl),
      steps: Math.max(0, goals.stepGoal - totals.steps),
    };

    const progress = {
      calories: safeDiv(totals.calories, goals.calorieGoal),
      protein: safeDiv(totals.protein, goals.proteinGoal),
      carbs: safeDiv(totals.carbs, goals.carbsGoal),
      fat: safeDiv(totals.fat, goals.fatGoal),
      fiber: safeDiv(totals.fiber, goals.fiberGoal),
      water: safeDiv(totals.waterMl, goals.waterGoalMl),
      steps: safeDiv(totals.steps, goals.stepGoal),
      sleep: safeDiv(totals.sleepHours, goals.sleepGoalHours),
    };

    res.json({ date, goals, totals, remaining, progress, workouts });
  } catch (err) {
    next(err);
  }
};
