export default function TrendingProducts() {
  const trending = [
    { id: 1, name: "Red Velvet Cake Slice", price: "$4.50", image: "https://images.unsplash.com/photo-1589308078053-1470cf15f3b0" },
    { id: 2, name: "Cinnamon Roll", price: "$2.90", image: "https://images.unsplash.com/photo-1559628233-b9f1a1f9c6b8" },
    { id: 3, name: "Fruit Tart", price: "$3.75", image: "https://images.unsplash.com/photo-1606813902799-43b8e2174a7f" },
    { id: 4, name: "Blueberry Muffin", price: "$2.50", image: "https://images.unsplash.com/photo-1589308078053-1470cf15f3b0" },
    { id: 5, name: "Chocolate Donut", price: "$1.80", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 text-lg mb-1">Trending Bakery Items 🍪</h3>
      <p className="text-gray-400 text-sm mb-4">
        Here are the most ordered items from your bakery today
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
                <p className="text-gray-400 text-xs">Ordered {Math.floor(Math.random() * 100)}x</p>
              </div>
            </div>
            <span className="text-gray-700 font-semibold">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
