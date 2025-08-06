import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../styles/Login.css';
import logo from '../assets/Logo.png';

const SignUpFooter = () => {
  return (
    <footer className="login-footer">
      <p>© {new Date().getFullYear()} Watch2Day. All rights reserved.</p>
      <p>
        <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
      </p>
    </footer>
  );
};

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp(name, email, password);
            if (result.success) {
                alert('Account created successfully! Please login.');
                navigate('/login');
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <img src={logo} alt="Watch2Day Logo" className="login-logo" />
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="signup-link">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>

            <SignUpFooter />
        </div>
    );
};

export default SignUp;