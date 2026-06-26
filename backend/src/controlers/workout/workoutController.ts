import { Request, Response, NextFunction } from 'express';
import * as workoutService from '../../services/workout.service';

export const getWorkouts = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }
  try {
    res.json(await workoutService.getWorkoutsByDate(req.uid, date));
  } catch (err) {
    next(err);
  }
};

export const createWorkout = async (req: Request, res: Response, next: NextFunction) => {
  const { exercise, weightKg, reps, sets, date } = req.body;
  if (!exercise || !date) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'exercise and date are required' } });
    return;
  }
  try {
    res.status(201).json(
      await workoutService.createWorkout(req.uid, {
        exercise,
        weightKg: weightKg ?? 0,
        reps: reps ?? 0,
        sets: sets ?? 0,
        date,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await workoutService.deleteWorkout(req.uid, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
