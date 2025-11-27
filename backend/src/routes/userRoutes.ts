import { Router } from 'express';
import { getUserTrips, rateUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/me/trips', authenticateToken, getUserTrips);
router.post('/rate', authenticateToken, rateUser);

export default router;
