import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Home from './Pages/Home'
import Login from './Pages/Login';
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import Contact from './Pages/Contact';
import Products from './Pages/Products';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Wishlist from './Pages/WishList';
import About from './Pages/About';
import Feedback from './Pages/Feedback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<SignUp />} />
         <Route path="/profile" element={<Profile />} />
         <Route path='/about' element={<About/>}/>
         <Route path="/contact" element={<Contact />} />
         <Route path='/feedback' element={<Feedback/>}/>
         <Route path="/products" element={<Products />} />
         <Route path="/product/:id" element={<ProductDetails />} />
         <Route path="/cart" element={<Cart />} />
         <Route path="/wishlist" element={<Wishlist />} />
         
      </Routes>
       <ToastContainer position="top-center" autoClose={1500} />
    </BrowserRouter>
  )
}
