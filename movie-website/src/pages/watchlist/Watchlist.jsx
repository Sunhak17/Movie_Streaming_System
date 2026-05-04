import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../components/watchlist/Watchlist_Context';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import '../../styles/movies/Watchlist.css';

const Watchlist = () => {
  const navigate = useNavigate();
  
  const { watchlistItems, removeFromWatchlist, clearWatchlist, getWatchlistCount } = useWatchlist();

  const handleWatchNow = (movie) => {
    navigate('/movie-player', { 
      state: { 
        title: movie.title, 
        video: movie.video || '/Video/Watchnow.mp4' 
      } 
    });
  };

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
    }
  };

  return (
    <>
      <Header />
      <div className="watchlist-container">
        <div className="watchlist-header">
          <h1>My Watchlist</h1>
          <p>Movies and shows you've saved to watch later</p>
          {watchlistItems.length > 0 && (
            <div className="watchlist-controls">
              <span className="watchlist-count">
                {getWatchlistCount()} {getWatchlistCount() === 1 ? 'item' : 'items'}
              </span>
              <button className="clear-all-btn" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {watchlistItems.length === 0 ? (
          <div className="empty-watchlist">
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies and shows you want to watch!</p>
            <button 
              className="browse-content-btn"
              onClick={() => navigate('/home')}
            >
              Browse Content
            </button>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlistItems.map((movie) => (
              <div key={movie.id} className="watchlist-card">
                <div className="card-image-container">
                  <img src={movie.image} alt={movie.title} className="card-image" />
                  <div className="card-overlay">
                    <button 
                      className="play-btn"
                      onClick={() => handleWatchNow(movie)}
                    >
                      ▶ Play Now
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromWatchlist(movie.id)}
                    title="Remove from watchlist"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{movie.title}</h3>
                  <div className="card-meta">
                    <span className="rating">⭐ {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}</span>
                    <span className="year">{movie.year}</span>
                    <span className="episodes">{movie.episodes}</span>
                  </div>
                  <div className="card-tags">
                    {movie.tags && movie.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="card-description">{movie.description}</p>
                  <div className="card-actions">
                    <button 
                      className="watch-btn"
                      onClick={() => handleWatchNow(movie)}
                    >
                      Watch Now
                    </button>
                    <span className="added-date">
                      Added {movie.addedDate ? new Date(movie.addedDate).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Watchlist;