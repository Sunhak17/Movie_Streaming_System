import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './ProfileLayout.css';

const ProfileLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === '/profile') {
      return pathname === '/profile' || pathname.startsWith('/profile/');
    }
    return pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand">Watch2Day</div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              My Account
            </button>
            <div className="nav-sep" />
            <button
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
              onClick={() => navigate('/history')}
            >
              History
            </button>
            <button
              className={`nav-link ${isActive('/myList') ? 'active' : ''}`}
              onClick={() => navigate('/myList')}
            >
              My List
            </button>
            <button
              className={`nav-link ${isActive('/subscription') ? 'active' : ''}`}
              onClick={() => navigate('/subscription')}
            >
              Subscription
            </button>
            <button className="nav-link" onClick={() => navigate('/')}>
              Back
            </button>
            <div className="nav-sep" />
            <button className="nav-link" onClick={handleLogout}>Logout</button>
          </nav>
        </aside>

        <div className="accent-strip" />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
