import { Request, Response, NextFunction } from 'express';
import * as foodItemsService from '../../services/foodItems.service';

export const getLibrary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await foodItemsService.getLibrary(req.uid));
  } catch (err) {
    next(err);
  }
};

export const getFoodItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    res.json(await foodItemsService.getFoodItems(req.uid, q));
  } catch (err) {
    next(err);
  }
};

export const createFoodItem = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body ?? {};
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'name is required' } });
    return;
  }
  try {
    const body = {
      name: name.trim(),
      caloriesPer100: Number(req.body.caloriesPer100) || 0,
      proteinPer100: Number(req.body.proteinPer100) || 0,
      carbsPer100: Number(req.body.carbsPer100) || 0,
      fatPer100: Number(req.body.fatPer100) || 0,
      fiberPer100: Number(req.body.fiberPer100) || 0,
      defaultQuantity: Number(req.body.defaultQuantity) || 100,
    };
    res.status(201).json(await foodItemsService.createFoodItem(req.uid, body));
  } catch (err) {
    next(err);
  }
};

export const updateFoodItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await foodItemsService.updateFoodItem(req.uid, req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
};

export const deleteFoodItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await foodItemsService.deleteFoodItem(req.uid, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const logFoodItem = async (req: Request, res: Response, next: NextFunction) => {
  const { date, quantity } = req.body ?? {};
  if (!date) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date is required' } });
    return;
  }
  try {
    const entry = await foodItemsService.logFoodItem(
      req.uid,
      req.params.id as string,
      date,
      quantity !== undefined ? Number(quantity) : undefined,
    );
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};
