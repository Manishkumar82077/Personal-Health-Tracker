import { Router } from 'express';
import { getSteps, upsertSteps } from '../controlers/steps/stepsController';

const router = Router();

router.get('/', getSteps);
router.put('/:date', upsertSteps);

export default router;
