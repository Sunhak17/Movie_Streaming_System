import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../components/watchlist/Watchlist_Context';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import '../../styles/movies/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicBanners, setDynamicBanners] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState({
    cDrama: [],
    kDrama: [],
    hollywood: []
  });
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Fetch random movies for banners and categories
  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        setLoading(true);
        console.log('🚀 Starting to fetch movies from API...');
        
        // Direct fetch calls to backend API
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        console.log('📡 Making API calls to:', 'cdrama', 'kdrama', 'hollywood');
        const [cDramaRes, kDramaRes, hollywoodRes] = await Promise.all([
          fetch(`${API_BASE}/movies/category/cdrama`).then(r => r.json()),
          fetch(`${API_BASE}/movies/category/kdrama`).then(r => r.json()),
          fetch(`${API_BASE}/movies/category/hollywood`).then(r => r.json())
        ]);

        console.log('📊 API Responses:');
        console.log('  C-Drama:', cDramaRes.movies?.length || 0, 'movies');
        console.log('  K-Drama:', kDramaRes.movies?.length || 0, 'movies');
        console.log('  Hollywood:', hollywoodRes.movies?.length || 0, 'movies');

        // Check if all API calls were successful
        if (!cDramaRes.success || !kDramaRes.success || !hollywoodRes.success) {
          throw new Error('One or more API calls failed');
        }

        const allMovies = [
          ...cDramaRes.movies,
          ...kDramaRes.movies,
          ...hollywoodRes.movies
        ];

        // Create random banners from shuffled movies
        const shuffled = [...allMovies].sort(() => Math.random() - 0.5);
        const bannerMovies = shuffled.slice(0, 4).map(movie => ({
          title: movie.title,
          description: movie.description || `Enjoy watching ${movie.title} - a great ${movie.category} movie experience.`,
          rating: movie.rating || (Math.random() * 2 + 8).toFixed(1),
          year: movie.release_year || new Date().getFullYear(),
          genre: movie.genre || 'Drama',
          episodes: movie.episodes || '1 Movie',
          tags: movie.tags || [movie.category, 'Drama', 'Popular'],
          image: movie.image,
          video_url: movie.video_url,
          trailer_url: movie.trailer_url,
          isFree: true
        }));

        setDynamicBanners(bannerMovies);
        setCategoryMovies({
          cDrama: cDramaRes.movies.slice(0, 12),
          kDrama: kDramaRes.movies.slice(0, 12),
          hollywood: hollywoodRes.movies.slice(0, 12)
        });

        console.log('✅ Successfully loaded all movies and banners');

      } catch (error) {
        console.error('❌ Error fetching movies:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        // Fallback to static banners if API fails
        setDynamicBanners([{
          title: "Welcome to Movie Streaming",
          description: "Discover amazing movies from around the world",
          rating: 9.0,
          year: "2024",
          genre: "Entertainment",
          episodes: "Unlimited",
          tags: ["Movies", "Streaming", "Entertainment"],
          image: "https://via.placeholder.com/1200x600/333/fff?text=Welcome",
          isFree: true
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  // Auto-advance banners
  useEffect(() => {
    if (dynamicBanners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dynamicBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [dynamicBanners.length]);

  const currentBanner = dynamicBanners[currentIndex] || dynamicBanners[0];

  const handleWatchNow = () => {
    if (currentBanner) {
      // Check if current banner movie has video content available
      if (!currentBanner.video_url && !currentBanner.trailer_url) {
        alert(`Sorry, "${currentBanner.title}" is currently not available for streaming. Please check back later!`);
        return;
      }
      
      navigate('/movieplayer', { 
        state: { 
          movieData: {
            title: currentBanner.title,
            image: currentBanner.image,
            description: currentBanner.description,
            video_url: currentBanner.video_url,
            trailer_url: currentBanner.trailer_url
          }
        }
      });
    }
  };

  const handleAddToWatchlist = () => {
    if (!currentBanner) return;
    
    const movieData = {
      id: `banner-${currentIndex}`,
      title: currentBanner.title,
      image: currentBanner.image,
      description: currentBanner.description
    };

    if (isInWatchlist(movieData)) {
      removeFromWatchlist(movieData.id);
    } else {
      addToWatchlist(movieData);
    }
  };

  const handleMovieClick = (movie) => {
    // Check if movie has video content available
    if (!movie.video_url && !movie.trailer_url) {
      alert(`Sorry, "${movie.title}" is currently not available for streaming. Please check back later!`);
      return;
    }
    
    navigate('/movieplayer', { 
      state: { 
        movieData: {
          title: movie.title,
          image: movie.image,
          description: movie.description || `Watch ${movie.title}`,
          video_url: movie.video_url,
          trailer_url: movie.trailer_url
        }
      }
    });
  };

  const handleMovieWatchlist = (movie) => {
    const movieData = {
      id: movie.id,
      title: movie.title,
      image: movie.image,
      description: movie.description
    };

    if (isInWatchlist(movieData)) {
      removeFromWatchlist(movieData.id);
    } else {
      addToWatchlist(movieData);
    }
  };

  // Movie categories configuration
  const categories = [
    {
      title: 'C-Drama',
      movies: categoryMovies.cDrama,
      isCircle: false
    },
    {
      title: 'K-Drama', 
      movies: categoryMovies.kDrama,
      isCircle: false
    },
    {
      title: 'Hollywood',
      movies: categoryMovies.hollywood,
      isCircle: false
    }
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: '#fff'
        }}>
          <div>Loading amazing movies for you...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="hero-section">
        {dynamicBanners.map((banner, index) => (
          <div
            key={index}
            className={`hero-bg ${index === currentIndex ? 'visible' : 'hidden'}`}
            style={{ backgroundImage: `url(${banner.image})` }}
          />
        ))}

        <div className="hero-content">
          <div className="hero-content-box">
            <h1 className="hero-title">{currentBanner?.title}</h1>
            <div className="hero-meta">
              <div className="hero-rating">
                <span className="star">★</span>
                <span className="rating-value">{currentBanner?.rating}</span>
              </div>
              <span className="hero-year">{currentBanner?.year}</span>
              <span className="hero-quality">HD</span>
              <span className="hero-episodes">{currentBanner?.episodes}</span>
            </div>
            <div className="hero-tags">
              {currentBanner?.tags?.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <p className="hero-description">{currentBanner?.description}</p>
            <div className="hero-buttons">
              <button
                className="btn watch-now"
                onClick={() => window.open("https://res.cloudinary.com/dfx39eneo/video/upload/v1753944607/Watchnow_g7umuk.mp4", "_blank")}
              >
                <span className="btn-icon">▶</span> Watch Now
              </button>
              <button 
                className={`btn watchlist ${isInWatchlist({id: `banner-${currentIndex}`, title: currentBanner?.title}) ? 'in-watchlist' : ''}`}
                onClick={handleAddToWatchlist}
              >
                <span className="btn-icon">
                  {isInWatchlist({id: `banner-${currentIndex}`, title: currentBanner?.title}) ? '✓' : '+'}
                </span>
                {isInWatchlist({id: `banner-${currentIndex}`, title: currentBanner?.title}) ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          className="nav-arrow nav-arrow-left"
          onClick={() => setCurrentIndex((prev) => prev === 0 ? dynamicBanners.length - 1 : prev - 1)}
        >
          &#8249;
        </button>
        <button
          className="nav-arrow nav-arrow-right"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % dynamicBanners.length)}
        >
          &#8250;
        </button>

        {/* Banner indicators */}
        <div className="hero-indicators">
          {dynamicBanners.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Movie Categories */}
      <div className="categories-section">
        {categories.map((category, catIndex) => (
          <section key={catIndex} className="category">
            <h2 className="category-title">{category.title}</h2>
            <div className="category-grid">
              {category.movies.map((movie, movieIndex) => (
                <div key={movieIndex} className="category-item">
                  <div 
                    className="category-item-image"
                    onClick={() => handleMovieClick(movie)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className={category.isCircle ? 'circle' : ''}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x300/333/fff?text=No+Image';
                      }}
                    />
                    {!category.isCircle && (
                      <div className="category-item-overlay">
                        <div className="overlay-content">
                          <button 
                            className="play-overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovieClick(movie);
                            }}
                          >
                            ▶ Play
                          </button>
                          <button 
                            className={`watchlist-overlay-btn ${isInWatchlist({id: movie.id, title: movie.title}) ? 'added' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMovieWatchlist(movie);
                            }}
                          >
                            {isInWatchlist({id: movie.id, title: movie.title}) ? '✓ Added' : '+ Watchlist'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="category-item-title">
                    {movie.title}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Home;
