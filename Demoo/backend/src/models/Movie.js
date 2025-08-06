import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  release_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Store the relative path or filename of the image (e.g., 'images/kdrama/myimage.jpg')
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    // Example usage: Place the image in 'movie-website/public/images/kdrama/' and store 'images/kdrama/myimage.jpg' in this field
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  episodes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('cdrama', 'kdrama', 'hollywood'),
    allowNull: false,
    defaultValue: 'cdrama'
  }
}, {
  tableName: 'movies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Movie;
