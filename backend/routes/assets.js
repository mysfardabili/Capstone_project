import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../controllers/assetController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateAsset } from '../middleware/validator.js';

const router = express.Router();

// ============================================
// Multer: gunakan memoryStorage agar file tidak
// disimpan ke disk lokal — langsung dikirim ke Cloudinary
// ============================================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Batas 10MB per file
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya mendukung file gambar (JPEG/JPG/PNG/WEBP) dan dokumen PDF'));
    }
  },
});

// Protect all routes
router.use(protect);

router.route('/')
  .get(authorize('admin', 'technician'), getAssets)
  .post(authorize('admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), validateAsset, createAsset);

router.route('/:id')
  .get(authorize('admin', 'technician'), getAssetById)
  .put(authorize('admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), validateAsset, updateAsset)
  .delete(authorize('admin'), deleteAsset);

export default router;
