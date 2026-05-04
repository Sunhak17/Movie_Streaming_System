import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import apiService from '../../components/apiService';
import '../../styles/user/Profile.css';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wallet');
  const [message, setMessage] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0); // Local balance state
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfileData({
        name: user.user_name || '',
        email: user.user_email || ''
      });
      
      // FIXED: Fetch wallet balance from dedicated endpoint instead of user object
      fetchWalletBalance().then(balance => {
        if (balance !== undefined) {
          setCurrentBalance(balance);
        }
      });
    }
  }, [user, navigate]);

  // ADDED: Function to fetch fresh wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/user/wallet`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Fresh wallet data:', data);
      
      if (data.success && data.wallet) {
        setCurrentBalance(data.wallet.balance);
        console.log('Updated local balance to:', data.wallet.balance);
        return data.wallet.balance;
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
    return currentBalance;
  };

  // FIXED: Enhanced top-up function with multiple refresh strategies
  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Starting top-up for amount:', topUpAmount);
      
      const result = await apiService.topUpBalance(parseFloat(topUpAmount));
      console.log('Top-up API result:', result);
      
      if (result.success) {
        setMessage(`Successfully topped up $${topUpAmount}!`);
        setTopUpAmount('');
        
        // Strategy 1: Update from API response
        if (result.wallet !== undefined) {
          setCurrentBalance(result.wallet);
          console.log('Updated balance from API response:', result.wallet);
        } else if (result.user?.wallet !== undefined) {
          setCurrentBalance(result.user.wallet);
          console.log('Updated balance from user object:', result.user.wallet);
        }
        
        // Strategy 2: Fetch fresh data from wallet endpoint
        setTimeout(async () => {
          const freshBalance = await fetchWalletBalance();
          setCurrentBalance(freshBalance);
          console.log('Fetched fresh balance:', freshBalance);
        }, 500);
        
        // Strategy 3: Refresh user context
        if (typeof refreshUser === 'function') {
          setTimeout(async () => {
            await refreshUser();
            console.log('User context refreshed');
          }, 1000);
        }
        
        // Strategy 4: Force component re-render
        setRefreshKey(prev => prev + 1);
        
      } else {
        setMessage(result.message || 'Failed to top up balance');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Top up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await apiService.updateProfile({
        name: profileData.name,
        email: profileData.email
      });
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        if (typeof refreshUser === 'function') {
          await refreshUser();
        }
      } else {
        setMessage(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await apiService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setMessage('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message || 'Failed to update password');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container" key={refreshKey}>
      <div className="profile-header">
        <h1>My Account</h1>
        <div className="user-info">
          <p>Welcome, {user.user_name}!</p>
          <p>Current Balance: <strong>${currentBalance.toFixed(2)}</strong></p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Top Up Wallet
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <h2>Profile Information</h2>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordUpdate} className="password-form">
              <h2>Change Password</h2>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {activeTab === 'wallet' && (
            <div className="wallet-section">
              <h2>Top Up Wallet</h2>
              <div className="current-balance">
                <p>Current Balance: <strong>${currentBalance.toFixed(2)}</strong></p>
              </div>
              <div className="top-up-form">
                <div className="form-group">
                  <label htmlFor="topUpAmount">Amount to Add:</label>
                  <input
                    type="number"
                    id="topUpAmount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                  />
                </div>
                <button 
                  onClick={handleTopUp} 
                  disabled={isLoading || !topUpAmount || topUpAmount <= 0}
                  className="top-up-btn"
                >
                  {isLoading ? 'Processing...' : 'Top Up Balance'}
                </button>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('success') || message.includes('Successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="navigation-links">
        <button onClick={() => navigate('/')} className="nav-btn">
          Back to Home
        </button>
        <button onClick={() => navigate('/subscription')} className="nav-btn">
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

export default Profile;