import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 
import '../../styles/common/Header.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    const handleLogout = () => {
        console.log("User logged out");
        logout(); // Use the logout function from AuthContext
        navigate("/login"); 
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            alert("Please enter a search term.");
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="navBar">
            <nav className="navLeft">
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li>
                        <a href="#">Series ▼</a>
                        <ul className="dropdown">
                            <li><Link to="/cdrama">C-DRAMA</Link></li>
                            <li><Link to="/kdrama">K-DRAMA</Link></li>
                            <li><Link to="/hollywood">HOLLYWOOD</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/about-us">About us</Link></li>
                </ul>
            </nav>
            <Link to="/home">
                <img className="logo" src="/images/Logo.png" alt="Website Logo" />
            </Link>
            <div className="navRight">
                <ul>
                    <li>
                        {/* Search Icon */}
                        {!showSearch && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="searchIcon"
                                onClick={toggleSearch}
                                style={{ cursor: "pointer" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 2a9 9 0 0 1 9 9c0 1.043-.185 2.052-.513 2.972l4.533 4.533a1 1 0 0 1-1.414 1.414l-4.533-4.533A8.97 8.97 0 0 1 11 20a9 9 0 1 1 0-18z"
                                />
                            </svg>
                        )}
                        {/* Search Bar */}
                        {showSearch && (
                            <div className="search-container" ref={searchRef}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSearch();
                                    }}
                                />
                                <button className="search-button" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        )}
                    </li>
                    {/* Watchlist Button - placed between search and account */}
                    <li>
                        <Link to="/watchlist" className="my-account-button">
                            My Watchlist
                        </Link>
                    </li>
                    
                    {!user && (
                        <li className="su"><Link to="/signup">Sign Up</Link></li>
                    )}
                    
                    {user && (
                        <li>
                            <Link to="/profile" className="my-account-button">
                                My Account ({user.user_name})
                            </Link>
                        </li>
                    )}
                   
                    {user && user.role === 'admin' && (
                        <li>
                            <Link to="/admin" className="admin-panel-button">
                                Admin Panel
                            </Link>
                        </li>
                    )}
                   
                    {user && (
                        <li>
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    )}
                    
                    {!user && (
                        <li>
                            <Link to="/login" className="login-button">
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;