import express from 'express';
import { getMutations, createMutation, updateMutationStatus } from '../controllers/mutationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin', 'technician'), getMutations)
  .post(authorize('admin'), createMutation);

router.route('/:id')
  .put(authorize('admin'), updateMutationStatus);

export default router;
