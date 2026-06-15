import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di file .env');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Diperlukan untuk koneksi ke Supabase pooler
    },
  },
  pool: {
    max: 10,       // Maksimum koneksi bersamaan
    min: 0,
    acquire: 30000, // Timeout sebelum throw error (30 detik)
    idle: 10000,    // Tutup koneksi yang idle setelah 10 detik
  },
});

export default sequelize;

