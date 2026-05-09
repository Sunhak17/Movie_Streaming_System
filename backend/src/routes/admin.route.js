import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import {
  getAllUsers,
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getUserStats,
  deleteUser,
  toggleUserStatus,
  updateUser,
  getGenres,
  uploadPoster
} from '../controllers/admin.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// All routes below require admin auth
router.use(authenticateToken, authorizeAdmin);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id', updateUser);

// Movie management routes
router.get('/movies', getAllMovies);
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);
router.post('/upload-poster', (req, res, next) => {
  upload.single('poster')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, uploadPoster);

// Genre management routes
router.get('/genres', getGenres);

export default router;
