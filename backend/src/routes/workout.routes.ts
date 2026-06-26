import { Router } from 'express';
import { getWorkouts, createWorkout, deleteWorkout } from '../controlers/workout/workoutController';

const router = Router();

router.get('/', getWorkouts);
router.post('/', createWorkout);
router.delete('/:id', deleteWorkout);

export default router;
