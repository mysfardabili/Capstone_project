import express from 'express';
import {
  getRequests,
  createRequest,
  updateRequestStatus,
  approveRequest,
  rejectRequest,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'technician', 'nurse'), getRequests)
  .post(authorize('admin', 'nurse'), createRequest);

// Specific routes MUST come before the generic /:id route
router.put('/:id/approve', authorize('admin'), approveRequest);
router.put('/:id/reject', authorize('admin'), rejectRequest);

router.route('/:id')
  .put(authorize('admin'), updateRequestStatus);

export default router;
