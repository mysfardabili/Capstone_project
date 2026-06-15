import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// validateEnv sudah dipanggil di server.js sebelum ini
// Database and models
import { sequelize, seedDatabase } from './models/index.js';

// Rate limiter
import { globalRateLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.js';
import assetRoutes from './routes/assets.js';
import requestRoutes from './routes/requests.js';
import repairRoutes from './routes/repairs.js';
import calibrationRoutes from './routes/calibrations.js';
import mutationRoutes from './routes/mutations.js';
import dashboardRoutes from './routes/dashboard.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// CORS — Batasi akses hanya dari domain yang diizinkan
// ============================================
const rawOrigins = process.env.ALLOWED_ORIGINS;
const allowedOrigins = rawOrigins
  ? rawOrigins.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    callback(new Error('Akses ditolak oleh kebijakan CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter global — lindungi semua API dari abuse
app.use('/api', globalRateLimiter);

// Uploads directory (lokal, hanya untuk fallback dev)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/calibrations', calibrationRoutes);
app.use('/api/mutations', mutationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ASETRA API Service is running!', env: process.env.NODE_ENV || 'development' });
});

// ============================================
// Database Sync & Server Launch
// alter: true = sesuaikan skema tanpa hapus data
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Menghubungkan ke database PostgreSQL (Supabase)...');
    await sequelize.authenticate();
    console.log('Koneksi database berhasil.');

    await sequelize.sync({ alter: true });
    console.log('Skema database tersinkronisasi.');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`CORS diizinkan untuk: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('Gagal menghubungkan ke database:', error.message);
    process.exit(1);
  }
};

startServer();
