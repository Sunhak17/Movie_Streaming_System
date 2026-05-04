import express from 'express';
import { 
  getUserWatchlist, 
  addToWatchlist, 
  removeFromWatchlist, 
  checkInWatchlist, 
  clearWatchlist 
} from '../controllers/watchlist.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All watchlist routes require authentication
router.use(authenticateToken);

// Get user's watchlist
router.get('/', getUserWatchlist);

// Add movie to watchlist
router.post('/add', addToWatchlist);

// Remove movie from watchlist
router.delete('/:watchlistId', removeFromWatchlist);

// Check if movie is in watchlist
router.get('/check', checkInWatchlist);

// Clear entire watchlist
router.delete('/', clearWatchlist);

export default router;
