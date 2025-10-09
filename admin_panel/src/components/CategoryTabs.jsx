const categories = ["All", "Cakes", "Pastries", "Breads", "Cookies", "Drinks"];

export default function CategoryTabs() {
  return (
    <div className="flex gap-10 border-b border-gray-300  text-sm text-gray-500 mt-3 overflow-x-auto">
      {categories.map((cat, i) => (
        <button
          key={i}
          className={`pb-2 ${
            i === 0
              ? "border-b-2 border-pink-500 text-pink-600 font-medium"
              : "hover:text-pink-500"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
