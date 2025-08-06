import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Genre = sequelize.define('Genre', {
  genre_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  genre_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'genres',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Genre;
