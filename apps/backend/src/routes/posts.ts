import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { createPost } from '../controllers/posts/createPost';
import { getPost } from '../controllers/posts/getPost';
import { getPosts } from '../controllers/posts/getPosts';
import { updatePost } from '../controllers/posts/updatePost';
import { deletePost } from '../controllers/posts/deletePost';
import { validate, createPostSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.post(
  '/photo',
  verifyToken,
  upload.single('img'),
  validate(createPostSchema),
  createPost
);

router.get('/photo', getPosts);
router.get('/photo/:id', getPost);
router.put('/photo/:id', verifyToken, updatePost);
router.delete('/photo/:id', verifyToken, deletePost);

export default router;