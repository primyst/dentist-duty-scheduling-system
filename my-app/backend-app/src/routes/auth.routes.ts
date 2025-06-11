import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
// If you have authentication middleware, add it here for profile
// router.get('/profile', authMiddleware, authController.getProfile);

export default router;