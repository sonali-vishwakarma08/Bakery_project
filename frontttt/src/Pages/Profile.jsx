import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { CreditCard, Package, Heart, User } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const profileOptions = [
    {
      title: "Profile Information",
      description: "Manage your personal details and account settings",
      icon: <User className="w-6 h-6" />,
      path: "/profile/info",
      color: "from-pink-500 to-purple-600"
    },
    {
      title: "My Orders",
      description: "Track your orders and view order history",
      icon: <Package className="w-6 h-6" />,
      path: "/profile/orders",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Payment History",
      description: "View your payment transactions and receipts",
      icon: <CreditCard className="w-6 h-6" />,
      path: "/profile/payments",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Wishlist",
      description: "Your saved favorite products",
      icon: <Heart className="w-6 h-6" />,
      path: "/profile/wishlist",
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => navigate(option.path)}
                  className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all bg-white border-gray-100 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center text-white`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-gray-400 group-hover:text-pink-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}