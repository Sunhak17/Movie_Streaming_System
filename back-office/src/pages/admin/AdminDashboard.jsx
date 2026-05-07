import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import '../../styles/admin/AdminDashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Enhanced authentication check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // No token - immediate redirect
    if (!token) {
      console.log('AdminDashboard: No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Check if token is malformed or invalid
    if (token === 'test-token' || token.split('.').length !== 3) {
      console.log('AdminDashboard: Invalid token detected, clearing and redirecting to login');
      localStorage.removeItem('authToken');
      navigate('/login');
      return;
    }
    
    // Token exists but user not loaded yet - wait
    if (!user) {
      console.log('AdminDashboard: Token exists, waiting for user to load...');
      return;
    }
    
    // User loaded but not admin - redirect to home
    if (user.role !== 'admin') {
      console.log('AdminDashboard: User is not admin, redirecting to home');
      navigate('/');
      return;
    }
    
    console.log('AdminDashboard: Admin authenticated successfully');
  }, [user, navigate]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre_id: '',
    release_year: new Date().getFullYear(),
    rating: 0,
    poster_url: ''
  });
  
  const [editingMovie, setEditingMovie] = useState(null);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token from localStorage:', token ? 'Token exists' : 'Token is null/undefined');
    return token;
  };

  // Enhanced fetch with better error handling
  const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();
    console.log('Making request to:', url, 'with token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.error('No auth token available, redirecting to login');
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

    // Handle different error types
    if (response.status === 401) {
      console.error('Authentication failed - invalid token');
      localStorage.removeItem('authToken');
      navigate('/login');
      throw new Error('Authentication failed');
    } else if (response.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      alert('You do not have permission to perform this action');
      throw new Error('Access forbidden');
    } else if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  };

  // Fetch genres
  const fetchGenres = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/genres`);
      const data = await response.json();
      if (data.success) {
        // Convert database genres to the format expected by the UI
        const genreList = [
          { id: '', name: 'Select Genre' },
          ...data.data.map(genre => ({ 
            id: genre.genre_id, 
            name: genre.genre_name 
          }))
        ];
        setGenres(genreList);
      } else {
        // Fallback to default genres
        initializeGenres();
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Fallback to default genres
      initializeGenres();
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Initialize genres
  const initializeGenres = () => {
    const genreList = [
      { id: '', name: 'Select Genre' },
      { id: 11, name: 'CDrama' },
      { id: 12, name: 'KDrama' },
      { id: 13, name: 'Hollywood' }
    ];
    setGenres(genreList);
  };

  // Get genre name by ID
  const getGenreName = (genreId) => {
    if (!genreId) return 'No Genre';
    const genre = genres.find(g => g.id == genreId);
    return genre ? genre.name : 'Unknown';
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users with search term:', searchTerm);
      const response = await fetchWithAuth(`${API_BASE}/admin/users?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      console.log('Users fetch response:', data);
      if (data.success) {
        setUsers(data.data);
        console.log('Users loaded:', data.data.length);
      } else {
        console.error('Failed to fetch users:', data.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies (combining database and local movies)
  const fetchMovies = async () => {
    setLoading(true);
    try {
      console.log('Fetching movies with search term:', searchTerm);
      // Fetch database movies
      let databaseMovies = [];
      
      try {
        const response = await fetchWithAuth(`${API_BASE}/admin/movies?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        console.log('Movies fetch response:', data);
        if (data.success) {
          databaseMovies = data.data.map(movie => ({
            ...movie,
            source: 'database',
            isEditable: true // Database movies can be edited/deleted
          }));
          console.log('Database movies loaded:', databaseMovies.length);
          // Debug: Log first movie to see structure
          if (databaseMovies.length > 0) {
            console.log('Sample movie data:', databaseMovies[0]);
            console.log('Image fields check:', {
              image: databaseMovies[0].image,
              poster_url: databaseMovies[0].poster_url,
              posterUrl: databaseMovies[0].posterUrl
            });
          }
        }
      } catch (authError) {
        console.error('Error fetching database movies:', authError);
        // If it's an auth error, the fetchWithAuth already handled the redirect
      }
      
      // Set only database movies
      setMovies(databaseMovies);
      
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete user with enhanced safety
  const deleteUser = async (userId) => {
    console.log('Delete user called with ID:', userId);
    
    // Find the user to get more info
    const userToDelete = users.find(u => u.user_id === userId);
    if (!userToDelete) {
      alert('User not found');
      return;
    }
    
    // Prevent deleting admin users
    if (userToDelete.role === 'admin') {
      alert('Cannot delete admin users for security reasons');
      return;
    }
    
    // Enhanced confirmation with user details
    const confirmMessage = `⚠️ PERMANENT DELETE WARNING ⚠️\n\nYou are about to permanently delete:\n• User: ${userToDelete.user_name}\n• Email: ${userToDelete.user_email}\n• Role: ${userToDelete.role}\n\nThis action CANNOT be undone!\n\nType "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      console.log('User did not type DELETE correctly - operation cancelled');
      return;
    }
    
    // Final confirmation
    if (!confirm('Are you absolutely sure? This will permanently remove all user data!')) {
      console.log('User cancelled final confirmation');
      return;
    }
    
    console.log('Proceeding with delete for user:', userId);
    
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      
      const data = await response.json();
      console.log('Delete response data:', data);
      
      if (data.success) {
        await fetchUsers(); // Refresh the list
        alert(`✅ User "${userToDelete.user_name}" has been permanently deleted`);
      } else {
        alert(`❌ Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`❌ Error deleting user: ${error.message}`);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/users/${userId}/toggle-status`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        alert(data.message);
      } else {
        alert(data.message || 'Failed to toggle user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error toggling user status');
    }
  };

  // Handle poster file selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setPosterFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload poster image
  const uploadPoster = async () => {
    if (!posterFile) return null;
    
    console.log('=== UPLOAD DEBUG ===');
    console.log('Poster file:', posterFile);
    console.log('File name:', posterFile.name);
    console.log('File size:', posterFile.size);
    console.log('File type:', posterFile.type);
    
    const formData = new FormData();
    formData.append('poster', posterFile);
    
    const token = getAuthToken();
    console.log('Using token for upload:', token ? token.substring(0, 30) + '...' : 'No token');
    
    try {
      console.log('Making upload request to:', `${API_BASE}/admin/upload-poster`);
      
      const response = await fetch(`${API_BASE}/admin/upload-poster`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser will set it with boundary
        }
      });
      
      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Upload success response:', data);
      
      if (data.success) {
        console.log('Poster uploaded successfully:', data.posterUrl);
        return data.posterUrl;
      } else {
        throw new Error(data.message || 'Failed to upload poster');
      }
    } catch (error) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      throw error;
    }
  };

  // Add/Update movie with loading state
  const saveMovie = async () => {
    if (!movieForm.title.trim()) {
      alert('Movie title is required');
      return;
    }
    
    console.log('=== SAVE MOVIE DEBUG ===');
    console.log('Movie form:', movieForm);
    console.log('Poster file selected:', posterFile ? posterFile.name : 'No file');
    console.log('Current auth token:', getAuthToken() ? 'Present' : 'Missing');
    
    setLoading(true);
    try {
      let posterUrl = movieForm.poster_url;
      
      // Upload poster if a new file was selected
      if (posterFile) {
        console.log('Uploading poster file...');
        try {
          posterUrl = await uploadPoster();
          console.log('Poster upload completed. URL:', posterUrl);
        } catch (error) {
          console.error('Poster upload failed:', error);
          alert(`Failed to upload poster: ${error.message}`);
          setLoading(false);
          return;
        }
      } else {
        console.log('No poster file to upload, using existing URL:', posterUrl);
      }
      
      const movieData = {
        ...movieForm,
        poster_url: posterUrl
      };
      
      console.log('Final movie data to save:', movieData);
      
      const url = editingMovie 
        ? `${API_BASE}/admin/movies/${editingMovie.id || editingMovie.movie_id}`
        : `${API_BASE}/admin/movies`;
      
      const method = editingMovie ? 'PUT' : 'POST';
      
      console.log('Making movie save request:', { url, method });
      
      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(movieData)
      });
      
      const data = await response.json();
      console.log('Movie save response:', data);
      
      if (data.success) {
        console.log('Movie saved successfully!');
        await fetchMovies(); // Refresh the list
        setShowMovieForm(false);
        setEditingMovie(null);
        resetMovieForm();
        alert(data.message);
      } else {
        console.error('Movie save failed:', data.message);
        alert(data.message || 'Failed to save movie');
      }
    } catch (error) {
      console.error('=== SAVE MOVIE ERROR ===');
      console.error('Error saving movie:', error);
      alert(`Error saving movie: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset movie form
  const resetMovieForm = () => {
    setMovieForm({
      title: '',
      description: '',
      genre_id: '',
      release_year: new Date().getFullYear(),
      rating: 0,
      poster_url: ''
    });
    setPosterFile(null);
    setPosterPreview(null);
  };

  // Delete movie with enhanced safety (only for database movies)
  const deleteMovie = async (movieId) => {
    console.log('Delete movie called with ID:', movieId);
    
    // Check if it's a local movie
    if (movieId.toString().startsWith('local-')) {
      alert('❌ Cannot delete local movies. These are read-only files.');
      return;
    }
    
    // Find the movie to get more info - use correct ID field
    const movieToDelete = movies.find(m => m.id === movieId || m.movie_id === movieId);
    if (!movieToDelete) {
      alert('Movie not found');
      return;
    }
    
    // Enhanced confirmation with movie details
    const confirmMessage = `⚠️ PERMANENT DELETE WARNING ⚠️\n\nYou are about to permanently delete:\n• Movie: ${movieToDelete.title}\n• Genre: ${getGenreName(movieToDelete.genre_id)}\n• Year: ${movieToDelete.release_year}\n\nThis action CANNOT be undone!\n\nType "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      console.log('User did not type DELETE correctly - operation cancelled');
      return;
    }
    
    // Final confirmation
    if (!confirm('Are you absolutely sure? This will permanently remove the movie from the database!')) {
      console.log('User cancelled movie delete operation');
      return;
    }
    
    console.log('Proceeding with movie delete for ID:', movieId);
    
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/movies/${movieId}`, {
        method: 'DELETE'
      });
      
      console.log('Movie delete response status:', response.status);
      
      const data = await response.json();
      console.log('Movie delete response data:', data);
      
      if (data.success) {
        await fetchMovies(); // Refresh the list
        alert(`✅ Movie "${movieToDelete.title}" has been permanently deleted`);
      } else {
        alert(`❌ Failed to delete movie: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert(`❌ Error deleting movie: ${error.message}`);
    }
  };

  // Edit movie (database movies only)
  const editMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description || '',
      genre_id: movie.genre_id || '',
      release_year: movie.release_year || new Date().getFullYear(),
      rating: movie.rating || 0,
      poster_url: movie.image || ''
    });
    setPosterPreview(movie.image || null);
    setPosterFile(null);
    setShowMovieForm(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'overview':
        fetchStats();
        fetchMovies(); // Load movies for overview statistics
        break;
      case 'users':
        fetchUsers();
        break;
      case 'movies':
        fetchMovies();
        break;
    }
  }, [activeTab]);

  // Initialize genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Reload data when search term changes with debounce
  useEffect(() => {
    console.log('Search term changed to:', searchTerm);
    
    // Debounce search to avoid too many API calls
    const searchTimeout = setTimeout(() => {
      if (activeTab === 'users') {
        console.log('Triggering user search...');
        fetchUsers();
      } else if (activeTab === 'movies') {
        console.log('Triggering movie search...');
        fetchMovies();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, activeTab]);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Watch2Day Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.user_name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`nav-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          🎬 Movies
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="content-section">
            <div className="section">
              <h2>System Overview</h2>
              {stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-label">Registered users</div>
                  </div>
                  <div className="stat-card">
                    <h3>Active Users</h3>
                    <div className="stat-value">{stats.activeUsers}</div>
                    <div className="stat-label">Currently active</div>
                  </div>
                  <div className="stat-card">
                    <h3>Inactive Users</h3>
                    <div className="stat-value">{stats.inactiveUsers}</div>
                    <div className="stat-label">Temporarily disabled</div>
                  </div>
                  <div className="stat-card">
                    <h3>Admin Users</h3>
                    <div className="stat-value">{stats.adminUsers}</div>
                    <div className="stat-label">System administrators</div>
                  </div>
                  <div className="stat-card">
                    <h3>New Users</h3>
                    <div className="stat-value">{stats.newUsers}</div>
                    <div className="stat-label">Last 30 days</div>
                  </div>
                  <div className="stat-card">
                    <h3>Premium Users</h3>
                    <div className="stat-value">{stats.subscriptionStats?.premium || 0}</div>
                    <div className="stat-label">Premium subscribers</div>
                  </div>
                </div>
              ) : (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading statistics...</p>
                </div>
              )}
            </div>
            
            {/* Movie Statistics Section */}
            <div className="section">
              <h2>Movie Library Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Database Movies</h3>
                  <div className="stat-value">
                    {movies.filter(m => m.source === 'database').length}
                  </div>
                  <div className="stat-label">Movies added via admin panel</div>
                </div>
                <div className="stat-card">
                  <h3>Local File Movies</h3>
                  <div className="stat-value">
                    {movies.filter(m => m.source === 'local').length}
                  </div>
                  <div className="stat-label">Movies from data files</div>
                </div>
                <div className="stat-card">
                  <h3>Total Movies</h3>
                  <div className="stat-value">{movies.length}</div>
                  <div className="stat-label">Complete movie library</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="content-section">
            <div className="section">
              <h2>User Management</h2>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Subscription</th>
                        <th>Wallet</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.user_id}>
                          <td>{user.user_id}</td>
                          <td>{user.user_name}</td>
                          <td>{user.user_email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{user.subscription_plan}</td>
                          <td>${user.wallet || 0}</td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              {user.role !== 'admin' && (
                                <>
                                  <button 
                                    onClick={() => toggleUserStatus(user.user_id)}
                                    className={`btn-secondary ${user.is_active ? 'btn-warning' : 'btn-success'}`}
                                    title={user.is_active ? 'Deactivate user account' : 'Activate user account'}
                                  >
                                    {user.is_active ? '⏸️ Suspend' : '▶️ Activate'}
                                  </button>
                                  <button 
                                    onClick={() => deleteUser(user.user_id)}
                                    className="btn-danger btn-small"
                                    title="⚠️ Permanently delete user (IRREVERSIBLE)"
                                    style={{ 
                                      fontSize: '11px', 
                                      padding: '4px 8px',
                                      opacity: '0.7',
                                      border: '1px solid #ff4444'
                                    }}
                                  >
                                    🗑️ Delete
                                  </button>
                                </>
                              )}
                              {user.role === 'admin' && (
                                <span className="admin-protected" style={{ 
                                  color: '#4ade80', 
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  🛡️ Protected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div className="content-section">
            <div className="section">
              <h2>Movie Management</h2>
              <div className="form-group">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search movies by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => setShowMovieForm(true)}
                    className="btn-primary"
                  >
                    <span className="btn-icon">➕</span>
                    Add Movie
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading movies...</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Year</th>
                        <th>Rating</th>
                        <th>Source</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map(movie => (
                        <tr key={movie.id || movie.movie_id} className={movie.source === 'local' ? 'local-movie' : 'database-movie'}>
                          <td>{movie.id || movie.movie_id}</td>
                          <td>
                            {(() => {
                              // Try multiple possible image field names
                              const imageUrl = movie.image || movie.poster_url || movie.posterUrl;
                              console.log(`Movie ${movie.title} - Image URL:`, imageUrl);
                              
                              return imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={movie.title}
                                  style={{ 
                                    width: '40px', 
                                    height: '60px', 
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }}
                                  onError={(e) => {
                                    console.log(`Image failed to load for ${movie.title}:`, imageUrl);
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null;
                            })()}
                            <div 
                              style={{ 
                                width: '40px', 
                                height: '60px', 
                                display: (movie.image || movie.poster_url || movie.posterUrl) ? 'none' : 'flex',
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: '#666'
                              }}
                            >
                              No Image
                            </div>
                          </td>
                          <td>{movie.title}</td>
                          <td>{movie.description ? movie.description.substring(0, 50) + '...' : ''}</td>
                          <td>
                            {movie.source === 'local' 
                              ? (movie.Genre ? movie.Genre.genre_name : 'Unknown')
                              : getGenreName(movie.genre_id)
                            }
                          </td>
                          <td>{movie.release_year}</td>
                          <td>⭐ {movie.rating || 'N/A'}</td>
                          <td>
                            <span className={`source-badge ${movie.source}`}>
                              {movie.source === 'database' ? '💾 Database' : '📁 Local File'}
                            </span>
                          </td>
                          <td>
                            {movie.source === 'database' && movie.created_at !== 'N/A' 
                              ? new Date(movie.created_at).toLocaleDateString()
                              : 'N/A'
                            }
                          </td>
                          <td>
                            <div className="table-actions">
                              {movie.isEditable && (
                                <>
                                  <button 
                                    onClick={() => editMovie(movie)}
                                    className="btn-secondary"
                                    title="Edit movie details"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteMovie(movie.id || movie.movie_id)}
                                    className="btn-danger btn-small"
                                    title="⚠️ Permanently delete movie (IRREVERSIBLE)"
                                    style={{ 
                                      fontSize: '11px', 
                                      padding: '4px 8px',
                                      opacity: '0.7',
                                      border: '1px solid #ff4444'
                                    }}
                                  >
                                    🗑️ Delete
                                  </button>
                                </>
                              )}
                              {!movie.isEditable && (
                                <span className="readonly-indicator" style={{ 
                                  color: '#6b7280', 
                                  fontSize: '12px',
                                  fontStyle: 'italic'
                                }}>
                                  📖 Read-only
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Movie Form Modal */}
            {showMovieForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="section">
                    <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); saveMovie(); }}>
                      
                      {/* Poster Upload Section */}
                      <div className="form-group">
                        <label>Movie Poster</label>
                        <div className="poster-upload-container">
                          <div className="poster-preview">
                            {posterPreview ? (
                              <img src={posterPreview} alt="Poster preview" className="poster-preview-img" />
                            ) : (
                              <div className="poster-placeholder">
                                <span className="poster-icon">🎬</span>
                                <p>No poster selected</p>
                              </div>
                            )}
                          </div>
                          <div className="poster-upload-controls">
                            <input
                              type="file"
                              id="poster-upload"
                              accept="image/*"
                              onChange={handlePosterChange}
                              className="file-input"
                            />
                            <label htmlFor="poster-upload" className="btn-secondary file-upload-btn">
                              <span className="btn-icon">📁</span>
                              Choose Image
                            </label>
                            {posterFile && (
                              <div className="file-info">
                                <span className="file-name">{posterFile.name}</span>
                                <span className="file-size">({(posterFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={movieForm.title}
                          onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
                          placeholder="Enter movie title"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          value={movieForm.description}
                          onChange={(e) => setMovieForm({...movieForm, description: e.target.value})}
                          placeholder="Enter movie description"
                          rows="4"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Genre</label>
                        <select
                          className="form-control"
                          value={movieForm.genre_id}
                          onChange={(e) => setMovieForm({...movieForm, genre_id: e.target.value})}
                        >
                          {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>
                              {genre.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Release Year</label>
                        <input
                          type="number"
                          className="form-control"
                          value={movieForm.release_year}
                          onChange={(e) => setMovieForm({...movieForm, release_year: parseInt(e.target.value)})}
                          min="1900"
                          max="2030"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Rating (0-10)</label>
                        <input
                          type="number"
                          className="form-control"
                          step="0.1"
                          min="0"
                          max="10"
                          value={movieForm.rating}
                          onChange={(e) => setMovieForm({...movieForm, rating: parseFloat(e.target.value)})}
                          placeholder="0.0"
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="btn-secondary"
                          onClick={() => {
                            setShowMovieForm(false);
                            setEditingMovie(null);
                            resetMovieForm();
                          }}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="loading-spinner"></span>
                              {editingMovie ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            <>
                              <span className="btn-icon">💾</span>
                              {editingMovie ? 'Update Movie' : 'Add Movie'}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debug Panel - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: '#000', color: '#fff', padding: '10px', borderRadius: '5px', fontSize: '12px', zIndex: 9999 }}>
            <div><strong>Debug Info</strong></div>
            <div>Users: {users.length}</div>
            <div>Movies: {movies.length}</div>
            <div>Token: {getAuthToken() ? 'Present' : 'Missing'}</div>
            <div>Role: {user?.role || 'Unknown'}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
