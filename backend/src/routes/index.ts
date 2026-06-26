import { Router } from 'express';
import profileRouter from './profile.routes';
import foodRouter from './food.routes';
import mealsRouter from './meals.routes';
import waterRouter from './water.routes';
import workoutRouter from './workout.routes';
import stepsRouter from './steps.routes';
import sleepRouter from './sleep.routes';
import dashboardRouter from './dashboard.routes';

const router = Router();

router.use('/profile', profileRouter);
router.use('/food', foodRouter);
router.use('/meals', mealsRouter);
router.use('/water', waterRouter);
router.use('/workouts', workoutRouter);
router.use('/steps', stepsRouter);
router.use('/sleep', sleepRouter);
router.use('/dashboard', dashboardRouter);

export default router;
