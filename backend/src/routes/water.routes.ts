import { Router } from 'express';
import { getWater, createWater, deleteWater } from '../controlers/water/waterController';

const router = Router();

router.get('/', getWater);
router.post('/', createWater);
router.delete('/:id', deleteWater);

export default router;
