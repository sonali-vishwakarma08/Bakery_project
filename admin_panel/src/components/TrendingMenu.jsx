export default function TrendingMenu() {
  const trending = [
    { id: 1, name: "Medium Spicy Spaghetti Italiano", price: "$5.6", image: "https://via.placeholder.com/60" },
    { id: 2, name: "Watermelon Juice with Ice", price: "$5.6", image: "https://via.placeholder.com/60" },
    { id: 3, name: "Chicken Curry Special with Cucumber", price: "$5.6", image: "https://via.placeholder.com/60" },
    { id: 4, name: "Italiano Pizza With Garlic", price: "$5.6", image: "https://via.placeholder.com/60" },
    { id: 5, name: "Tuna Soup Spinach with Himalaya Salt", price: "$5.6", image: "https://via.placeholder.com/60" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 text-lg">Daily Trending Menus</h3>
      <p className="text-gray-400 text-sm mb-4">
        Lorem ipsum dolor sit amet consectetur
      </p>

      <ul className="space-y-3">
        {trending.map((item, index) => (
          <li
            key={item.id}
            className="flex justify-between items-center text-sm border-b pb-2"
          >
            <div className="flex gap-3 items-center">
              <span className="text-gray-400 font-semibold">#{index + 1}</span>
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div>
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-gray-400 text-xs">Order 89x</p>
              </div>
            </div>
            <span className="text-gray-700 font-semibold">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
