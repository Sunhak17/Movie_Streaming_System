import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import './Header.css';

const Header = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumbs">
          {breadcrumbs.length > 0 ? (
            <>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="breadcrumb">
                  <span className="breadcrumb-item">{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <span className="breadcrumb-sep">/</span>}
                </div>
              ))}
            </>
          ) : (
            <span className="breadcrumb-item">Dashboards</span>
          )}
        </div>
        <h1 className="page-title">{breadcrumbs[breadcrumbs.length - 1] || 'Overview'}</h1>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button className="header-icon" title="Toggle theme">
          🌙
        </button>

        {/* Refresh */}
        <button className="header-icon" title="Refresh">
          🔄
        </button>

        {/* Notifications */}
        <button className="header-icon" title="Notifications">
          <span className="notification-badge">3</span>
          🔔
        </button>

        {/* Search */}
        <button className="header-icon" title="Search">
          🔍
        </button>

        {/* User Menu */}
        <div className="user-menu">
          <div className="user-avatar">
            {user?.user_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.user_name || 'Admin'}</p>
            <p className="user-role">{user?.role || 'Administrator'}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
