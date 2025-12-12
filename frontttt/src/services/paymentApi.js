import axios from "axios";

const API_URL = "http://localhost:5000/api/payment";
const ORDERS_API_URL = "http://localhost:5000/api/orders";

// Get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Create Bakery Order from Cart
export const createBakeryOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${ORDERS_API_URL}/create`,
      orderData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Create PayPal Order
export const createPaymentOrder = async (orderCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-order`,
      { orderCode },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
};

// Verify Payment (after user approves on PayPal)
export const verifyPayment = async (orderID) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify`,
      { orderID },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

// Get Payment Details
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/details/${paymentId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

// Get My Payments
export const getMyPayments = async (params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/my`,
      { 
        headers: getAuthHeader(),
        params 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching my payments:", error);
    throw error;
  }
};

// Retry Failed Payment
export const retryPayment = async (paymentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/retry`,
      { paymentId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error retrying payment:", error);
    throw error;
  }
};

export default {
  createBakeryOrder,
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  getMyPayments,
  retryPayment,
};