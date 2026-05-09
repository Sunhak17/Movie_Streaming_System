import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import { useAuth } from '../../../components/auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const MovieManagement = ({ genre }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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
      navigate('/login');
      throw new Error('No token');
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
      logout();
      navigate('/login');
      throw new Error('Auth failed');
    }

    return response;
  };

  const fetchGenres = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/genres`);
      const data = await response.json();
      if (data.success) {
        const genreList = data.data.map(g => ({ 
          id: g.genre_id, 
          name: g.genre_name 
        }));
        setGenres(genreList);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log('🔍 Fetching movies...');
      console.log('📌 API URL:', `${API_BASE}/admin/movies?search=${encodeURIComponent(searchTerm)}`);
      console.log('🔐 Token:', token ? `Present (${token.substring(0, 20)}...)` : 'MISSING!');
      
      const response = await fetchWithAuth(`${API_BASE}/admin/movies?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', data);
      
      if (data.success) {
        let filtered = data.data;
        
        // Filter by genre if specified
        if (genre) {
          const genreMap = { cdrama: 11, kdrama: 12, hollywood: 13 };
          const genreId = genreMap[genre];
          if (genreId) {
            filtered = filtered.filter(m => m.genre_id == genreId);
            console.log(`✅ Filtered ${genre}: ${filtered.length} movies`);
          }
        }
        
        console.log(`✅ Movies loaded: ${filtered.length} movies`);
        setMovies(filtered);
      } else {
        console.error('❌ API returned error:', data.message);
      }
    } catch (error) {
      console.error('💥 Error fetching movies:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getGenreName = (genreId) => {
    const g = genres.find(x => x.id == genreId);
    return g ? g.name : 'Unknown';
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchMovies, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, genre]);

  const genreTitle = genre ? (genre.charAt(0).toUpperCase() + genre.slice(1)) : 'All Movies';

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#e6f9f0', marginBottom: '20px' }}>{genreTitle}</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Search movies..."
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
          <div style={{ padding: '20px', textAlign: 'center', color: '#a7bdb6' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', color: '#e6f9f0' }}>
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
    </AdminLayout>
  );
};

export default MovieManagement;
