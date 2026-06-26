import { Request, Response, NextFunction } from 'express';
import * as sleepService from '../../services/sleep.service';
import { AppError } from '../../utils/AppError';

export const getSleep = async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'date query param is required (YYYY-MM-DD)' } });
    return;
  }
  try {
    const entry = await sleepService.getSleep(req.uid, date);
    if (!entry) throw new AppError(404, 'NOT_FOUND', 'No sleep entry for this date');
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

export const upsertSleep = async (req: Request, res: Response, next: NextFunction) => {
  const date = req.params.date as string;
  const { sleepTime, wakeTime } = req.body;
  if (!sleepTime || !wakeTime) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'sleepTime and wakeTime are required (HH:MM)' } });
    return;
  }
  try {
    res.json(await sleepService.upsertSleep(req.uid, date, { sleepTime, wakeTime }));
  } catch (err) {
    next(err);
  }
};
