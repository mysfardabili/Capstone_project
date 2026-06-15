/**
 * validateEnv.js
 * Validasi environment variables sebelum server dimulai.
 * Server akan LANGSUNG BERHENTI jika ada env var penting yang kosong.
 * Ini mencegah bug samar yang muncul di production akibat konfigurasi yang tidak lengkap.
 */

const REQUIRED_VARS = [
  { key: 'DATABASE_URL',            hint: 'Connection string PostgreSQL dari Supabase' },
  { key: 'JWT_SECRET',              hint: 'Secret key untuk menandatangani JWT. Harus panjang dan acak.' },
  { key: 'CLOUDINARY_CLOUD_NAME',   hint: 'Cloud name dari dashboard Cloudinary' },
  { key: 'CLOUDINARY_API_KEY',      hint: 'API Key dari dashboard Cloudinary' },
  { key: 'CLOUDINARY_API_SECRET',   hint: 'API Secret dari dashboard Cloudinary' },
];

// Peringatan untuk production — variabel ini tidak wajib tapi sangat disarankan
const RECOMMENDED_PROD_VARS = [
  { key: 'ALLOWED_ORIGINS', hint: 'Domain frontend yang diizinkan CORS, contoh: https://asetra.com' },
];

export const validateEnv = () => {
  const missing = [];

  for (const { key, hint } of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push({ key, hint });
    }
  }

  if (missing.length > 0) {
    console.error('\n========================================================');
    console.error('  ERROR: Environment variables yang diperlukan tidak ada!');
    console.error('========================================================');
    missing.forEach(({ key, hint }) => {
      console.error(`  ✗ ${key}`);
      console.error(`    → ${hint}`);
    });
    console.error('\nTambahkan variabel di atas ke file backend/.env\n');
    process.exit(1);
  }

  // Peringatan JWT_SECRET yang lemah (terlalu pendek)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('[WARN] JWT_SECRET terlalu pendek (< 32 karakter). Gunakan secret yang lebih panjang di production.');
  }

  // Peringatan untuk production
  if (process.env.NODE_ENV === 'production') {
    for (const { key, hint } of RECOMMENDED_PROD_VARS) {
      if (!process.env[key]) {
        console.warn(`[WARN] ${key} tidak diset untuk production. → ${hint}`);
      }
    }
  }

  console.log('✓ Semua environment variables tervalidasi.');
};
