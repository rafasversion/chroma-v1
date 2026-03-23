import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { getNotifications } from '../controllers/notifications/getNotifications';
import { markAsRead } from '../controllers/notifications/markAsRead';

const router = Router();

router.get('/notifications', verifyToken, getNotifications);
router.post('/notifications/read', verifyToken, markAsRead);

export default router;