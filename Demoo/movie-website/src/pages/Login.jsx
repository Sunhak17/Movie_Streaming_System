import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/Login.css';
import logo from '../assets/Logo.png';

const LoginFooter = () => {
  return (
    <footer className="login-footer">
      <p>© {new Date().getFullYear()} Watch2Day. All rights reserved.</p>
      <p>
        <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
      </p>
    </footer>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields!');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        alert('Login successful!');
        
        // Check if user is admin and redirect accordingly
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert(result.message || 'Invalid email or password');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Watch2Day Logo" className="login-logo" />
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember Me
              </label>

            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>

      <LoginFooter />
    </div>
  );
};

export default Login;
