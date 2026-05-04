import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../apiService';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load watchlist from backend on component mount
  useEffect(() => {
    loadWatchlistFromBackend();
  }, []);

  const loadWatchlistFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      const token = apiService.getToken();
      if (!token) {
        // If no token, try to load from localStorage as fallback
        const savedWatchlist = localStorage.getItem('watchlist');
        if (savedWatchlist) {
          setWatchlistItems(JSON.parse(savedWatchlist));
        }
        return;
      }

      // Fetch from backend
      const response = await apiService.getWatchlist();
      if (response && response.success) {
        setWatchlistItems(response.data || []);
      } else {
        throw new Error(response?.message || 'Failed to load watchlist');
      }
    } catch (error) {
      console.error('Error loading watchlist from backend:', error);
      setError(error.message);
      
      // Fallback to localStorage
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        try {
          setWatchlistItems(JSON.parse(savedWatchlist));
        } catch (parseError) {
          console.error('Error parsing localStorage watchlist:', parseError);
          setWatchlistItems([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Save to localStorage as backup
  useEffect(() => {
    if (watchlistItems.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlistItems));
    }
  }, [watchlistItems]);

  const addToWatchlist = async (movie) => {
    try {
      setError(null);
      
      // Check if user is logged in
      const token = apiService.getToken();
      if (!token) {
        // Fallback to local storage
        return addToLocalWatchlist(movie);
      }

      // Add to backend
      const response = await apiService.addToWatchlist(movie);
      if (response && response.success) {
        // Reload watchlist from backend to get updated data
        await loadWatchlistFromBackend();
        return { success: true, message: 'Added to watchlist successfully' };
      } else {
        throw new Error(response?.message || 'Failed to add to watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setError(error.message);
      
      // Fallback to local storage
      return addToLocalWatchlist(movie);
    }
  };

  const addToLocalWatchlist = (movie) => {
    const movieWithTimestamp = {
      ...movie,
      addedDate: new Date().toISOString(),
      id: movie.id || `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setWatchlistItems(prev => {
      const exists = prev.some(item => item.id === movieWithTimestamp.id || item.title === movieWithTimestamp.title);
      if (exists) {
        return prev;
      }
      return [movieWithTimestamp, ...prev];
    });
    
    return { success: true, message: 'Added to local watchlist' };
  };

  const removeFromWatchlist = async (itemId) => {
    try {
      setError(null);
      
      // Check if user is logged in
      const token = apiService.getToken();
      if (!token) {
        // Fallback to local storage
        setWatchlistItems(prev => prev.filter(item => item.id !== itemId && item.watchlist_id !== itemId));
        return { success: true };
      }

      // Find the item to remove
      const itemToRemove = watchlistItems.find(item => 
        item.id === itemId || item.watchlist_id === itemId
      );
      
      if (!itemToRemove) {
        return { success: false, message: 'Item not found in watchlist' };
      }

      // Use watchlist_id for backend removal
      const watchlistId = itemToRemove.watchlist_id || itemId;
      const response = await apiService.removeFromWatchlist(watchlistId);
      
      if (response && response.success) {
        // Reload watchlist from backend
        await loadWatchlistFromBackend();
        return { success: true, message: 'Removed from watchlist successfully' };
      } else {
        throw new Error(response?.message || 'Failed to remove from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      setError(error.message);
      
      // Fallback to local removal
      setWatchlistItems(prev => prev.filter(item => item.id !== itemId && item.watchlist_id !== itemId));
      return { success: false, message: error.message };
    }
  };

  const isInWatchlist = (movie) => {
    return watchlistItems.some(item => 
      item.id === movie.id || 
      (movie.title && item.title === movie.title)
    );
  };

  const toggleWatchlist = async (movie) => {
    if (isInWatchlist(movie)) {
      const result = await removeFromWatchlist(movie.id);
      return { action: 'removed', ...result };
    } else {
      const result = await addToWatchlist(movie);
      return { action: 'added', ...result };
    }
  };

  const clearWatchlist = async () => {
    try {
      setError(null);
      
      // Check if user is logged in
      const token = apiService.getToken();
      if (!token) {
        // Fallback to local storage
        setWatchlistItems([]);
        localStorage.removeItem('watchlist');
        return { success: true };
      }

      // Clear from backend
      const response = await apiService.clearWatchlist();
      if (response && response.success) {
        setWatchlistItems([]);
        localStorage.removeItem('watchlist');
        return { success: true, message: 'Watchlist cleared successfully' };
      } else {
        throw new Error(response?.message || 'Failed to clear watchlist');
      }
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      setError(error.message);
      
      // Fallback to local clearing
      setWatchlistItems([]);
      localStorage.removeItem('watchlist');
      return { success: false, message: error.message };
    }
  };

  const getWatchlistCount = () => {
    return watchlistItems.length;
  };

  const value = {
    watchlistItems,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    getWatchlistCount,
    loading,
    error,
    refreshWatchlist: loadWatchlistFromBackend
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};