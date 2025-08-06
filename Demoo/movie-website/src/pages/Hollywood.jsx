import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/hollywood.css';
import apiService from '../components/apiService';

const Hollywood = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const moviesPerPage = 12;

    // Fetch Hollywood movies from database
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await apiService.getMoviesByCategory('hollywood');
                if (response.success && response.movies) {
                    setMovies(response.movies);
                } else {
                    setError('Failed to load movies');
                }
            } catch (err) {
                setError('Error loading movies');
                console.error('Error fetching Hollywood movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const heroMovies = movies.slice(0, 7);

    // Auto-switch slides
    useEffect(() => {
        if (heroMovies.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [heroMovies.length]);

    // Handle hero navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    };

    // Handle movie navigation
    const handleWatchNow = (movie) => {
        if (movie.video) {
            navigate('/movie-player', { state: { title: movie.title, video: movie.video } });
        } else {
            alert('Video not available for this movie.');
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

    // Calculate movies for the current page
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    // Total number of pages
    const totalPages = Math.ceil(movies.length / moviesPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <>
                <Header />
                <div className="loading-container" style={{ padding: '100px', textAlign: 'center' }}>
                    <h2>Loading Hollywood movies...</h2>
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
                    <h2>No Hollywood movies available</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* Hero Slider Section */}
            <div className="hero-section">
                <div className="hero-slider">
                    {heroMovies.map((movie, index) => (
                        <div
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${movie.image})` }}
                        >
                            <div className="hero-overlay">
                                <div className="hero-content">
                                    <h1 className="hero-title">{movie.title}</h1>
                                    <div className="hero-meta">
                                        <span className="rating">⭐ {movie.rating || '8.5'}</span>
                                        <span className="episodes">{movie.episodes || 16} Episodes</span>
                                        <span className="genre">{movie.subtitle}</span>
                                    </div>
                                    <p className="hero-description">{movie.description}</p>
                                    {movie.tags && (
                                        <div className="hero-tags">
                                            {movie.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="hero-buttons">
                                        <button 
                                            className="btn-primary"
                                            onClick={() => window.open("https://res.cloudinary.com/dfx39eneo/video/upload/v1754395276/Captain_Marvel_-_Bande-annonce_officielle_VF_jgn7jv.mp4", "_blank")}                                        >
                                            ▶ Watch Now
                                        </button>
                                        <button className="btn-secondary">
                                            + Add to List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Navigation Arrows */}
                    <button className="hero-nav hero-nav-prev" onClick={prevSlide}>
                        &#8249;
                    </button>
                    <button className="hero-nav hero-nav-next" onClick={nextSlide}>
                        &#8250;
                    </button>
                    
                    {/* Slide Indicators */}
                    <div className="hero-indicators">
                        {heroMovies.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Hollywood Movies Section */}
            <div className="sliderHeader">
                <h2>HOLLYWOOD</h2>
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

export default Hollywood;