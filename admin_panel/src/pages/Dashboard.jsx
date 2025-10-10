import AnalyticsHeader from "../components/AnalyticsHeader";
import BakeryHeader from "../components/BakeryHeader";
import BestSellersList from "../components/BestSellersList";
import TrendingProducts from "../components/TrendingProducts";
import RecentActivity from "../components/RecentActivity";

export default function Dashboard() {
  return (
    <main
      className="
        flex-1 
        px-3 sm:px-4 md:px-5 py-4 
        bg-pink-50 
        min-h-screen 
        border-t border-gray-100
        overflow-x-hidden
        rounded-t-xl shadow-lg
        md:m-1 md:mt-2
      "
    >
      {/* 🏪 Top Welcome/Header Section */}
      {/* <BakeryHeader /> */}

      {/* 📊 Analytics Section */}
      <AnalyticsHeader />

      {/* 🧁 Best Sellers Section */}
      <section className="mt-6">
        <BestSellersList />
      </section>

      {/* 🍪 Trending + Recent Activity Side by Side */}
      <section
        className="
          grid grid-cols-1 
          lg:grid-cols-2 
          gap-4 sm:gap-6 mt-6
        "
      >
        <TrendingProducts />
        <RecentActivity />
      </section>
    </main>
  );
}
 