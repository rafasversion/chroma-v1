import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { registerUser } from '../controllers/users/register';
import { getProfile } from '../controllers/users/getProfile';
import { getUserByUsername } from '../controllers/users/getUserByUsername';
import { updateProfile } from '../controllers/users/updateProfile';
import { getPosts } from '../controllers/users/getPosts';
import { deleteProfile } from '../controllers/users/deleteProfile';
import { validate, registerSchema, updateProfileSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.post('/user/register', validate(registerSchema), registerUser);
router.get('/user', verifyToken, getProfile);
router.get('/user/by-username/:username', getUserByUsername);
router.get('/user/:username/posts', getPosts);

router.post(
  '/user',
  verifyToken,
  upload.single('user_picture'),
  updateProfile
);

router.delete('/user', verifyToken, deleteProfile);

export default router;