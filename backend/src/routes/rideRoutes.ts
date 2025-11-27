import { Router } from 'express';
import { createRide, getRides, getRideById } from '../controllers/rideController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createRide);
router.get('/', getRides);
router.get('/:id', getRideById);

export default router;
