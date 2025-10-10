import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="fixed top-0 left-0 md:left-64 right-0 z-40 bg-white shadow-md">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </header>

        {/* Scrollable Content */}
        <main className="pt-[80px] px-3 sm:px-6 pb-6 overflow-y-auto min-h-screen bg-pink-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
