import API from "./api";

// Get all orders (Admin only)
export const getAllOrders = async (filters = {}) => {
  try {
    const res = await API.post("/orders/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  try {
    const res = await API.post("/orders/get", { id: orderId });
    return res.data;
  } catch (error) {
    console.error("Error fetching order:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch order" };
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await API.post("/orders/update-status", { id: orderId, status });
    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update order status" };
  }
};

// Delete order (Admin only)
export const deleteOrder = async (orderId) => {
  try {
    const res = await API.post("/orders/delete", { id: orderId });
    return res.data;
  } catch (error) {
    console.error("Error deleting order:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete order" };
  }
};
