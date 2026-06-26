import { Router } from 'express';
import { getFood, createFood, deleteFood } from '../controlers/food/foodController';

const router = Router();

router.get('/', getFood);
router.post('/', createFood);
router.delete('/:id', deleteFood);

export default router;
