import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { getComments } from '../controllers/comments/getComments';
import { createComment } from '../controllers/comments/createComment';
import { deleteComment } from '../controllers/comments/deleteComment';
import { toggleCommentLike } from '../controllers/comments/toggleCommentLike';
import { validate, createCommentSchema } from '../middleware/validation';

const router = Router();

router.get('/comment/:id', getComments);
router.post('/comment/:id', verifyToken, validate(createCommentSchema), createComment);
router.delete('/comment/:id', verifyToken, deleteComment);
router.post('/comment-like/:id', verifyToken, toggleCommentLike);

export default router;