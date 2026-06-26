import { Router } from 'express';
import { getDashboard } from '../controlers/dashboard/dashboardController';

const router = Router();

router.get('/', getDashboard);

export default router;
