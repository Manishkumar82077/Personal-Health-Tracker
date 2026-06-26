import { Request, Response, NextFunction } from 'express';
import * as foodService from '../../services/food.service';

export const getFood = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }
  try {
    const entries = await foodService.getFoodByDate(req.uid, date);
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

export const createFood = async (req: Request, res: Response, next: NextFunction) => {
  const { name, date, quantity, calories, protein, carbs, fat, fiber, micros, mealId } = req.body;

  if (!name || !date) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'name and date are required' } });
    return;
  }
  if ([calories, protein, carbs, fat, fiber].some(v => typeof v === 'number' && v < 0)) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Macro values cannot be negative' } });
    return;
  }

  try {
    const entry = await foodService.createFood(req.uid, {
      name, date, quantity: quantity ?? 0,
      calories: calories ?? 0, protein: protein ?? 0,
      carbs: carbs ?? 0, fat: fat ?? 0, fiber: fiber ?? 0,
      ...(micros && { micros }),
      ...(mealId && { mealId }),
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

export const deleteFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await foodService.deleteFood(req.uid, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
