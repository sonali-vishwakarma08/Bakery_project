import API from "./api";

// Get all categories
export const getCategories = async () => {
  try {
    const res = await API.get("/categories/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

// Create category
export const createCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/categories/create", categoryData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating category:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create category" };
  }
};

// Update category
export const updateCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/categories/update", categoryData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update category" };
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/categories/delete", { id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting category:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete category" };
  }
};
