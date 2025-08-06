import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Video = sequelize.define('Video', {
  video_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  video_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  video_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'genres',
      key: 'genre_id'
    }
  },
  video_release: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  video_view: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  maturity_rating: {
    type: DataTypes.ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cast_info: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  crew_info: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'videos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Video;
