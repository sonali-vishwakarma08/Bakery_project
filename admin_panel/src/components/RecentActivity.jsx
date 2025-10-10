import { useEffect, useState } from "react";
import { FaUserPlus, FaShoppingCart, FaBoxOpen, FaDollarSign } from "react-icons/fa";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate fetching recent activity data (replace with API later)
    const mockActivities = [
      {
        id: 1,
        type: "user",
        message: "New user registered - Sarah Johnson",
        time: "2 mins ago",
        icon: <FaUserPlus className="text-blue-500" />,
      },
      {
        id: 2,
        type: "order",
        message: "New order placed - Order #12345",
        time: "10 mins ago",
        icon: <FaShoppingCart className="text-pink-500" />,
      },
      {
        id: 3,
        type: "product",
        message: "New product added - Chocolate Croissant",
        time: "1 hour ago",
        icon: <FaBoxOpen className="text-yellow-500" />,
      },
      {
        id: 4,
        type: "income",
        message: "Received payment - $120.50",
        time: "2 hours ago",
        icon: <FaDollarSign className="text-green-500" />,
      },
      {
        id: 5,
        type: "order",
        message: "Order #12344 marked as delivered",
        time: "3 hours ago",
        icon: <FaShoppingCart className="text-pink-500" />,
      },
    ];

    setTimeout(() => setActivities(mockActivities), 800);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Recent Activity </h3>
      

      {activities.length === 0 ? (
        <p className="text-gray-400 text-center py-4 animate-pulse">
          Loading recent activities...
        </p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-start justify-between border-b pb-2 border-gray-200  last:border-none"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
