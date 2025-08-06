import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import CDrama from './pages/CDrama';
import KDrama from './pages/KDrama';
import Hollywood from './pages/Hollywood';
import Search from './components/Search';
import MoviePlayer from './pages/MoviePlayer';
import Profile from './pages/Profile';
import PlanDetails from './pages/PlanDetails';
import MyList from './pages/myList';
import EditProfile from './pages/EditProfile';
import EditPassword from './pages/EditPassword';
import ManageDevices from './pages/ManageDevices';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './components/AuthContext';
import { WatchlistProvider } from './components/Watchlist_Context';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Subscription from './pages/Subscription';
import Watchlist from './pages/Watchlist';

const App = () => {
    return (
        <AuthProvider>
            <WatchlistProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/about-us" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
                        <Route path="/cdrama" element={<PrivateRoute><CDrama /></PrivateRoute>} />
                        <Route path="/kdrama" element={<PrivateRoute><KDrama /></PrivateRoute>} />
                        <Route path="/hollywood" element={<PrivateRoute><Hollywood /></PrivateRoute>} />
                        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
                        <Route path="/movie-player" element={<PrivateRoute><MoviePlayer /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                        <Route path="/profile/edit-password" element={<PrivateRoute><EditPassword /></PrivateRoute>} />
                        <Route path="/profile/devices" element={<PrivateRoute><ManageDevices /></PrivateRoute>} />
                        <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                        <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
                        <Route path="/myList" element={<PrivateRoute><MyList /></PrivateRoute>} />
                        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    </Routes>
                </Router>
            </WatchlistProvider>
        </AuthProvider>
    );
};

export default App;