const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('authToken');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const buildUrl = (path) => `${API_BASE}${path}`;

const apiService = {

  async makeRequest(path, config = {}) {
    try {
      const res = await fetch(buildUrl(path), {
        headers: headers(),
        ...config,
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, ...data };
    } catch (err) {
      console.error(`API: makeRequest error for ${path}:`, err);
      return { success: false, message: 'Network error' };
    }
  },

  // specific for movies (used by Search)
  async getMovies() {
    return this.makeRequest('/movies');
  },

  // get movies by category
  async getMoviesByCategory(category) {
    return this.makeRequest(`/movies/category/${category}`);
  },

  // search movies
  async searchMovies(query) {
    return this.makeRequest(`/movies/search?q=${encodeURIComponent(query)}`);
  },

  async updateProfile({ name, email }) {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      return { success: res.ok, ...data };
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  async updatePassword({ currentPassword, newPassword }) {
    try {
      const res = await fetch(`${API_BASE}/user/password`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, ...data };
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  // FIXED: Top-up with proper response handling
async topUpBalance(amount) {
  try {
    console.log('API: Sending top-up request for amount:', amount); // Debug log
    
    const res = await fetch(`${API_BASE}/user/top-up`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ amount }),
    });
    
    const data = await res.json();
    console.log('API: Top-up response:', data); // Debug log
    
    // Return both success status and new wallet balance
    return { 
      success: res.ok && data.success, 
      ...data,
      wallet: data.wallet, // Make sure wallet balance is returned
      newBalance: data.wallet // Additional field for clarity
    };
  } catch (err) {
    console.error('API: Top-up network error:', err); // Debug log
    return { success: false, message: 'Network error' };
  }
},

  // FIXED: Plan renewal with proper response handling
  async renewPlan({ plan, price }) {
    try {
      const res = await fetch(`${API_BASE}/user/update-plan`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ plan, price }),
      });
      const data = await res.json();
      
      // Return both success status and updated user data
      return { 
        success: res.ok, 
        ...data,
        user: data.user // Make sure user data is returned
      };
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },

  // ADD: Get current user data
  async getCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: headers(),
      });
      const data = await res.json();
      return { success: res.ok, ...data };
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  },
};



export default apiService;