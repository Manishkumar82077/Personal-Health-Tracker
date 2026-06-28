import { Router } from 'express';
import {
  getLibrary, getFoodItems, createFoodItem,
  updateFoodItem, deleteFoodItem, logFoodItem,
} from '../controlers/foodItems/foodItemsController';

const router = Router();

router.get('/library', getLibrary);
router.get('/', getFoodItems);
router.post('/', createFoodItem);
router.put('/:id', updateFoodItem);
router.delete('/:id', deleteFoodItem);
router.post('/:id/log', logFoodItem);

export default router;
