import API from "./api";

// Get all coupons
export const getAllCoupons = async (filters = {}) => {
  try {
    const res = await API.post("/coupons/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching coupons:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch coupons" };
  }
};

// Get single coupon by ID
export const getCouponById = async (couponId) => {
  try {
    const res = await API.post("/coupons/get", { id: couponId });
    return res.data;
  } catch (error) {
    console.error("Error fetching coupon:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch coupon" };
  }
};

// Create coupon (Admin only)
export const createCoupon = async (couponData) => {
  try {
    const res = await API.post("/coupons/create", couponData);
    return res.data;
  } catch (error) {
    console.error("Error creating coupon:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create coupon" };
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (couponData) => {
  try {
    const res = await API.post("/coupons/update", couponData);
    return res.data;
  } catch (error) {
    console.error("Error updating coupon:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update coupon" };
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (couponId) => {
  try {
    const res = await API.post("/coupons/delete", { id: couponId });
    return res.data;
  } catch (error) {
    console.error("Error deleting coupon:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete coupon" };
  }
};
