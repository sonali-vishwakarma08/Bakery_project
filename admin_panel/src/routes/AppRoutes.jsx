// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

// 🧁 Pages
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Customers from "../pages/Customers";
import Settings from "../pages/Settings";
import Analytics from "../pages/Analytics";
import Inventory from "../pages/Inventory";
import Category from "../pages/Category";
import Feedback from "../pages/Feedback";
import Reports from "../pages/Reports";
import PromoCode from "../pages/Promocode";
import SubCategory from "../pages/SubCategory";
import Banner from "../pages/Banner";
import PaymentsPage from "../pages/Payment";
import AdminProfilePage from "../pages/AdminProfilePage";
import DeliveryStaff from "../pages/DeliveryStaff";
import Notifications from "../pages/Notifications";

// 🔐 Auth & Error
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected/Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="category" element={<Category />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="promocode" element={<PromoCode />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="reports" element={<Reports />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="banner" element={<Banner />} />
          <Route path="delivery-staff" element={<DeliveryStaff />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
