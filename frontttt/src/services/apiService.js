import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ==================== AUTH APIs ====================
export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await axios.get(`${BASE_URL}/auth/profile`, { headers: getAuthHeader() });
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await axios.put(`${BASE_URL}/auth/update-profile`, profileData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

// ==================== PRODUCTS APIs ====================
export const productsService = {
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams({
      status: "active",
      limit: 100,
      ...filters,
    });
    const response = await axios.get(`${BASE_URL}/products?${params}`);
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },
  
  getFeaturedProducts: async () => {
    const response = await axios.get(`${BASE_URL}/products/featured`);
    return response.data;
  },
  
  searchProducts: async (query) => {
    const response = await axios.get(`${BASE_URL}/products/search?q=${query}`);
    return response.data;
  },
};

// ==================== CATEGORIES APIs ====================
export const categoriesService = {
  getAllCategories: async () => {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  },
  
  getCategoriesWithProducts: async () => {
    const response = await axios.get(`${BASE_URL}/categories/with-products`);
    return response.data;
  },
};

// ==================== ORDERS APIs ====================
export const ordersService = {
  createOrder: async (orderData) => {
    const response = await axios.post(`${BASE_URL}/orders/create`, orderData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
  
  getMyOrders: async () => {
    const response = await axios.get(`${BASE_URL}/orders/my`, { headers: getAuthHeader() });
    return response.data;
  },
  
  getOrderById: async (id) => {
    const response = await axios.post(`${BASE_URL}/orders/get`, { id }, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

// ==================== PAYMENT APIs ====================
export const paymentService = {
  createPaymentOrder: async (orderCode) => {
    const response = await axios.post(
      `${BASE_URL}/payment/create-order`,
      { orderCode },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  verifyPayment: async (orderID) => {
    const response = await axios.post(
      `${BASE_URL}/payment/verify`,
      { orderID },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  getPaymentDetails: async (paymentId) => {
    const response = await axios.get(
      `${BASE_URL}/payment/details/${paymentId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};

// ==================== WISHLIST APIs ====================
export const wishlistService = {
  addToWishlist: async (productId) => {
    const response = await axios.post(
      `${BASE_URL}/wishlist/add`,
      { product_id: productId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  removeFromWishlist: async (productId) => {
    const response = await axios.post(
      `${BASE_URL}/wishlist/remove`,
      { product_id: productId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  getMyWishlist: async () => {
    const response = await axios.get(`${BASE_URL}/wishlist`, { headers: getAuthHeader() });
    return response.data;
  },
};

// ==================== REVIEWS APIs ====================
export const reviewsService = {
  addReview: async (productId, reviewData) => {
    const response = await axios.post(
      `${BASE_URL}/reviews`,
      { product_id: productId, ...reviewData },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  getProductReviews: async (productId) => {
    const response = await axios.get(`${BASE_URL}/reviews/product/${productId}`);
    return response.data;
  },
};

// ==================== FEEDBACK/CONTACT APIs ====================
export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await axios.post(`${BASE_URL}/support`, feedbackData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
  
  submitContactForm: async (contactData) => {
    const response = await axios.post(`${BASE_URL}/support/contact`, contactData);
    return response.data;
  },
};

export default {
  authService,
  productsService,
  categoriesService,
  ordersService,
  paymentService,
  wishlistService,
  reviewsService,
  feedbackService,
};
