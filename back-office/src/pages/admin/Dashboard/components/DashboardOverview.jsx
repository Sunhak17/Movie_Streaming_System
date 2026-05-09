import React from 'react';
import StatCard from '../../../../components/StatCard/StatCard';

const DashboardOverview = ({ loading, stats, movies, getGenreName }) => {
  return (
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

      <div className="chart-section" style={{ marginTop: '24px' }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Recent Movies</h3>
            <button className="chart-menu" type="button">⋮</button>
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
                  {movies.slice(0, 5).map((movie) => (
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
  );
};

export default DashboardOverview;