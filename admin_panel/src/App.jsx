import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
