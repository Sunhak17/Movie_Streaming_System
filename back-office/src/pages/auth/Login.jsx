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

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
