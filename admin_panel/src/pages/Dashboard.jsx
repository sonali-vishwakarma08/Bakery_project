import BakeryHeader from "../components/BakeryHeader";
import BestSellersList from "../components/BestSellersList";
import TrendingProducts from "../components/TrendingProducts";

export default function Dashboard() {
  return (
    <div className="p-6 bg-pink-50 min-h-screen shadow-lg border rounded-lg border-gray-100">
      <BakeryHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <BestSellersList />
        </div>
        <div>
          <TrendingProducts />
        </div>
      </div>
    </div>
  );
}
