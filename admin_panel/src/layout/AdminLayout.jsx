import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="bg-gray-50">
      {/* Sidebar - fixed to the left */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="ml-64">
        {/* Fixed Header */}
        <header className="fixed top-0 left-64 right-0 z-40 bg-white shadow-md">
          <Header />
        </header>

        {/* Scrollable main content */}
        <main className="pt-[80px] p-6 min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
