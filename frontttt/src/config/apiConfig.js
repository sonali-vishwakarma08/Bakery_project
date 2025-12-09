const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  
  // User
  USER: {
    PROFILE: `${API_BASE_URL}/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/update-profile`,
  },
  
  // Products
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    FEATURED: `${API_BASE_URL}/products/featured`,
    CATEGORY: (categoryId) => `${API_BASE_URL}/products/category/${categoryId}`,
    SEARCH: `${API_BASE_URL}/products/search`,
    SINGLE: (id) => `${API_BASE_URL}/products/${id}`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: `${API_BASE_URL}/categories`,
    WITH_PRODUCTS: `${API_BASE_URL}/categories/with-products`,
  },
  
  // Cart
  CART: {
    BASE: `${API_BASE_URL}/cart`,
    ITEM: (itemId) => `${API_BASE_URL}/cart/${itemId}`,
  },
  
  // Orders
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    MY_ORDERS: `${API_BASE_URL}/orders/my`,
    SINGLE: (id) => `${API_BASE_URL}/orders/get`,
  },
  
  // Payment
  PAYMENT: {
    CREATE_ORDER: `${API_BASE_URL}/payment/create-order`,
    VERIFY: `${API_BASE_URL}/payment/verify`,
  },
  
  // Uploads
  UPLOADS: {
    BASE: `${SERVER_BASE_URL}/uploads`,
  },
};

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  
  // If it's a local path, prepend the uploads URL
  return `${SERVER_BASE_URL}/uploads/${path.replace(/^\//, '')}`;
};

// Helper function to get API URL for a specific endpoint
export const getApiUrl = (endpoint, params = {}) => {
  if (typeof endpoint === 'function') {
    return endpoint(params);
  }
  return endpoint;
};

export default {
  API_BASE_URL,
  SERVER_BASE_URL,
  API_ENDPOINTS,
  getImageUrl,
  getApiUrl,
};
