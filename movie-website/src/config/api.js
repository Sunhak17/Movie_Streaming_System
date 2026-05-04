// Central API configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  
  // Helper method to get the base URL
  getBaseUrl: () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  },
  
  // Helper method to build API URLs
  buildUrl: (endpoint) => {
    const baseUrl = API_CONFIG.getBaseUrl();
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
};

export default API_CONFIG;
