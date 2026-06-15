import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbType = process.env.DB_TYPE || 'sqlite';

let sequelize;

if (dbType === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../database.sqlite'),
    logging: false, // Set to console.log to see SQL queries
    // Enable foreign key support in SQLite
    dialectOptions: {
      supportBigNumbers: true,
    },
  });
  
  // Enable foreign key constraints for SQLite
  sequelize.afterConnect((connection, config) => {
    return connection.query('PRAGMA foreign_keys = ON');
  });
} else {
  // Configured for MySQL or PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: dbType,
      port: process.env.DB_PORT,
      logging: false,
    }
  );
}

export default sequelize;
