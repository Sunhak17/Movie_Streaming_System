import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="profile">
          <div className="avatar">{user?.user_name?.substring(0, 2).toUpperCase() || 'AD'}</div>
          <div className="profile-info">
            <div className="profile-name">{user?.user_name || 'Admin'}</div>
            <div className="profile-sub">Watch2Day</div>
          </div>
        </div>

        <nav className="nav-list">
          <Link to="/admin" className={`sidebar-item ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="item-icon">📊</span>
            <span className="item-name">Dashboard</span>
          </Link>

          <div className="section-sep" />

          <div className="section-label">Movies</div>
          <Link to="/admin/movies/cdrama" className={`sidebar-item ${isActive('/admin/movies/cdrama') ? 'active' : ''}`}>
            <span className="item-icon">🇨🇳</span>
            <span className="item-name">CDrama</span>
          </Link>
          <Link to="/admin/movies/kdrama" className={`sidebar-item ${isActive('/admin/movies/kdrama') ? 'active' : ''}`}>
            <span className="item-icon">🇰🇷</span>
            <span className="item-name">KDrama</span>
          </Link>
          <Link to="/admin/movies/hollywood" className={`sidebar-item ${isActive('/admin/movies/hollywood') ? 'active' : ''}`}>
            <span className="item-icon">⭐</span>
            <span className="item-name">Hollywood</span>
          </Link>

          <div className="section-sep" />

          <Link to="/admin/users" className={`sidebar-item ${isActive('/admin/users') ? 'active' : ''}`}>
            <span className="item-icon">👥</span>
            <span className="item-name">Users</span>
          </Link>

          <div className="section-sep" />

          <button 
            onClick={handleLogout}
            className="sidebar-item"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <span className="item-icon">🚪</span>
            <span className="item-name">Logout</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="product">Watch2Day</div>
      </div>
    </aside>
  );
};

export default Sidebar;