// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-pink-50">
      <h1 className="text-6xl font-bold text-pink-500 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you're looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
