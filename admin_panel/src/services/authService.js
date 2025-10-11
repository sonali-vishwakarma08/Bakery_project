import API from "../api/api";

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/userAuth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server Error" };
  }
};
