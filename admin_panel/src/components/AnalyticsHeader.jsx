import { useEffect, useState } from "react";
import { FaUsers, FaShoppingCart, FaDollarSign, FaBoxOpen } from "react-icons/fa";

export default function AnalyticsHeader() {
  const [stats, setStats] = useState({
    users: null,
    sales: null,
    income: null,
    products: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/dashboard/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        setStats({
          users: data.totalUsers,
          sales: data.totalSales,
          income: data.totalIncome,
          products: data.totalProducts,
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      color: "bg-blue-100",
    },
    {
      label: "Total Sales",
      value: stats.sales,
      icon: <FaShoppingCart className="text-pink-500 text-2xl" />,
      color: "bg-pink-100",
    },
    {
      label: "Total Income",
      value: stats.income ? `₹${stats.income.toLocaleString()}` : null,
      icon: <FaDollarSign className="text-green-500 text-2xl" />,
      color: "bg-green-100",
    },
    {
      label: "Total Products",
      value: stats.products,
      icon: <FaBoxOpen className="text-yellow-500 text-2xl" />,
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="mt-4 mb-4">
      {/* Header Title */}
      

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700  rounded-lg mb-4">
        {/* //  ⚠️ {error} */}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="flex items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mr-4`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              {loading ? (
                <div className="w-16 h-4 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-xl font-semibold text-gray-800">
                  {stat.value ?? "0"}
                </h3>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
    