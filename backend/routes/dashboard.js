import express from 'express';
import { getDashboardSummary, getDashboardActivities } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/activities', protect, authorize('admin'), getDashboardActivities);

export default router;
