import { Op } from 'sequelize';
import { Movie, Genre } from '../models/index.js';

export const searchMovies = async (req, res) => {
  const { q } = req.query;
  try {
    const movies = await Movie.findAll({
      where: {
        title: { [Op.like]: `%${q}%` }
      },
      include: [{ model: Genre }]
    });
    res.json({ success: true, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ include: [{ model: Genre }] });
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error('getAllMovies error:', error); // Log full error for debugging
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMoviesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const movies = await Movie.findAll({
      where: { category },
      include: [{ model: Genre }],
      order: [['id', 'ASC']]
    });
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error('getMoviesByCategory error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
