import { Request, Response, NextFunction } from 'express';
import * as waterService from '../../services/water.service';

export const getWater = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }
  try {
    res.json(await waterService.getWaterByDate(req.uid, date));
  } catch (err) {
    next(err);
  }
};

export const createWater = async (req: Request, res: Response, next: NextFunction) => {
  const { amountMl, date } = req.body;
  if (!amountMl || !date) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'amountMl and date are required' } });
    return;
  }
  if (amountMl < 0) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'amountMl cannot be negative' } });
    return;
  }
  try {
    res.status(201).json(await waterService.createWater(req.uid, { amountMl, date }));
  } catch (err) {
    next(err);
  }
};

export const deleteWater = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await waterService.deleteWater(req.uid, req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
