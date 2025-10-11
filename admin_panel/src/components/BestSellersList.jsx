import { useState, useEffect } from "react";
import CategoryTabs from "./CategoryTabs";
import BakeryItemCard from "./BakeryItemCard";
import Pagination from "./Pagination";
import axios from "axios";

export default function BestSellersList() {
  const [bakeryData, setBakeryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/dashboard/best-sellers?limit=6", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Format data for BakeryItemCard
        const formattedData = response.data.map(item => ({
          id: item._id,
          name: item.name,
          image: item.image ? `http://localhost:5000/uploads/products/${item.image}` : "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
          sales: item.sales,
          rating: item.rating,
          progress: Math.min(item.progress, 100),
        }));
        
        setBakeryData(formattedData);
      } catch (err) {
        console.error("Failed to fetch best sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
          ))}
        </div>
      ) : bakeryData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {bakeryData.map((item) => (
            <BakeryItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">No best sellers data available</p>
      )}

      <Pagination />
    </div>
  );
}
