import { Router } from 'express';
import { addPaymentMethod, getPaymentMethods } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/methods', authenticateToken, addPaymentMethod);
router.get('/methods', authenticateToken, getPaymentMethods);

export default router;
