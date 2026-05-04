import axios from 'axios';
// API service for backend communication
const API_BASE_URL = 'http://localhost:3003/api';

class ApiService {
    // Helper method for making API requests
    async makeRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            ...options,
        };
        try {
            let response;
            if (options.method === 'POST') {
                response = await axios.post(url, options.body ? JSON.parse(options.body) : {}, config);
            } else if (options.method === 'PUT') {
                response = await axios.put(url, options.body ? JSON.parse(options.body) : {}, config);
            } else if (options.method === 'DELETE') {
                response = await axios.delete(url, config);
            } else {
                response = await axios.get(url, config);
            }
            return response;
        } catch (error) {
            if (error.response) {
                return error.response;
            }
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Token management
    getToken() {
        // Use cookies for authentication; token retrieval from localStorage removed
        return null;
    }

    setToken(token, remember = false) {
        if (remember) {
            // Token storage in localStorage removed; backend should set HTTP-only cookie
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('token', token);
            // Token removal from localStorage removed; backend should clear cookie
        }
    }

    removeToken() {
        // Token removal from localStorage removed; backend should clear cookie
        sessionStorage.removeItem('token');
    }

    // Authentication methods
    async login(credentials, remember = false) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            const data = response.data;
            if (response.status === 200) {
                if (data.token) {
                    this.setToken(data.token, remember);
                }
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    async register(userData) {
        try {
            const response = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    user_name: userData.name,
                    user_email: userData.email,
                    password: userData.password
                })
            });
            const data = response.data;
            console.log('Registration response status:', response.status);
            console.log('Registration response body:', data);
            if (response.status === 201 || response.status === 200) {
                if (data.token) {
                    this.setToken(data.token, true);
                }
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    async logout() {
        try {
            // Call backend logout endpoint
            await this.makeRequest('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always remove token locally
            this.removeToken();
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.makeRequest('/auth/me');
            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message || 'Failed to get user' };
            }
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    // User management methods
    async updateProfile(userData) {
        try {
            const response = await this.makeRequest('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message || 'Update failed' };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    // Video/Content methods
    async getVideos(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/videos${queryString ? '?' + queryString : ''}`;
            const response = await this.makeRequest(endpoint);
            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message || 'Failed to fetch videos' };
            }
        } catch (error) {
            console.error('Get videos error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    async getVideoById(videoId) {
        try {
            const response = await this.makeRequest(`/videos/${videoId}`);
            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message || 'Failed to fetch video' };
            }
        } catch (error) {
            console.error('Get video error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    // Watchlist methods
    async getWatchlist() {
        try {
            const response = await this.makeRequest('/watchlist');
            if (response.status === 200) {
                return response.data; // Backend returns { success: true, data: [...] }
            } else {
                return { success: false, message: response.data.message || 'Failed to fetch watchlist' };
            }
        } catch (error) {
            console.error('Get watchlist error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async addToWatchlist(movie) {
        try {
            const response = await this.makeRequest('/watchlist/add', {
                method: 'POST',
                body: JSON.stringify({ movie })
            });
            if (response.status === 200) {
                return response.data; // Backend returns { success: true, message: "...", data: {...} }
            } else {
                return { success: false, message: response.data.message || 'Failed to add to watchlist' };
            }
        } catch (error) {
            console.error('Add to watchlist error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async removeFromWatchlist(watchlistId) {
        try {
            const response = await this.makeRequest(`/watchlist/${watchlistId}`, {
                method: 'DELETE'
            });
            if (response.status === 200) {
                return response.data; // Backend returns { success: true, message: "..." }
            } else {
                return { success: false, message: response.data.message || 'Failed to remove from watchlist' };
            }
        } catch (error) {
            console.error('Remove from watchlist error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async clearWatchlist() {
        try {
            const response = await this.makeRequest('/watchlist', {
                method: 'DELETE'
            });
            if (response.status === 200) {
                return response.data; // Backend returns { success: true, message: "..." }
            } else {
                return { success: false, message: response.data.message || 'Failed to clear watchlist' };
            }
        } catch (error) {
            console.error('Clear watchlist error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    async checkInWatchlist(movieId, title = null) {
        try {
            let url = `/watchlist/check`;
            const params = new URLSearchParams();
            if (movieId && movieId !== 'null') {
                params.append('movieId', movieId);
            }
            if (title) {
                params.append('title', title);
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await this.makeRequest(url);
            if (response.status === 200) {
                return response.data; // Backend returns { success: true, inWatchlist: boolean }
            } else {
                return { success: false, message: response.data.message || 'Failed to check watchlist' };
            }
        } catch (error) {
            console.error('Check watchlist error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
