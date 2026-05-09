import React from 'react';

const UsersTable = ({ users, loading, searchTerm, setSearchTerm, onEditUser }) => {
  return (
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
                <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((u) => (
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
                  <td style={{ padding: '12px' }}>
                    <button
                      type="button"
                      onClick={() => onEditUser?.(u)}
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
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersTable;