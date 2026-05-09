import React from 'react';

const MoviesTable = ({ movies, loading, searchTerm, setSearchTerm, getGenreName, onEditMovie }) => {
  return (
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
                <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? movies.map((m) => (
                <tr key={m.id || m.movie_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{m.id || m.movie_id}</td>
                  <td style={{ padding: '12px' }}>{m.title}</td>
                  <td style={{ padding: '12px' }}>{getGenreName(m.genre_id)}</td>
                  <td style={{ padding: '12px' }}>{m.release_year}</td>
                  <td style={{ padding: '12px' }}>⭐ {m.rating || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      type="button"
                      onClick={() => onEditMovie?.(m)}
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
    </div>
  );
};

export default MoviesTable;