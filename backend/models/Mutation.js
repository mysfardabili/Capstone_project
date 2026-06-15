import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Mutation = sequelize.define('Mutation', {
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
  sourceLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requesterName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Mutation;
