import express from 'express';
import { searchMovies, getAllMovies, getMoviesByCategory } from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/category/:category', getMoviesByCategory);

export default router;
