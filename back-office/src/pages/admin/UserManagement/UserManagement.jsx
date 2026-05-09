import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import { useAuth } from '../../../components/auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log('🔍 Fetching users...');
      console.log('📌 API URL:', `${API_BASE}/admin/users?search=${encodeURIComponent(searchTerm)}`);
      console.log('🔐 Token:', token ? `Present (${token.substring(0, 20)}...)` : 'MISSING!');
      
      const response = await fetchWithAuth(`${API_BASE}/admin/users?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', data);
      
      if (data.success) {
        console.log(`✅ Users loaded: ${data.data.length} users`);
        setUsers(data.data);
      } else {
        console.error('❌ API returned error:', data.message);
      }
    } catch (error) {
      console.error('💥 Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
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
      } else {
        window.alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      window.alert(error.message || 'Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <h2 style={{ color: '#e6f9f0', marginBottom: '20px' }}>Users</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Search users..."
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
                  <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Subscription</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
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
                    <td style={{ padding: '12px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditUser(u)}
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
    </AdminLayout>
  );
};

export default UserManagement;
