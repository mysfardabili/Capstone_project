import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.js';
import {
  updateUserProfile,
  updateUserPassword,
  updateUserPreferences,
} from '../controllers/userController.js';

const router = express.Router();

// Multer: pakai memoryStorage agar foto profil langsung ke Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB untuk foto profil
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

router.put('/profile', upload.single('profilePicture'), updateUserProfile);
router.put('/password', updateUserPassword);
router.put('/preferences', updateUserPreferences);

export default router;
