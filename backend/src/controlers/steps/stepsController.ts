import { Request, Response, NextFunction } from 'express';
import * as stepsService from '../../services/steps.service';

export const getSteps = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }
  try {
    res.json(await stepsService.getSteps(req.uid, date));
  } catch (err) {
    next(err);
  }
};

export const upsertSteps = async (req: Request, res: Response, next: NextFunction) => {
  const date = req.params.date as string;
  const { count } = req.body;
  if (count === undefined || count === null) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'count is required' } });
    return;
  }
  if (count < 0) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'count cannot be negative' } });
    return;
  }
  try {
    res.json(await stepsService.upsertSteps(req.uid, date, count));
  } catch (err) {
    next(err);
  }
};
