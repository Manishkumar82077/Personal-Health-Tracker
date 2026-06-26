import { Router } from 'express';
import { getSleep, upsertSleep } from '../controlers/sleep/sleepController';

const router = Router();

router.get('/', getSleep);
router.put('/:date', upsertSleep);

export default router;
