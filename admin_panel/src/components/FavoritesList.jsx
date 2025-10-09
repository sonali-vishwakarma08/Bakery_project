import CategoryTabs from "./CategoryTabs";
import FavoriteItemCard from "./FavoriteItemCard";
import Pagination from "./Pagination";

const favoritesData = [
  {
    id: 1,
    name: "Watermelon Juice with Ice",
    image: "https://via.placeholder.com/70x70",
    sales: 2441,
    rating: 4.5,
    progress: 75,
  },
  {
    id: 2,
    name: "Mozarella Pizza with Random Topping",
    image: "https://via.placeholder.com/70x70",
    sales: 3515,
    rating: 4.5,
    progress: 85,
  },
  {
    id: 3,
    name: "Medium Spicy Pizza with Kemangi Leaf",
    image: "https://via.placeholder.com/70x70",
    sales: 3515,
    rating: 4.5,
    progress: 52,
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    image: "https://via.placeholder.com/70x70",
    sales: 1850,
    rating: 4.2,
    progress: 65,
  },
  {
    id: 5,
    name: "Blueberry Tart",
    image: "https://via.placeholder.com/70x70",
    sales: 2600,
    rating: 4.8,
    progress: 90,
  },
  {
    id: 6,
    name: "Vanilla Donut",
    image: "https://via.placeholder.com/70x70",
    sales: 1900,
    rating: 4.3,
    progress: 70,
  },
];

export default function FavoritesList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">
            Most Favorite Items
          </h3>
          <p className="text-gray-400 text-xs">
            Top-selling bakery delights loved by your customers.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Favorite Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 w-full">
        {favoritesData.slice(0, 6).map((item) => (
          <div key={item.id} className="w-full">
            <FavoriteItemCard item={item} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-3">
        <Pagination />
      </div>
    </div>
  );
}
