import { Router } from 'express';
import { getMeals, createMeal, updateMeal, deleteMeal, logMeal } from '../controlers/meals/mealsController';

const router = Router();

router.get('/', getMeals);
router.post('/', createMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);
router.post('/:id/log', logMeal);

export default router;
