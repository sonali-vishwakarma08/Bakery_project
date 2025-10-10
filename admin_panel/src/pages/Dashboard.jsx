import BakeryHeader from "../components/BakeryHeader";
import BestSellersList from "../components/BestSellersList";
import TrendingProducts from "../components/TrendingProducts";

export default function Dashboard() {
  return (
    <main
      className="
        flex-1 
        px-3 sm:px-4 md:px-6 py-6 
        bg-pink-50 
        min-h-screen 
        border-t border-gray-100
        overflow-x-hidden
      "
    >
      {/* Header */}
      <BakeryHeader />

      {/* Main Content Grid */}
      <section
        className="
          grid grid-cols-1 
          lg:grid-cols-2 xl:grid-cols-3 
          gap-4 sm:gap-6 mt-6
        "
      >
        {/* Best Sellers Section */}
        <div className="lg:col-span-2">
          <BestSellersList />
        </div>

        {/* Trending Products Section */}
        <div className="w-full">
          <TrendingProducts />
        </div>
      </section>
    </main>
  );
}
