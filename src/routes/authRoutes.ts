import { Router } from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, getAllUsers);

export default router;
