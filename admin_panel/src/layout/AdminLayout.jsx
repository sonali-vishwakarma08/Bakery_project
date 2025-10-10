import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsMobileSidebarOpen(false);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50 transform transition-all duration-300
          ${
            isMobile
              ? isMobileSidebarOpen
                ? "translate-x-0 w-[220px]"
                : "-translate-x-full w-[220px]"
              : collapsed
              ? "w-16"
              : "w-[220px]"
          }`}
      >
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </aside>

      {/* Mobile overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile ? (collapsed ? "ml-16" : "ml-[220px]") : "ml-0"
        }`}
      >
        {/* Header */}
        <header
          className={`fixed top-0 right-0 z-40 bg-white shadow-md transition-all duration-300 ${
            !isMobile ? (collapsed ? "left-16" : "left-[220px]") : "left-0"
          }`}
        >
          <Header onMenuClick={toggleSidebar} />
        </header>

        {/* Page Content */}
        <main className="pt-[80px] px-3 sm:px-6 pb-6 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}