import rateLimit from 'express-rate-limit';

/**
 * Rate limiter untuk endpoint login.
 * Membatasi percobaan login maksimal 10 kali dalam 15 menit per IP.
 * Melindungi dari serangan brute-force (menebak-nebak password).
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,                   // Maksimum 10 request per window per IP
  standardHeaders: true,     // Kirim header RateLimit-* di response
  legacyHeaders: false,
  message: {
    message: 'Terlalu banyak percobaan login dari IP ini. Coba lagi setelah 15 menit.',
  },
  // Hanya hitung request yang gagal (status 4xx) sebagai percobaan login
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter umum untuk semua API (perlindungan global).
 * Membatasi 200 request per 10 menit per IP.
 * Melindungi dari DDoS sederhana dan scraping.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Terlalu banyak request dari IP ini. Coba lagi setelah beberapa menit.',
  },
});
