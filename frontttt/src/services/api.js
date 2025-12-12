import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Special API instance for multipart/form-data
const apiWithFiles = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add request interceptor to include auth token for file uploads
apiWithFiles.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: async (data) => {
    // Check if we have file data
    if (data instanceof FormData || (typeof data === 'object' && data.constructor === FormData)) {
      // Use multipart/form-data for file uploads
      return apiWithFiles.post('/auth/update-profile', data);
    } else {
      // Use regular JSON for regular updates
      return api.post('/auth/update-profile', data);
    }
  },
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getCustomizable: (params = {}) => api.get('/products/customizable', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  // Add more product-related API calls as needed
};

export const orderAPI = {
  create: (orderData) => api.post('/orders/create', orderData),
  getMyOrders: () => api.get('/orders/my'),
  getOrderDetails: (id) => api.post('/orders/get', { id }),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const paymentAPI = {
  createOrder: (orderId) => api.post('/payment/create-order', { orderId }),
  verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),
  getMyPayments: (params = {}) => {
    try {
      return api.get('/payment/my', { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        params 
      });
    } catch (error) {
      console.error("Error fetching my payments:", error);
      throw error;
    }
  },
  // Add more payment-related API calls as needed
};

export const wishlistAPI = {
  add: (productId) => api.post('/wishlist/add', { product: productId }),
  get: () => api.post('/wishlist/get'),
  remove: (productId) => api.post('/wishlist/remove', { product: productId }),
};

export { API_BASE_URL, SERVER_BASE_URL };
export default api;