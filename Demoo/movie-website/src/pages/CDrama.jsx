import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/cDrama.css';
import apiService from '../components/apiService';

const CDrama = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const moviesPerPage = 12;

    // Fetch C-Drama movies from database
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await apiService.getMoviesByCategory('cdrama');
                if (response.success && response.movies) {
                    setMovies(response.movies);
                } else {
                    setError('Failed to load movies');
                }
            } catch (err) {
                setError('Error loading movies');
                console.error('Error fetching C-Drama movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Use first 7 movies for the hero slider
    const sliderMovies = movies.slice(0, 7);

    // Auto-switch banner every 3 seconds
    useEffect(() => {
        if (sliderMovies.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % sliderMovies.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [sliderMovies.length]);

    const currentBanner = sliderMovies[currentIndex];

    // Calculate movies for the current page (excluding slider movies)
    const contentMovies = movies.slice(7);
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = contentMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    // Total number of pages
    const totalPages = Math.ceil(contentMovies.length / moviesPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleWatchNow = () => {
        if (currentBanner) {
            navigate('/movie-player', { state: { title: currentBanner.title, video: currentBanner.video || '/movie.mp4' } });
        }
    };

    const handleTrailer = () => {
        if (currentBanner) {
            navigate('/movie-player', { state: { title: `${currentBanner.title} - Trailer`, video: currentBanner.video || '/movie.mp4' } });
        }
    };

    // Navigate to MoviePlayer on poster click
    const handlePosterClick = (movie) => {
        if (movie.video) {
            navigate('/movie-player', { state: { title: movie.title, video: movie.video } });
        } else {
            alert('Video not available for this movie.');
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="loading-container" style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Loading C-Drama movies...</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="error-container" style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Error: {error}</h2>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
                <Footer />
            </>
        );
    }

    if (movies.length === 0) {
        return (
            <>
                <Header />
                <div className="no-movies-container" style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>No C-Drama movies available</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* Hero Slider Section - Same as Home */}
            <div className="hero-section">
                {sliderMovies.map((banner, index) => (
                    <div
                        key={index}
                        className={`hero-bg ${index === currentIndex ? 'visible' : 'hidden'}`}
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                ))}

                <div className="hero-content">
                    <div className="hero-content-box">
                        
                        <h1 className="hero-title">{currentBanner.title}</h1>
                        
                        <div className="hero-meta">
                            <div className="hero-rating">
                                <span className="star">★</span>
                                <span className="rating-value">{currentBanner.rating || "9.0"}</span>
                            </div>
                            <span className="hero-year">{currentBanner.year || "2024"}</span>
                            <span className="hero-quality">G</span>
                            <span className="hero-episodes">{currentBanner.episodes || "Episodes"}</span>
                        </div>

                        <div className="hero-tags">
                            {currentBanner.tags ? currentBanner.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            )) : <span className="tag">Chinese Drama</span>}
                        </div>
                        
                        <p className="hero-description">{currentBanner.description || currentBanner.subtitle || "An amazing Chinese drama series with compelling storylines and excellent performances."}</p>
                        
                        <div className="hero-buttons">
                        <button
                        className="btn watch-now"
                        onClick={() => window.open("https://res.cloudinary.com/dfx39eneo/video/upload/v1753944607/Watchnow_g7umuk.mp4", "_blank")}
                        >
                        <span className="btn-icon">▶</span> Watch Now
                        </button>
                            <button className="btn watchlist" onClick={handleTrailer}>
                                <span className="btn-icon">+</span> Add to Watchlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button 
                    className="nav-arrow nav-arrow-left" 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length)}
                >
                    &#8249;
                </button>
                <button 
                    className="nav-arrow nav-arrow-right" 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % sliderMovies.length)}
                >
                    &#8250;
                </button>

                {/* Dot indicators */}
                <div className="hero-indicators">
                    {sliderMovies.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>

            {/* C-Drama Content Section */}
            <div className="sliderHeader">
                <h2>C-DRAMA</h2>
            </div>
            <div className="content-container">
                {currentMovies.map((movie, index) => (
                    <div className="card" key={index} onClick={() => handlePosterClick(movie)}>
                        <img src={movie.image} alt={movie.title} />
                        <b><p>{movie.title}</p></b>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <div
                        key={index}
                        className={`page ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            <Footer />
        </>
    );
};

export default CDrama;