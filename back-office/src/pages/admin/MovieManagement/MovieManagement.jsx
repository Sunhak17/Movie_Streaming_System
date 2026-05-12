import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import { useAuth } from '../../../components/auth/AuthContext';
import EditMovieModal from '../Dashboard/components/edit/EditMovieModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const MovieManagement = ({ genre }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    setPage(1);
  }, [movies, searchTerm, genre]);

  const sortedMovies = React.useMemo(() => {
    if (!movies) return [];
    return [...movies].sort((a, b) => (Number(a.id || a.movie_id) || 0) - (Number(b.id || b.movie_id) || 0));
  }, [movies]);

  const totalPages = Math.max(1, Math.ceil(sortedMovies.length / PAGE_SIZE));
  const pageMovies = sortedMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        
        // Filter by category if specified
        if (genre) {
          filtered = filtered.filter(m => (m.category || '').toLowerCase() === genre.toLowerCase());
          console.log(`✅ Filtered ${genre}: ${filtered.length} movies`);
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

  const handleEditMovie = (movieRow) => {
    setEditingMovie(movieRow);
    setShowMovieModal(true);
  };

  const handleSaveMovie = async (formData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/admin/movies/${editingMovie.id || editingMovie.movie_id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setMovies((currentMovies) => currentMovies.map((item) => (item.id || item.movie_id) === (editingMovie.id || editingMovie.movie_id) ? { ...item, ...data.data } : item));
        setShowMovieModal(false);
        setEditingMovie(null);
      } else {
        throw new Error(data.message || 'Failed to update movie');
      }
    } catch (error) {
      throw error;
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
                  <th style={{ textAlign: 'left', padding: '12px' }}>Image</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Genre</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Year</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Rating</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Created</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageMovies.length > 0 ? pageMovies.map(m => (
                  <tr key={m.id || m.movie_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px' }}>{m.id || m.movie_id}</td>
                    <td style={{ padding: '12px' }}>
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.title}
                          style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '56px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#7b8a84', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                          No Img
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>{m.title}</td>
                    <td style={{ padding: '12px' }}>{getGenreName(m.genre_id)}</td>
                    <td style={{ padding: '12px' }}>{m.release_year}</td>
                    <td style={{ padding: '12px' }}>⭐ {m.rating || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditMovie(m)}
                        style={{
                          border: '1px solid rgba(4,211,97,0.35)',
                          background: 'rgba(4,211,97,0.12)',
                          color: '#04d361',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No movies found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#cbd9d2' }}>
          <div>Showing {Math.min(sortedMovies.length, (page - 1) * PAGE_SIZE + 1)}-{Math.min(sortedMovies.length, page * PAGE_SIZE)} of {sortedMovies.length}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>Prev</button>
            <div>{page} / {totalPages}</div>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>Next</button>
          </div>
        </div>
      </div>

      <EditMovieModal
        movie={editingMovie}
        isOpen={showMovieModal}
        onClose={() => {
          setShowMovieModal(false);
          setEditingMovie(null);
        }}
        onSave={handleSaveMovie}
        genres={genres}
      />
    </AdminLayout>
  );
};

export default MovieManagement;
