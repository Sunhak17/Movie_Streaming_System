import React, { useState } from 'react';
import apiService from '../components/apiService';
import { useNavigate } from 'react-router-dom';

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiService.updatePassword({ currentPassword, newPassword });
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.message || 'Password update failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="edit-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Current Password:</label>
        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Update Password</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default EditPassword;
