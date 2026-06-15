import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Repair = sequelize.define('Repair', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  assetId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Assets',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  reporterName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Admin',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Proses', 'Selesai'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('rendah', 'sedang', 'tinggi'),
    defaultValue: 'sedang',
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  technicianName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  completionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

export default Repair;
