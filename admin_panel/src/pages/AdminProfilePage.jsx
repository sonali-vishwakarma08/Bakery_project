import React, { useState, useEffect } from "react";
import { Edit3, Mail, Phone, Calendar, User, TrendingUp, ShoppingBag, Users, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utils/toast";
import axios from "axios";

export default function AdminProfilePage() {
  const { user, updateUserProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ totalSales: 0, activeCustomers: 0, monthlyGrowth: 0 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/dashboard/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        totalSales: response.data.totalIncome || 0,
        activeCustomers: response.data.totalUsers || 0,
        monthlyGrowth: 12, // You can calculate this from orders
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (imageFile) {
        updateData.profile_image = imageFile;
      }
      
      await updateUserProfile(updateData);
      showSuccess("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || "A";
  const profileImage = imagePreview || (user?.profile_image ? `http://localhost:5000/uploads/users/${user.profile_image}` : null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-lg shadow"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setImagePreview(null);
                setImageFile(null);
                setFormData({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-lg shadow"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* Profile Image */}
        <div className="relative">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={user?.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 text-5xl font-bold">
              {userInitial}
            </div>
          )}
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 shadow-lg">
              <Camera size={16} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          {isEditing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name || "Admin User"}</h2>
              <p className="text-pink-500 font-medium text-sm mb-4 capitalize">{user?.role || "Administrator"}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-pink-400" />
                  <span>{user?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-pink-400" />
                  <span>{user?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-pink-400" />
                  <span>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-pink-400" />
                  <span className="capitalize">Role: {user?.role || "Administrator"}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">₹{stats.totalSales.toLocaleString()}</h3>
          </div>
          <div className="bg-pink-100 text-pink-500 p-3 rounded-full">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{stats.activeCustomers}</h3>
          </div>
          <div className="bg-blue-100 text-blue-500 p-3 rounded-full">
            <Users size={20} />
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Monthly Growth</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">+{stats.monthlyGrowth}%</h3>
          </div>
          <div className="bg-green-100 text-green-500 p-3 rounded-full">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
