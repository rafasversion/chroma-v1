import { Router } from 'express';
import { registerUser } from '../controllers/users/register';
import { login } from '../controllers/auth/login';
import { googleLogin } from '../controllers/auth/googleLogin';
import { validate, registerSchema, loginSchema } from '../middleware/validation';
import { passwordLost } from '../controllers/auth/passwordLost';
import { passwordReset } from '../controllers/auth/passwordReset';

const router = Router();

router.post('/user/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), login);
router.post('/google-login', googleLogin);
router.post('/password/lost', passwordLost);
router.post('/password/reset', passwordReset);

export default router;