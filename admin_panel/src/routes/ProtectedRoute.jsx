// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ⛔ If not logged in, go to login
  if (!token || !user?._id) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ If user is not admin, block access
  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-pink-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You are not authorized to access the Admin Panel.
          </p>
          <a
            href="/login"
            className="text-pink-500 underline hover:text-pink-700 mt-4 inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // ✅ If everything is fine → render child routes
  return <Outlet />;
}
