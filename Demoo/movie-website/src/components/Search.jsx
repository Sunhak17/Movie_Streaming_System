import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Search.css';
import apiService from './apiService';

const normalize = (s) =>
  s
    .toString()
    .normalize()
    .trim()
    .toLowerCase()
    .replace(/^"+|"+$/g, '');

const PlayButtonOverlay = ({ videoSrc, title }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video-wrapper">
      {playing ? (
        <video
          controls
          autoPlay
          className="inline-video"
          onError={(e) => console.error(`Video load error for ${title}`, e)}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <button
          className="play-button"
          aria-label={`Play ${title}`}
          onClick={() => setPlaying(true)}
        >
          ▶
        </button>
      )}
    </div>
  );
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawQuery = new URLSearchParams(location.search).get('query') || '';
  const query = normalize(rawQuery);
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) {
        setMovies([]);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // Search database movies
        const result = await apiService.searchMovies(query);
        
        if (result.success) {
          const databaseResults = result.data || [];
          setMovies(databaseResults.map(movie => ({ ...movie, source: 'database' })));
        } else {
          console.warn('API search failed:', result.message || result.error);
          setError('Search failed. Please try again.');
          setMovies([]);
        }
        
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  const handleBack = () => {
    navigate('/'); // adjust if home route differs
  };

  return (
    <div className="search-results-container">
      <div className="top-row">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <div className="search-results-title">
          Search Results for: "{rawQuery}"
        </div>
      </div>

      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}

      {movies.length > 0 ? (
        <div className="results-grid">
          {movies.map((movie, index) => (
            <div className="search-result-item" key={`${movie.title}-${index}`}>
              <div className="search-result-title">{movie.title}</div>

              <div className="poster-wrapper">
                {movie.image && (
                  <img
                    className="search-result-poster"
                    src={movie.image}
                    alt={movie.title}
                  />
                )}
                {movie.video && (
                  <PlayButtonOverlay videoSrc={movie.video} title={movie.title} />
                )}
              </div>

              {movie.subtitle && (
                <div className="search-result-subtitle">{movie.subtitle}</div>
              )}

              {movie.description && (
                <div className="search-result-description">
                  {movie.description}
                </div>
              )}

              <div className="search-result-meta">
                {/* Handle both local (year) and database (release_year) formats */}
                {(movie.release_year || movie.year) && (
                  <div className="meta-item">
                    Year: {movie.release_year || movie.year}
                  </div>
                )}
                {movie.rating != null && (
                  <div className="meta-item">Rating: {movie.rating}</div>
                )}
                {movie.episodes && (
                  <div className="meta-item">{movie.episodes}</div>
                )}
                {/* Database movies have Genre object, local might have different format */}
                {movie.Genre && (
                  <div className="meta-item">Genre: {movie.Genre.genre_name}</div>
                )}
              </div>

              {movie.tags && (
                <div className="tag-row">
                  {Array.isArray(movie.tags) ? (
                    movie.tags.map((t, i) => (
                      <span className="tag" key={i}>
                        {t}
                      </span>
                    ))
                  ) : (
                    movie.tags.split(',').map((t, i) => (
                      <span className="tag" key={i}>
                        {t.trim()}
                      </span>
                    ))
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      ) : !loading && !error && query ? (
        <p className="search-result-no-video">
          No movies found for your search.
        </p>
      ) : null}
    </div>
  );
};

export default Search;
