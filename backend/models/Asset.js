import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  condition: {
    type: DataTypes.ENUM('Baik', 'Rusak', 'Perbaikan'),
    defaultValue: 'Baik',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Tersedia', 'Dipinjam'),
    defaultValue: 'Tersedia',
    allowNull: false,
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  warrantyEnd: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manualBook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  invoice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Asset;
