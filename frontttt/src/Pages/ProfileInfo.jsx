import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

export default function ProfileInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    profile_image: null
  });
  const [profileImg, setProfileImg] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: null,
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: ""
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("profile_image", file);

    // Update profile with image
    updateProfileWithImage(formData);

    // Also store in localStorage for immediate preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImg(reader.result);
      localStorage.setItem("profileImg", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Update profile with image
  const updateProfileWithImage = async (formData) => {
    try {
      const response = await userAPI.updateProfile(formData);

      if (response.data && response.data.user) {
        // Update user data
        const joinDateFormatted = response.data.user.createdAt 
          ? new Date(response.data.user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : user.joinDate;

        const updatedData = {
          name: response.data.user.name || user.name,
          email: response.data.user.email || user.email,
          phone: response.data.user.phone || user.phone,
          joinDate: joinDateFormatted,
          profile_image: response.data.user.profile_image || user.profile_image
        };

        setUser(updatedData);
        
        // Update profile image from backend
        if (response.data.user.profile_image) {
          setProfileImg(`http://localhost:5000/uploads/profiles/${response.data.user.profile_image}`);
        }
        
        toast.success("Profile image updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile image!");
    }
  };

  // Formik for profile update
  const formik = useFormik({
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required("Name is required"),
      email: Yup.string().email().required("Email required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
    }),
    onSubmit: async (values) => {
      try {
        // For regular profile updates without image
        const response = await userAPI.updateProfile(values);

        if (response.data && response.data.user) {
          const joinDateFormatted = response.data.user.createdAt 
            ? new Date(response.data.user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : user.joinDate;

          const updatedData = {
            name: response.data.user.name || values.name,
            email: response.data.user.email || values.email,
            phone: response.data.user.phone || values.phone,
            joinDate: joinDateFormatted,
            profile_image: response.data.user.profile_image || user.profile_image
          };
          
          setUser(updatedData);
          
          // Update profile image if it was changed on backend
          if (response.data.user.profile_image) {
            setProfileImg(`http://localhost:5000/uploads/profiles/${response.data.user.profile_image}`);
          }
          
          toast.success("Profile updated successfully!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile!");
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No authentication token found. Please login again.");
          navigate("/login");
          return;
        }
        
        const response = await userAPI.getProfile();

        if (response.data && response.data.user) {
          // Format join date
          const joinDateFormatted = response.data.user.createdAt 
            ? new Date(response.data.user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });

          const data = {
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            phone: response.data.user.phone || '',
            joinDate: joinDateFormatted,
            profile_image: response.data.user.profile_image || null
          };

          setUser(data);
          
          // Set formik initial values
          formik.setValues({
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            phone: response.data.user.phone || '',
          });
          
          // Load addresses
          let savedAddresses = [];
          if (Array.isArray(response.data.user.savedAddresses)) {
            savedAddresses = response.data.user.savedAddresses.map((addr, index) => ({
              ...addr,
              id: addr._id || addr.id || index
            }));
          }
          
          // Add primary address if it exists
          let primaryAddress = [];
          if (response.data.user.address && Object.values(response.data.user.address).some(Boolean)) {
            primaryAddress = [{
              id: 'primary',
              name: 'Primary Address',
              ...response.data.user.address
            }];
          }
          
          setAddresses([...primaryAddress, ...savedAddresses]);
          
          // Load profile image from backend or localStorage
          if (response.data.user.profile_image) {
            // Backend image URL
            setProfileImg(`http://localhost:5000/uploads/profiles/${response.data.user.profile_image}`);
          } else {
            // Fallback to localStorage image
            const savedImg = localStorage.getItem("profileImg");
            if (savedImg) setProfileImg(savedImg);
          }
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (err) {
        console.error("Could not load profile from API: ", err);
        if (err.response && err.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem('token');
          navigate("/login");
        } else {
          toast.error("Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const avatarLetter = (user.name || "U").charAt(0).toUpperCase();

  // Address form handling
  const addressFormik = useFormik({
    initialValues: currentAddress,
    validationSchema: Yup.object({
      name: Yup.string().required("Address name is required"),
      street: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zip: Yup.string().required("ZIP code is required"),
      country: Yup.string().required("Country is required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone is required"),
    }),
    onSubmit: (values) => {
      if (values.id) {
        // Update existing address
        setAddresses(addresses.map(addr => addr.id === values.id ? values : addr));
      } else {
        // Add new address
        setAddresses([...addresses, { ...values, id: Date.now() }]);
      }
      setIsEditingAddress(false);
      setCurrentAddress({
        id: null,
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        phone: ""
      });
      toast.success(values.id ? "Address updated successfully!" : "Address added successfully!");
    },
    enableReinitialize: true,
  });

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success("Address deleted successfully!");
  };

  const handleAddNewAddress = () => {
    setCurrentAddress({
      id: null,
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      phone: ""
    });
    setIsEditingAddress(true);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
              <button
                onClick={() => navigate("/profile")}
                className="text-pink-600 hover:text-pink-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Image and Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg overflow-hidden flex items-center justify-center relative border-4 border-white">
                        {profileImg ? (
                          <img src={profileImg} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white">
                            {avatarLetter}
                          </div>
                        )}
                      </div>
                      <label
                        className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                        title="Upload profile image"
                      >
                        <Camera size={16} className="text-pink-500" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name || "User"}</h2>
                    <p className="text-gray-600 mt-1">Member since {user.joinDate || "Unknown"}</p>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{user.email || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{user.phone || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Form and Addresses */}
              <div className="lg:col-span-2">
                {/* Profile Update Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your email"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            formik.touched.phone && formik.errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input
                          type="text"
                          value={user.joinDate || "Unknown"}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit" 
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow hover:shadow-lg font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => formik.resetForm()}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {/* Saved Addresses */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
                    <button
                      onClick={handleAddNewAddress}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Address
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={addressFormik.handleSubmit} className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={addressFormik.values.name}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., Home, Office"
                          />
                          {addressFormik.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={addressFormik.values.phone}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="10-digit phone number"
                          />
                          {addressFormik.errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.phone}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                          <input
                            type="text"
                            name="street"
                            value={addressFormik.values.street}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.street ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Street address"
                          />
                          {addressFormik.errors.street && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.street}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={addressFormik.values.city}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="City"
                          />
                          {addressFormik.errors.city && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            name="state"
                            value={addressFormik.values.state}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.state ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="State"
                          />
                          {addressFormik.errors.state && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.state}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                          <input
                            type="text"
                            name="zip"
                            value={addressFormik.values.zip}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.zip ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="ZIP code"
                          />
                          {addressFormik.errors.zip && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.zip}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                          <input
                            type="text"
                            name="country"
                            value={addressFormik.values.country}
                            onChange={addressFormik.handleChange}
                            className={`w-full px-3 py-2 border rounded-lg ${
                              addressFormik.errors.country ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Country"
                          />
                          {addressFormik.errors.country && (
                            <p className="text-red-500 text-xs mt-1">{addressFormik.errors.country}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
                        >
                          {currentAddress.id ? "Update Address" : "Add Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : null}

                  {addresses && addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{addr.name}</h4>
                              <p className="text-gray-600">{addr.street}</p>
                              <p className="text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                              <p className="text-gray-600">{addr.country}</p>
                              <p className="text-gray-600 mt-1">📞 {addr.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditAddress(addr)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No saved addresses yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}