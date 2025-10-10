import React from "react";
import { Edit3, Mail, Phone, Calendar, User, TrendingUp, ShoppingBag, Users } from "lucide-react";

export default function AdminProfilePage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-lg shadow">
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 text-5xl font-bold">
          A
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">Alex Morgan</h2>
          <p className="text-pink-500 font-medium text-sm mb-4">Bakery Admin</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-pink-400" />
              <span>alex.morgan@bakeryhub.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-pink-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-pink-400" />
              <span>Joined: Jan 10, 2023</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-pink-400" />
              <span>Role: Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">₹1,25,000</h3>
          </div>
          <div className="bg-pink-100 text-pink-500 p-3 rounded-full">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Active Customers</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">340</h3>
          </div>
          <div className="bg-blue-100 text-blue-500 p-3 rounded-full">
            <Users size={20} />
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Monthly Growth</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">+12%</h3>
          </div>
          <div className="bg-green-100 text-green-500 p-3 rounded-full">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
