import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import '../../styles/auth/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user?.role === 'admin') {
        navigate('/admin');
        return;
      }

      await logout();
      setError('Admin access only. Use an admin account to continue.');
    } catch (err) {
      setError(err?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin123@gmail.com');
    setPassword('admin12345');
    setError('');
  };

  return (
    <div className="back-office-login">
      <div className="login-shell">
        <div className="login-panel">
          <p className="eyebrow">Watch2Day</p>
          <h1>Back Office</h1>
          <p className="login-copy">Sign in to manage users, movies, and platform settings.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@watch2day.com"
                autoComplete="email"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {error ? <div className="login-error">{error}</div> : null}

            <div style={{display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between'}}>
              <button type="button" onClick={fillDemo} style={{background: 'transparent', color: '#93c5fd', border: 'none', cursor: 'pointer'}}>Use demo</button>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <p style={{marginTop:12, color:'#94a3b8', fontSize:12}}>Demo admin: <strong>admin123@gmail.com</strong> / <strong>admin12345</strong></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
