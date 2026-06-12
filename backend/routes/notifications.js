import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/:id/read')
  .put(markAsRead);

export default router;
