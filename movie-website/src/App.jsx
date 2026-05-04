import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import AboutUs from './pages/aboutus/AboutUs';
import CDrama from './pages/movies/CDrama';
import KDrama from './pages/movies/KDrama';
import Hollywood from './pages/movies/Hollywood';
import Search from './components/search/Search';
import MoviePlayer from './pages/movies/MoviePlayer';
import Profile from './pages/user/Profile';
import PlanDetails from './pages/subscription/PlanDetails';
import MyList from './pages/movies/myList';
import EditProfile from './pages/user/EditProfile';
import EditPassword from './pages/user/EditPassword';
import ManageDevices from './pages/user/ManageDevices';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AuthProvider } from './components/auth/AuthContext';
import { WatchlistProvider } from './components/watchlist/Watchlist_Context';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import Subscription from './pages/subscription/Subscription';
import Watchlist from './pages/watchlist/Watchlist';

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