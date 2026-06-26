import { Request, Response, NextFunction } from 'express';
import * as profileService from '../../services/profile.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getOrCreateProfile(req.uid, req.userEmail ?? '');
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const updates = req.body as Record<string, unknown>;

  const numericGoalFields = [
    'calorieGoal', 'proteinGoal', 'carbsGoal', 'fatGoal',
    'fiberGoal', 'waterGoalMl', 'stepGoal', 'sleepGoalHours', 'weightKg',
  ];

  for (const field of numericGoalFields) {
    if (field in updates && typeof updates[field] === 'number' && (updates[field] as number) < 0) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: `${field} cannot be negative` } });
      return;
    }
  }

  try {
    const profile = await profileService.updateProfile(req.uid, updates as Parameters<typeof profileService.updateProfile>[1]);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};
