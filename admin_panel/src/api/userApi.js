import API from "./api";

// Get all users (Admin only)
export const getAllUsers = async (filters = {}) => {
  try {
    const res = await API.post("/users/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const res = await API.post("/users/single", { id: userId });
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

// Update user
export const updateUser = async (userData) => {
  try {
    const res = await API.post("/users/update", userData);
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update user" };
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const res = await API.post("/users/create", userData);
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create user" };
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const res = await API.post("/users/delete", { id: userId });
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete user" };
  }
};
