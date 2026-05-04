import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import '../../styles/movies/myList.css'; 
import logo from '../../assets/Logo.png'; 

const myList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const handleBackToHome = () => {
    navigate('/home'); // Navigate to home page
  };

  // Sample watchlist data (replace with actual data from useAuth or API)
  const myListData = user?.myList || [
    { title: 'Supermen', status: 'To Watch' },
    { title: 'Oppenheimer', status: 'In Progress' },
    { title: 'The Zone of Interest', status: 'Completed' },
  ];

  return (
    <div className="my-list-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-info">
          <img src={logo} alt="User Avatar" className="user-avatar" />
          <span>{user?.name || 'Zendy'}</span>
        </div>
        <button className="join-premier">JOIN PREMIER</button>
        <ul className="nav-menu">
          <li onClick={() => navigate('/profile')}>My Account</li>
          <li onClick={() => navigate('/history')}>History</li>
          <li onClick={() => navigate('/mylist')}>My List</li>
          <li onClick={() => navigate('/subscription')}>Subscription</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <button className="back-to-home-btn" onClick={handleBackToHome}>
          Back to Homepage
        </button>
        <h1>My List</h1>

        {/* My List Section */}
        <div className="my-list-section">
          <div className="my-list-card">
            {myListData.length > 0 ? (
              myListData.map((item, index) => (
                <div className="my-list-item" key={index}>
                  <h3>{item.title}</h3>
                  <p>Status: <span className="status">{item.status}</span></p>
                  <button className="remove-btn">Remove</button>
                </div>
              ))
            ) : (
              <p>No items in your list.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div>
            <p>About WATCH2DAY</p>
            <p>About us</p>
            <p>Product and services</p>
            <p>Copyright ©2025 WATCH2DAY ALL Rights Reserved</p>
          </div>
          <div>
            <p>Advertisement</p>
            <p>Corporate relations</p>
          </div>
          <div>
            <p>Help and support</p>
            <p>Feedback</p>
            <p>Security Response Center</p>
          </div>
          <div>
            <p>Terms of service</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default myList;