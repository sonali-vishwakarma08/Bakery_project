import CategoryTabs from "./CategoryTabs";
import BakeryItemCard from "./BakeryItemCard";
import Pagination from "./Pagination";

const bakeryData = [
  {
    id: 1,
    name: "Chocolate Fudge Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    sales: 1341,
    rating: 4.8,
    progress: 85,
  },
  {
    id: 2,
    name: "Strawberry Cream Cupcake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    sales: 980,
    rating: 4.6,
    progress: 72,
  },
  {
    id: 3,
    name: "Classic Croissant",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    sales: 1567,
    rating: 4.7,
    progress: 64,
  },
    
];

export default function BestSellersList() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">
            Best-Selling Items 
          </h3>
         
        </div>
      </div>

      <CategoryTabs />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
  {bakeryData.map((item) => (
    <BakeryItemCard key={item.id} item={item} />
  ))}
</div>


      <Pagination />
    </div>
  );
}
