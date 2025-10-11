import API from "./api";

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const res = await API.get("/dashboard/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch dashboard statistics" };
  }
};

// Get recent orders
export const getRecentOrders = async (limit = 10) => {
  try {
    const res = await API.post("/orders/all", { limit });
    return res.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch recent orders" };
  }
};

// Get sales analytics
export const getSalesAnalytics = async (period = "month") => {
  try {
    const res = await API.get(`/analytics/sales?period=${period}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch sales analytics" };
  }
};

// Get top products
export const getTopProducts = async (limit = 5) => {
  try {
    const res = await API.get(`/analytics/top-products?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching top products:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch top products" };
  }
};
