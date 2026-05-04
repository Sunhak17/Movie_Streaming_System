import { Op } from 'sequelize';
import { User, Movie, Genre } from '../models/index.js';

// Get all users with simple filtering
export const getAllUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    console.log('getAllUsers called with search:', search);
    
    const whereClause = search ? {
      [Op.or]: [
        { user_name: { [Op.like]: `%${search}%` } },
        { user_email: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    console.log('Search where clause:', whereClause);

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']]
    });

    console.log('Users found:', users.length);

    res.json({ 
      success: true, 
      data: users
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const inactiveUsers = await User.count({ where: { is_active: false } });
    const adminUsers = await User.count({ where: { role: 'admin' } });
    
    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Subscription stats
    const basicUsers = await User.count({ where: { subscription_plan: 'Basic' } });
    const standardUsers = await User.count({ where: { subscription_plan: 'Standard' } });
    const premiumUsers = await User.count({ where: { subscription_plan: 'Premium' } });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        newUsers,
        subscriptionStats: {
          basic: basicUsers,
          standard: standardUsers,
          premium: premiumUsers
        }
      }
    });
  } catch (error) {
    console.error('getUserStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Toggle user status (activate/deactivate)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating admin users
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify admin user status' });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.json({ 
      success: true, 
      message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const { search = '' } = req.query;
    console.log('getAllMovies called with search:', search);
    
    const whereClause = search ? {
      title: { [Op.like]: `%${search}%` }
    } : {};

    console.log('Movie search where clause:', whereClause);

    const movies = await Movie.findAll({
      where: whereClause,
      order: [['id', 'DESC']] // Use id instead of movie_id
    });

    console.log('Movies found:', movies.length);

    res.json({ 
      success: true, 
      data: movies
    });
  } catch (error) {
    console.error('getAllMovies error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add new movie
export const addMovie = async (req, res) => {
  try {
    const movieData = req.body;
    
    // Validate required fields based on actual Movie model
    if (!movieData.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Handle genre_id - set to null if not provided or invalid
    let genre_id = null;
    if (movieData.genre_id && movieData.genre_id !== '') {
      genre_id = parseInt(movieData.genre_id);
    }

    const newMovie = await Movie.create({
      title: movieData.title,
      description: movieData.description || '',
      genre_id: genre_id,
      release_year: movieData.release_year || new Date().getFullYear(),
      rating: movieData.rating || 0,
      image: movieData.poster_url || null // Use the image field for poster
    });

    res.status(201).json({ 
      success: true, 
      message: 'Movie added successfully',
      data: newMovie
    });
  } catch (error) {
    console.error('addMovie error:', error);
    
    // Handle foreign key constraint error specifically
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid genre ID. Please provide a valid genre or leave it empty.' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movieData = req.body;
    
    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Handle genre_id - set to null if not provided or invalid
    let genre_id = movie.genre_id; // Keep existing if not updating
    if (movieData.hasOwnProperty('genre_id')) {
      genre_id = movieData.genre_id && movieData.genre_id !== '' ? parseInt(movieData.genre_id) : null;
    }

    await movie.update({
      title: movieData.title || movie.title,
      description: movieData.description !== undefined ? movieData.description : movie.description,
      genre_id: genre_id,
      release_year: movieData.release_year || movie.release_year,
      rating: movieData.rating !== undefined ? movieData.rating : movie.rating,
      image: movieData.poster_url !== undefined ? movieData.poster_url : movie.image
    });

    res.json({ 
      success: true, 
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('updateMovie error:', error);
    
    // Handle foreign key constraint error specifically
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid genre ID. Please provide a valid genre or leave it empty.' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    await movie.destroy();
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('deleteMovie error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all genres
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({
      order: [['genre_name', 'ASC']]
    });
    res.json({ success: true, data: genres });
  } catch (error) {
    console.error('getGenres error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Upload poster (for now, just return a placeholder URL)
export const uploadPoster = async (req, res) => {
  try {
    console.log('uploadPoster called');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    
    if (!req.file) {
      console.log('No file found in request');
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // For now, we'll just return a placeholder URL
    // In a real implementation, you would:
    // 1. Save the file to a storage service (AWS S3, Cloudinary, etc.)
    // 2. Return the actual URL
    
    // Simulate successful upload with a more specific placeholder
    const posterUrl = `https://via.placeholder.com/300x450/6366f1/ffffff?text=${encodeURIComponent(req.file.originalname)}`;
    
    console.log('Returning poster URL:', posterUrl);
    
    res.json({ 
      success: true, 
      message: 'Poster uploaded successfully',
      posterUrl: posterUrl
    });
  } catch (error) {
    console.error('uploadPoster error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};
