import { Request, Response, NextFunction } from 'express';
import * as mealsService from '../../services/meals.service';

export const getMeals = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await mealsService.getMeals());
  } catch (err) {
    next(err);
  }
};

export const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  const { name, items } = req.body;
  if (!name || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'name and items[] are required' } });
    return;
  }
  try {
    res.status(201).json(await mealsService.createMeal({ name, items }));
  } catch (err) {
    next(err);
  }
};

export const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await mealsService.updateMeal(req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
};

export const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await mealsService.deleteMeal(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const logMeal = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.body;
  if (!date) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date is required' } });
    return;
  }
  try {
    const entries = await mealsService.logMeal(req.uid, req.params.id as string, date);
    res.status(201).json({ entries });
  } catch (err) {
    next(err);
  }
};
