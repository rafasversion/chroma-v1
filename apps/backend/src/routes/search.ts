import { Router } from 'express';
import { search } from '../controllers/search/search';

const router = Router();

router.get('/search', search);

export default router;