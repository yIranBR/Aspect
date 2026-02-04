import { Router } from 'express';
import { register, login, getProfile, getAllUsers, updateProfile } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, getAllUsers);

export default router;
