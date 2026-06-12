import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getRepairs,
  createRepair,
  updateRepair,
  updateRepairStatus,
} from '../controllers/repairController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya mendukung file gambar (JPEG/JPG/PNG/WEBP)'));
    }
  },
});

router.use(protect);

router.route('/')
  .get(authorize('admin', 'technician'), getRepairs)
  .post(authorize('admin', 'technician', 'nurse'), upload.single('image'), createRepair);

router.route('/:id')
  .put(authorize('admin', 'technician'), upload.single('image'), updateRepair);

router.put('/:id/status', authorize('admin', 'technician'), upload.single('image'), updateRepairStatus);

export default router;
