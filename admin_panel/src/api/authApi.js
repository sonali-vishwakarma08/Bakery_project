import API from "./api";

// Admin login
export const adminLogin = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

// Admin register
export const adminRegister = async (userData) => {
  try {
    const res = await API.post("/auth/register", userData);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

// Update profile
export const updateProfile = async (userData) => {
  try {
    const res = await API.post("/auth/update-profile", userData);
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update profile" };
  }
};
