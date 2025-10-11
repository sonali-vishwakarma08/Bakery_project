import API from "./api";

// Get all subcategories
export const getSubCategories = async (filters = {}) => {
  try {
    const res = await API.get("/subcategories/all", { params: filters });
    return res.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch subcategories" };
  }
};

// Create subcategory
export const createSubCategory = async (subCategoryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/subcategories/create", subCategoryData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating subcategory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create subcategory" };
  }
};

// Update subcategory
export const updateSubCategory = async (subCategoryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/subcategories/update", subCategoryData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating subcategory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update subcategory" };
  }
};

// Delete subcategory
export const deleteSubCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/subcategories/delete", { id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting subcategory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete subcategory" };
  }
};
