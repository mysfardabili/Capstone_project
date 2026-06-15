import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Konfigurasi Cloudinary dari environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file buffer ke Cloudinary
 * @param {Buffer} fileBuffer - Buffer file dari multer memoryStorage
 * @param {string} folder - Folder tujuan di Cloudinary (misal: 'asetra/assets')
 * @param {Object} options - Opsi tambahan (resource_type, transformation, dll)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Otomatis deteksi image/pdf/video
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error.message);
          return reject(new Error(`Gagal mengunggah file: ${error.message}`));
        }
        resolve({
          url: result.secure_url,    // URL HTTPS aman untuk disimpan ke DB
          publicId: result.public_id, // ID untuk keperluan hapus file di masa depan
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Hapus file dari Cloudinary berdasarkan public_id
 * @param {string} publicId - Public ID dari Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] File dihapus: ${publicId}`);
  } catch (error) {
    console.error('[Cloudinary] Gagal menghapus file:', error.message);
  }
};

export default cloudinary;
