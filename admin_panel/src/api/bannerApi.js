import API from "./api";

// Get all banners
export const getBanners = async (filters = {}) => {
  try {
    const res = await API.get("/banners/all", { params: filters });
    return res.data;
  } catch (error) {
    console.error("Error fetching banners:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch banners" };
  }
};

// Create banner
export const createBanner = async (bannerData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/banners/create", bannerData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating banner:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create banner" };
  }
};

// Update banner
export const updateBanner = async (bannerData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/banners/update", bannerData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating banner:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update banner" };
  }
};

// Delete banner
export const deleteBanner = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/banners/delete", { id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting banner:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete banner" };
  }
};
