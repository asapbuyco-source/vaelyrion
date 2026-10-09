import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: 'auth' });
const passwordLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, keyPrefix: 'password' });

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getMe);
router.post('/forgot-password', passwordLimiter, AuthController.forgotPassword);
router.post('/reset-password', passwordLimiter, AuthController.resetPassword);

export default router;
