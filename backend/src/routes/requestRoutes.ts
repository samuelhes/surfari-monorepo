import { Router } from 'express';
import { createRequest, getRequestsForRide, acceptRequest, rejectRequest } from '../controllers/requestController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });

router.post('/', authenticateToken, createRequest);
router.get('/', authenticateToken, getRequestsForRide);
router.post('/:requestId/accept', authenticateToken, acceptRequest);
router.post('/:requestId/reject', authenticateToken, rejectRequest);

export default router;
