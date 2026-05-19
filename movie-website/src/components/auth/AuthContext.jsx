import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('AuthContext: Token found on mount:', token ? 'Yes' : 'No');
    
    if (token) {
      // Verify token with backend using /auth/me endpoint
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log('AuthContext: Token verification response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('AuthContext: Token verification response:', data);
        if (data.success && data.data && data.data.user) {
          setUser(data.data.user);
        } else {
          console.log('AuthContext: Invalid token, removing from localStorage');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      })
      .catch(error => {
        console.error('AuthContext: Token verification failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔄 Authenticating user with backend...');
      console.log('🌐 API URL:', `${API_BASE}/auth/login`);
      console.log('📧 Email:', email);
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, password }),
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse login response:', parseError);
      }
      console.log('📡 Login API response:', data);

      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, response.statusText);
        return {
          success: false,
          message: data?.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }
      
      if (data?.success && data.data?.token) {
        // Clear any existing auth data first
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Store new token and user data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        console.log('✅ User authenticated successfully:', data.data.user);
        return { success: true, user: data.data.user };
      } else {
        console.error('❌ Login failed:', data?.message);
        return { success: false, message: data?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, message: 'Network error: Cannot connect to server. Please check if the backend is running.' };
      }
      
      return { success: false, message: `Network error: ${error.message}` };
    }
  };

  
  const signUp = async (name, email, password) => {
    try {
      console.log('🔄 Creating new user account...');
      console.log('🌐 API URL:', `${API_BASE}/auth/register`);
      console.log('📝 Signup data:', { name, email });
      
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          user_name: name,
          user_email: email,
          password: password
        }),
      });
      
      console.log('📡 Signup response status:', response.status);
      const data = await response.json();
      console.log('📡 Signup API response:', data);
      
      if (response.ok && data.success) {
        console.log('✅ Account created successfully');
        return { 
          success: true, 
          message: data.message || 'Account created successfully' 
        };
      } else {
        console.error('❌ Signup failed:', data.message);
        return { 
          success: false, 
          message: data.message || `Registration failed: ${response.status} ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('💥 Network error during signup:', error);
      return { 
        success: false, 
        message: `Network error: ${error.message}` 
      };
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No token found for refresh');
      return false;
    }

    try {
      console.log('Refreshing user data with token...');
      
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      console.log('Auth me response:', data);
      
      if (data.success && data.data && data.data.user) {
        console.log('Old user wallet:', user?.wallet);
        console.log('New user wallet:', data.data.user.wallet);
        
        // Force state update
        setUser(prevUser => ({
          ...prevUser,
          ...data.data.user,
          wallet: data.data.user.wallet // Ensure wallet is updated
        }));
        
        console.log('User state updated successfully');
        return true;
      } else {
        console.error('Failed to refresh user data:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signUp,      // ✅ ADDED: Export signUp function
      logout, 
      refreshUser, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};