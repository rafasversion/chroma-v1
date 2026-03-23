import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { toggleLike } from '../controllers/likes/toggleLike';
import { getUserLikes } from '../controllers/likes/getUserLikes';

const router = Router();

router.post('/like/:id', verifyToken, toggleLike);
router.get('/user-likes', verifyToken, getUserLikes);

export default router;