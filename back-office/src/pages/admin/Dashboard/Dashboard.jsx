import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import StatCard from '../../../components/StatCard/StatCard';
import NotificationPanel from '../../../components/NotificationPanel/NotificationPanel';
import ActivityPanel from '../../../components/ActivityPanel/ActivityPanel';
import { useAuth } from '../../../components/auth/AuthContext';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      localStorage.removeItem('authToken');
      navigate('/login');
      throw new Error('No authentication token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      navigate('/login');
      throw new Error('Authentication failed');
    } else if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      console.log('🔍 Fetching stats...');
      console.log('📌 API URL:', `${API_BASE}/admin/users/stats`);
      console.log('🔐 Token:', token ? `Present (${token.substring(0, 20)}...)` : 'MISSING!');
      
      const response = await fetchWithAuth(`${API_BASE}/admin/users/stats`);
      const data = await response.json();
      
      console.log('✅ Stats response:', data);
      if (data.success) {
        console.log('✅ Stats loaded');
        setStats(data.data);
      }
    } catch (error) {
      console.error('💥 Error fetching stats:', error.message);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/genres`);
      const data = await response.json();
      if (data.success) {
        const genreList = [
          { id: '', name: 'Select Genre' },
          ...data.data.map(genre => ({ 
            id: genre.genre_id, 
            name: genre.genre_name 
          }))
        ];
        setGenres(genreList);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log('🔍 Fetching users from Dashboard...');
      console.log('📌 API URL:', `${API_BASE}/admin/users?search=${encodeURIComponent(searchTerm)}`);
      
      const response = await fetchWithAuth(`${API_BASE}/admin/users?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      console.log('✅ Users response:', data);
      if (data.success) {
        console.log(`✅ Users loaded: ${data.data.length} users`);
        console.log('📝 Users data before setState:', data.data);
        setUsers(data.data);
        console.log('📝 Users state updated (async)');
      } else {
        console.error('❌ API error:', data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('💥 Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log('🔍 Fetching movies from Dashboard...');
      console.log('📌 API URL:', `${API_BASE}/admin/movies?search=${encodeURIComponent(searchTerm)}`);
      
      const response = await fetchWithAuth(`${API_BASE}/admin/movies?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      console.log('✅ Movies response:', data);
      if (data.success) {
        const formattedMovies = data.data.map(movie => ({
          ...movie,
          source: 'database',
          isEditable: true
        }));
        console.log(`✅ Movies loaded: ${formattedMovies.length} movies`);
        console.log('📝 Movies data before setState:', formattedMovies);
        setMovies(formattedMovies);
        console.log('📝 Movies state updated (async)');
      } else {
        console.error('❌ API error:', data.message);
        setMovies([]);
      }
    } catch (error) {
      console.error('💥 Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getGenreName = (genreId) => {
    if (!genreId) return 'No Genre';
    const genre = genres.find(g => g.id == genreId);
    return genre ? genre.name : 'Unknown';
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    console.log('📑 Tab changed to:', activeTab);
    console.log('👥 Current users state:', users);
    console.log('🎬 Current movies state:', movies);
    
    switch (activeTab) {
      case 'overview':
        console.log('🔍 Loading overview...');
        fetchStats();
        fetchMovies();
        break;
      case 'users':
        console.log('🔍 Loading users...');
        fetchUsers();
        break;
      case 'movies':
        console.log('🔍 Loading movies...');
        fetchMovies();
        break;
    }
  }, [activeTab]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'movies') {
        fetchMovies();
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, activeTab]);

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-header" style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'overview' ? 'rgba(4,211,97,0.2)' : 'transparent',
                color: activeTab === 'overview' ? '#04d361' : '#a7bdb6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'overview' ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'users' ? 'rgba(4,211,97,0.2)' : 'transparent',
                color: activeTab === 'users' ? '#04d361' : '#a7bdb6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'users' ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              Users
            </button>
            <button 
              className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'movies' ? 'rgba(4,211,97,0.2)' : 'transparent',
                color: activeTab === 'movies' ? '#04d361' : '#a7bdb6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'movies' ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              Movies
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Left Content */}
          <div className="dashboard-left">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <div className="stats-section">
                  <h2 className="section-title">Key Metrics</h2>
                  <div className="stats-grid">
                    {loading || !stats ? (
                      <div className="loading">Loading...</div>
                    ) : (
                      <>
                        <StatCard
                          title="Total Users"
                          value={stats.totalUsers}
                          change={`${stats.newUsers} new last 30 days`}
                          changeType="positive"
                          icon="👥"
                        />
                        <StatCard
                          title="Active Users"
                          value={stats.activeUsers}
                          change="Currently active"
                          changeType="positive"
                          icon="🟢"
                        />
                        <StatCard
                          title="Total Movies"
                          value={movies.length}
                          change="In library"
                          changeType="positive"
                          icon="🎬"
                        />
                        <StatCard
                          title="Admin Users"
                          value={stats.adminUsers}
                          change="System administrators"
                          changeType="neutral"
                          icon="🛡️"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Movie List Preview */}
                <div className="chart-section" style={{ marginTop: '24px' }}>
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Recent Movies</h3>
                      <button className="chart-menu">⋮</button>
                    </div>
                    {loading ? (
                      <div style={{ padding: '20px' }}>Loading movies...</div>
                    ) : movies.length > 0 ? (
                      <div style={{ padding: '16px', overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <th style={{ textAlign: 'left', padding: '8px' }}>Title</th>
                              <th style={{ textAlign: 'left', padding: '8px' }}>Genre</th>
                              <th style={{ textAlign: 'left', padding: '8px' }}>Year</th>
                              <th style={{ textAlign: 'left', padding: '8px' }}>Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {movies.slice(0, 5).map(movie => (
                              <tr key={movie.id || movie.movie_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '8px' }}>{movie.title}</td>
                                <td style={{ padding: '8px' }}>{getGenreName(movie.genre_id)}</td>
                                <td style={{ padding: '8px' }}>{movie.release_year}</td>
                                <td style={{ padding: '8px' }}>⭐ {movie.rating || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: '20px', color: '#666' }}>No movies yet</div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="table-section">
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(4,211,97,0.3)',
                      borderRadius: '8px',
                      color: '#e6f9f0',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading users...</div>
                ) : (
                  <div className="data-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(4,211,97,0.2)' }}>
                          <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Subscription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? users.map(u => (
                          <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px' }}>{u.user_id}</td>
                            <td style={{ padding: '12px' }}>{u.user_name}</td>
                            <td style={{ padding: '12px' }}>{u.user_email}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                background: u.role === 'admin' ? 'rgba(16,185,129,0.2)' : 'rgba(59,11,11,0.2)',
                                color: u.role === 'admin' ? '#04d361' : '#ffcfcf',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                background: u.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(59,11,11,0.2)',
                                color: u.is_active ? '#04d361' : '#ffcfcf',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}>
                                {u.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>{u.subscription_plan || 'Free'}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Movies Tab */}
            {activeTab === 'movies' && (
              <div className="table-section">
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Search movies by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(4,211,97,0.3)',
                      borderRadius: '8px',
                      color: '#e6f9f0',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading movies...</div>
                ) : (
                  <div className="data-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(4,211,97,0.2)' }}>
                          <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Genre</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Year</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Rating</th>
                          <th style={{ textAlign: 'left', padding: '12px' }}>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.length > 0 ? movies.map(m => (
                          <tr key={m.id || m.movie_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px' }}>{m.id || m.movie_id}</td>
                            <td style={{ padding: '12px' }}>{m.title}</td>
                            <td style={{ padding: '12px' }}>{getGenreName(m.genre_id)}</td>
                            <td style={{ padding: '12px' }}>{m.release_year}</td>
                            <td style={{ padding: '12px' }}>⭐ {m.rating || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No movies found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="dashboard-right">
            {/* Notification Panel */}
            <NotificationPanel />

            {/* Activity Panel */}
            <ActivityPanel />

            {/* Premium Card */}
            <div className="premium-card">
              <span className="premium-icon">⭐</span>
              <p className="premium-label">Premium Plane</p>
              <p className="premium-desc">$30 <span>Per Month</span></p>
              <p className="premium-text">Improve your workplace. View and analyze your profits and losses</p>
              <button className="premium-btn">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
