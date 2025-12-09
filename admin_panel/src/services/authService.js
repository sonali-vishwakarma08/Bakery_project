import API from "../api/api";

export const loginUser = async (email, password) => {
  try {
    console.log('Sending login request to:', '/userAuth/login');
    const response = await API.post("/userAuth/login", { email, password });
    console.log('Login response:', response.data);
    
    // The backend returns user data directly in the response
    const responseData = response.data;
    
    if (!responseData || !responseData.user) {
      throw new Error('Invalid response format from server');
    }

    return {
      user: {
        _id: responseData.user.id || responseData.user._id,
        email: responseData.user.email,
        name: responseData.user.name,
        role: responseData.user.role
      },
      token: responseData.token
    };
  } catch (error) {
    console.error("Login Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};
