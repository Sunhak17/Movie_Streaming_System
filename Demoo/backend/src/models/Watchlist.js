import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Watchlist = sequelize.define('Watchlist', {
  watchlist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profile_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profiles',
      key: 'profile_id',
    },
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'videos',
      key: 'video_id',
    },
  },
  date_added: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'watchlists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Watchlist;
