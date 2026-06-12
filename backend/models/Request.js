import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  assetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  requesterName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Disetujui', 'Ditolak'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Request;
