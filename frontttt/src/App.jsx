import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Home from './Pages/Home'
import Login from './Pages/Login';
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import ProfileInfo from './Pages/ProfileInfo'
import Orders from './Pages/Orders'
import WishlistPage from './Pages/WishlistPage'
import CustomCake from './Pages/CustomCake'
import Payments from './Pages/Payments'
import Contact from './Pages/Contact';
import Products from './Pages/Products';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Wishlist from './Pages/WishList';
import About from './Pages/About';
import Feedback from './Pages/Feedback';
import Payment from "./Pages/Payment";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";
import OrderDetails from "./Pages/OrderDetails";
import AddressDetails from "./Pages/AddressDetails";
import AddressSelection from "./Pages/AddressSelection"; // Import AddressSelection component
import { registerServiceWorker, requestNotificationPermission, listenToForegroundMessages, sendTokenToBackend } from './services/notificationService';

export default function App() {
  useEffect(() => {
    // Initialize Firebase notifications - Call once on app load
    const initializeNotifications = async () => {
      try {
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log("\n🔔 Initializing notifications...");
        
        // Register service worker
        await registerServiceWorker();
        
        // Listen to foreground messages - this works even without FCM token
        listenToForegroundMessages();
        
        console.log("✅ Notification system initialized. Waiting for user to grant permission...");
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };
    
    initializeNotifications();
  }, []);

  // Add a function to request notification permission on demand (e.g., after login)
  useEffect(() => {
    const handleUserLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // User is logged in, request notification permission
        console.log("👤 User logged in, requesting notification permission...");
        const fcmToken = await requestNotificationPermission();
        
        if (fcmToken) {
          console.log("Notification token obtained:", fcmToken);
          await sendTokenToBackend(fcmToken);
        } else {
          console.log("No FCM token, but foreground notifications will work");
          await sendTokenToBackend(null);
        }
        
        // Stop the polling interval after first successful login
        clearInterval(interval);
      }
    };

    // Check for login on page load and after navigation
    const interval = setInterval(handleUserLogin, 2000);
    handleUserLogin(); // Check immediately

    return () => clearInterval(interval);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/info" element={<ProfileInfo />} />
        <Route path="/profile/orders" element={<Orders />} />
        <Route path="/profile/payments" element={<Payments />} />
        <Route path="/profile/wishlist" element={<WishlistPage />} />
        <Route path="/custom-cake" element={<CustomCake />} />
        <Route path='/about' element={<About/>}/>
        <Route path="/contact" element={<Contact />} />
        <Route path='/feedback' element={<Feedback/>}/>
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/address-details" element={<AddressDetails />} />
        <Route path="/address-selection" element={<AddressSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={
          <div style={{ padding: 40, textAlign: "center", minHeight: "60vh" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">← Back to Home</a>
          </div>
        } />

      </Routes>
       <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  )
}