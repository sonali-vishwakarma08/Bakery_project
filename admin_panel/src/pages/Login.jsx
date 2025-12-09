import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { showSuccess } from "../utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", { email });
      const response = await loginUser(email, password);
      console.log("Login response:", response);

      if (!response || !response.user) {
        throw new Error("Invalid response from server");
      }

      // 🧠 Check if the user is an Admin
      if (response.user.role !== "admin") {
        const errorMsg = "Access Denied: Only Admins can log in here.";
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // ✅ Save token & user in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      console.log("User data saved to localStorage");

      showSuccess("Welcome Admin!");
      console.log("Navigating to /");
      
      // Use navigate with replace to prevent going back to login page
      navigate("/", { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
      console.error("Login error:", errorMsg, err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Bakery Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
 