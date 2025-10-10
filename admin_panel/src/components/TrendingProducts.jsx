export default function RecentOrders() {
  const recentOrders = [
    {
      id: 1,
      customer: "Alice Johnson",
      item: "Chocolate Croissant",
      total: "$8.90",
      image: "https://images.unsplash.com/photo-1606813902799-43b8e2174a7f",
      status: "Delivered",
    },
    {
      id: 2,
      customer: "Mark Wilson",
      item: "Red Velvet Cake Slice",
      total: "$4.50",
      image: "https://images.unsplash.com/photo-1589308078053-1470cf15f3b0",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Sophia Brown",
      item: "Cinnamon Roll",
      total: "$3.20",
      image: "https://images.unsplash.com/photo-1559628233-b9f1a1f9c6b8",
      status: "Processing",
    },
    {
      id: 4,
      customer: "Liam Smith",
      item: "Blueberry Muffin",
      total: "$2.80",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      status: "Delivered",
    },
  ];

  // Status color mapping
  const statusColors = {
    Delivered: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Recent Orders 🧾</h3>
     

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
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
