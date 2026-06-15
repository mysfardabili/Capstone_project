import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// loginRateLimiter melindungi dari brute-force: maks 10 percobaan gagal per 15 menit per IP
router.post('/login', loginRateLimiter, login);
router.get('/me', protect, getMe);

export default router;
