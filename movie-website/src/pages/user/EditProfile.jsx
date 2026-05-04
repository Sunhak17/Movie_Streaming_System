import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import apiService from '../../components/apiService';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiService.updateProfile({ name, email });
      if (res.success) {
        setUser(res.user);
        navigate('/profile');
      } else {
        setError(res.message || 'Update failed');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {/* Show profile image if available */}
      {user?.avatar_url && (
        <img
          src={`http://localhost:5000/images/${user.avatar_url}`}
          alt="Profile"
          style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit" disabled={loading}>Save</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default EditProfile;
