import express from 'express';
import multer from 'multer';
import {
  getCalibrations,
  createCalibration,
  updateCalibration,
  getUpcomingCalibrations,
} from '../controllers/calibrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Multer: pakai memoryStorage agar sertifikat kalibrasi langsung ke Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya mendukung file gambar dan dokumen PDF'));
    }
  },
});

router.use(protect);

router.route('/')
  .get(authorize('admin', 'technician'), getCalibrations)
  .post(authorize('admin'), upload.single('certificate'), createCalibration);

router.get('/upcoming', authorize('admin'), getUpcomingCalibrations);

router.route('/:id')
  .put(authorize('admin'), upload.single('certificate'), updateCalibration);

export default router;
