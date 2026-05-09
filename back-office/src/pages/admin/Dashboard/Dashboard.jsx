import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import { useAuth } from '../../../components/auth/AuthContext';
import DashboardTabs from './components/DashboardTabs';
import DashboardOverview from './components/DashboardOverview';
import UsersTable from './components/UsersTable';
import MoviesTable from './components/MoviesTable';
import DashboardRightRail from './components/DashboardRightRail';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  const handleEditUser = async (userRow) => {
    const user_name = window.prompt('Edit user name:', userRow.user_name);
    if (user_name === null) return;

    const user_email = window.prompt('Edit user email:', userRow.user_email);
    if (user_email === null) return;

    const role = window.prompt('Edit role (user/admin):', userRow.role);
    if (role === null) return;

    const subscription_plan = window.prompt('Edit subscription (Basic/Standard/Premium or leave blank):', userRow.subscription_plan || '');
    if (subscription_plan === null) return;

    const isActiveAnswer = window.confirm('Click OK for Active, Cancel for Inactive');

    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/${userRow.user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          user_name: user_name.trim(),
          user_email: user_email.trim(),
          role: role.trim(),
          subscription_plan: subscription_plan.trim(),
          is_active: isActiveAnswer
        })
      });

      const data = await response.json();
      if (data.success) {
        setUsers((currentUsers) => currentUsers.map((item) => item.user_id === userRow.user_id ? { ...item, ...data.data } : item));
        if (activeTab === 'overview') {
          fetchStats();
        }
      } else {
        window.alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      window.alert(error.message || 'Failed to update user');
    }
  };

  const handleEditMovie = async (movieRow) => {
    const title = window.prompt('Edit movie title:', movieRow.title);
    if (title === null) return;

    const category = window.prompt('Edit category (cdrama/kdrama/hollywood):', movieRow.category || 'cdrama');
    if (category === null) return;

    const release_year = window.prompt('Edit release year:', movieRow.release_year || '');
    if (release_year === null) return;

    const rating = window.prompt('Edit rating:', movieRow.rating ?? '');
    if (rating === null) return;

    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/movies/${movieRow.id || movieRow.movie_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim().toLowerCase(),
          release_year: release_year.trim(),
          rating: rating.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setMovies((currentMovies) => currentMovies.map((item) => (item.id || item.movie_id) === (movieRow.id || movieRow.movie_id) ? { ...item, ...data.data } : item));
        if (activeTab === 'overview') {
          fetchMovies();
        }
      } else {
        window.alert(data.message || 'Failed to update movie');
      }
    } catch (error) {
      window.alert(error.message || 'Failed to update movie');
    }
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
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="dashboard-grid">
          <div className="dashboard-left">
            {activeTab === 'overview' && (
              <DashboardOverview
                loading={loading}
                stats={stats}
                movies={movies}
                getGenreName={getGenreName}
              />
            )}

            {activeTab === 'users' && (
              <UsersTable
                users={users}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onEditUser={handleEditUser}
              />
            )}

            {activeTab === 'movies' && (
              <MoviesTable
                movies={movies}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                getGenreName={getGenreName}
                onEditMovie={handleEditMovie}
              />
            )}
          </div>

          <DashboardRightRail />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
