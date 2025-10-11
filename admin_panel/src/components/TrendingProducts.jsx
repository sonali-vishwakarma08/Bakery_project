import { useState, useEffect } from "react";
import axios from "axios";

export default function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/dashboard/recent-orders?limit=5", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Format data with proper image paths
        const formattedOrders = response.data.map(order => ({
          ...order,
          image: order.image ? `http://localhost:5000/uploads/products/${order.image}` : "https://images.unsplash.com/photo-1606813902799-43b8e2174a7f",
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        }));
        
        setRecentOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to fetch recent orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // Status color mapping
  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Recent Orders 🧾</h3>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-16 rounded-lg"></div>
          ))}
        </div>
      ) : recentOrders.length > 0 ? (
        <ul className="space-y-3">
          {recentOrders.map((order) => (
            <li
              key={order.id}
              className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-none"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={order.image}
                  alt={order.item}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <p className="text-gray-700 font-medium">{order.item}</p>
                  <p className="text-gray-400 text-xs">
                    {order.customer}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-gray-700 font-semibold">{order.total}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                >
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 py-8">No recent orders</p>
      )}
    </div>
  );
}
