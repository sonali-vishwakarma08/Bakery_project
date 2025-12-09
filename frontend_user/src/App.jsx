import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import Contact from "./Pages/Contact";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/WishList";
import About from "./Pages/About";
import Feedback from "./Pages/Feedback";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import Payment from "./Pages/Payment";
import MyOrders from "./Pages/MyOrders";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        pauseOnHover={false}
        closeOnClick
        newestOnTop
        limit={3}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
