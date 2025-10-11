import API from "./api";

// Get all payments (Admin only)
export const getAllPayments = async (filters = {}) => {
  try {
    const res = await API.post("/payments/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch payments" };
  }
};

// Create new payment (Admin only)
export const createPayment = async (paymentData) => {
  try {
    const res = await API.post("/payments/create", paymentData);
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create payment" };
  }
};

// Get single payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const res = await API.post("/payments/get", { id: paymentId });
    return res.data;
  } catch (error) {
    console.error("Error fetching payment:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch payment" };
  }
};

// Update payment (Admin only)
export const updatePayment = async (paymentData) => {
  try {
    const res = await API.post("/payments/update", paymentData);
    return res.data;
  } catch (error) {
    console.error("Error updating payment:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update payment" };
  }
};

// Delete payment (Admin only)
export const deletePayment = async (paymentId) => {
  try {
    const res = await API.post("/payments/delete", { id: paymentId });
    return res.data;
  } catch (error) {
    console.error("Error deleting payment:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete payment" };
  }
};
