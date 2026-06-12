import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Database and models
import { sequelize, seedDatabase } from './models/index.js';

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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists dynamically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/calibrations', calibrationRoutes);
app.use('/api/mutations', mutationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Simple healthcheck / fallback route
app.get('/', (req, res) => {
  res.json({ message: 'ASETRA API Service is running!' });
});

// Database Sync and Server Launch
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync models to DB (checks if tables exist, creates them if not)
    await sequelize.sync({ alter: true }); // Set to true to alter tables if schema changes
    console.log('Database connected & synchronized.');
    
    // Run seeder
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
