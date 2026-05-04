import { Watchlist, Movie, Genre } from '../models/index.js';

// Get user's watchlist
export const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const watchlistItems = await Watchlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Movie,
          include: [Genre],
          required: false // Left join to include local movies too
        }
      ],
      order: [['date_added', 'DESC']]
    });

    // Format the response to include both database and local movies
    const formattedItems = watchlistItems.map(item => {
      if (item.Movie) {
        // Database movie
        return {
          id: `db-${item.Movie.movie_id}`,
          watchlist_id: item.watchlist_id,
          title: item.Movie.title,
          description: item.Movie.description,
          genre: item.Movie.Genre ? item.Movie.Genre.genre_name : null,
          release_year: item.Movie.release_year,
          rating: item.Movie.rating,
          source: 'database',
          date_added: item.date_added
        };
      } else if (item.local_movie_data) {
        // Local movie
        return {
          id: `local-${item.watchlist_id}`,
          watchlist_id: item.watchlist_id,
          ...item.local_movie_data,
          source: 'local',
          date_added: item.date_added
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist'
    });
  }
};

// Add movie to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { movie } = req.body;

    if (!movie) {
      return res.status(400).json({
        success: false,
        message: 'Movie data is required'
      });
    }

    // Check if it's a database movie or local movie
    let watchlistData = {
      user_id: userId,
      date_added: new Date()
    };

    if (movie.source === 'database' && movie.movie_id) {
      // Database movie
      watchlistData.movie_id = movie.movie_id;
      
      // Check if already in watchlist
      const existingItem = await Watchlist.findOne({
        where: {
          user_id: userId,
          movie_id: movie.movie_id
        }
      });

      if (existingItem) {
        return res.status(400).json({
          success: false,
          message: 'Movie already in watchlist'
        });
      }
    } else {
      // Local movie - store in local_movie_data field
      watchlistData.local_movie_data = movie;
      
      // Check if this local movie is already in watchlist by title
      const existingLocalItem = await Watchlist.findOne({
        where: {
          user_id: userId,
          movie_id: null
        }
      });

      if (existingLocalItem && existingLocalItem.local_movie_data) {
        // Check if title matches
        if (existingLocalItem.local_movie_data.title === movie.title) {
          return res.status(400).json({
            success: false,
            message: 'Movie already in watchlist'
          });
        }
      }
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.create(watchlistData);

    res.json({
      success: true,
      message: 'Movie added to watchlist successfully',
      data: {
        watchlist_id: watchlistItem.watchlist_id,
        movie: movie,
        date_added: watchlistItem.date_added
      }
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add movie to watchlist'
    });
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { watchlistId, movieId } = req.params;

    let whereClause = { user_id: userId };

    if (watchlistId) {
      whereClause.watchlist_id = watchlistId;
    } else if (movieId) {
      whereClause.movie_id = movieId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either watchlistId or movieId is required'
      });
    }

    const deletedRows = await Watchlist.destroy({
      where: whereClause
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Movie removed from watchlist successfully'
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove movie from watchlist'
    });
  }
};

// Check if movie is in watchlist
export const checkInWatchlist = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { movieId } = req.params;
    const { title } = req.query; // For local movies

    let whereClause = { user_id: userId };

    if (movieId && movieId !== 'null') {
      // Database movie
      whereClause.movie_id = movieId;
    } else if (title) {
      // Local movie - need to search in local_movie_data
      const watchlistItems = await Watchlist.findAll({
        where: {
          user_id: userId,
          movie_id: null
        }
      });

      const isInWatchlist = watchlistItems.some(item => 
        item.local_movie_data && item.local_movie_data.title === title
      );

      return res.json({
        success: true,
        inWatchlist: isInWatchlist
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either movieId or title is required'
      });
    }

    const existingItem = await Watchlist.findOne({
      where: whereClause
    });

    res.json({
      success: true,
      inWatchlist: !!existingItem
    });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check watchlist'
    });
  }
};

// Clear entire watchlist
export const clearWatchlist = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await Watchlist.destroy({
      where: { user_id: userId }
    });

    res.json({
      success: true,
      message: 'Watchlist cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear watchlist'
    });
  }
};
