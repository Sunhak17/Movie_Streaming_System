import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import AdminRoute from './components/auth/AdminRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import UserManagement from './pages/admin/UserManagement/UserManagement';
import MovieManagement from './pages/admin/MovieManagement/MovieManagement';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/movies" element={<AdminRoute><MovieManagement /></AdminRoute>} />
          <Route path="/admin/movies/cdrama" element={<AdminRoute><MovieManagement genre="cdrama" /></AdminRoute>} />
          <Route path="/admin/movies/kdrama" element={<AdminRoute><MovieManagement genre="kdrama" /></AdminRoute>} />
          <Route path="/admin/movies/hollywood" element={<AdminRoute><MovieManagement genre="hollywood" /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><UserManagement /></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
