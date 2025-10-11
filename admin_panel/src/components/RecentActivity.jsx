import { useEffect, useState } from "react";
import { FaUserPlus, FaShoppingCart, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import axios from "axios";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/dashboard/recent-activity?limit=8", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Add icons based on activity type
        const activitiesWithIcons = response.data.map((activity, index) => ({
          ...activity,
          id: index + 1,
          icon: getIconForType(activity.type),
        }));
        
        setActivities(activitiesWithIcons);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  // Helper function to get icon based on activity type
  const getIconForType = (type) => {
    switch (type) {
      case "user":
        return <FaUserPlus className="text-blue-500" />;
      case "order":
        return <FaShoppingCart className="text-pink-500" />;
      case "product":
        return <FaBoxOpen className="text-yellow-500" />;
      case "income":
        return <FaDollarSign className="text-green-500" />;
      default:
        return <FaShoppingCart className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Recent Activity </h3>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-14 rounded-lg"></div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-start justify-between border-b pb-2 border-gray-200 last:border-none"
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
      ) : (
        <p className="text-gray-400 text-center py-8">
          No recent activities
        </p>
      )}
    </div>
  );
}
