import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Calibration = sequelize.define('Calibration', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  assetId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calibrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  nextCalibrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  vendor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Lulus', 'Gagal', 'Menunggu'),
    defaultValue: 'Menunggu',
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Calibration;
