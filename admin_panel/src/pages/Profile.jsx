import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import AddEditModal from "../Modals/AddEditModal";
import { showError, showSuccess } from "../utils/toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/UserAuth/profile");
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load profile";
        setError(errorMessage);
        showError(errorMessage);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login"); // Fix: Removed the unnecessary parentheses
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle profile update
  const handleUpdateProfile = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const dataToSend = new FormData();
      
      // Process form data - handle nested address fields
      const addressFields = {};
      
      for (const key in formData) {
        if (key === "profile_image" && formData[key] instanceof File) {
          dataToSend.append("profile_image", formData[key]);
        } else if (key.startsWith("address[")) {
          // Extract address field name (e.g., "address[street]" -> "street")
          const fieldName = key.replace("address[", "").replace("]", "");
          if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
            addressFields[fieldName] = formData[key];
            // Also append with bracket notation for express.urlencoded compatibility
            dataToSend.append(key, formData[key]);
          }
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      }

      const response = await API.post("/UserAuth/update-profile", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        showSuccess("Profile updated successfully!");
        setIsEditModalOpen(false);
        // Refresh profile data
        const refreshResponse = await API.get("/UserAuth/profile");
        if (refreshResponse.data && refreshResponse.data.user) {
          setUser(refreshResponse.data.user);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";
      showError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-pink-100">View and manage your account information</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user?.role || 'user'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full ${user?.accountStatus === 'active' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="capitalize">{user?.accountStatus || 'active'}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  {user?.lastLogin && (
                    <p className="text-sm text-gray-500">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {user?.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Address</h3>
                  <div className="space-y-2 text-sm">
                    {user.address.street && <p>{user.address.street}</p>}
                    {user.address.city && <p>{user.address.city}, {user.address.state} {user.address.zip}</p>}
                    {user.address.country && <p>{user.address.country}</p>}
                    {user.address.phone && <p>Phone: {user.address.phone}</p>}
                  </div>
                </div>
              )}

              {user?.savedAddresses && user.savedAddresses.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Saved Addresses</h3>
                  <div className="space-y-3">
                    {user.savedAddresses.map((addr, idx) => (
                      <div key={idx} className="border-l-2 border-pink-300 pl-3">
                        <p className="font-medium">{addr.name || `Address ${idx + 1}`}</p>
                        <p className="text-sm text-gray-600">{addr.street}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                        {addr.isDefault && <span className="text-xs text-pink-600">Default</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {user?.profile_image && (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <img
                    src={user.profile_image.startsWith('http') 
                      ? user.profile_image 
                      : `http://localhost:5000/uploads/users/${user.profile_image}`}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-pink-200"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full text-left p-3 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-sm text-gray-500">Update your personal information</p>
                  </button>
                  
                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full text-left p-3 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password</p>
                  </button>
                </div>
              </div>

              {user?.auth_provider === 'local' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your account is secured with email and password.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AddEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateProfile}
        title="Edit Profile"
        fields={[
          { label: "Full Name", name: "name", type: "text", required: true },
          { label: "Email Address", name: "email", type: "email", required: true },
          { label: "Phone Number", name: "phone", type: "text" },
          { label: "Profile Image", name: "profile_image", type: "file" },
          { label: "Street Address", name: "address[street]", type: "text" },
          { label: "City", name: "address[city]", type: "text" },
          { label: "State", name: "address[state]", type: "text" },
          { label: "ZIP Code", name: "address[zip]", type: "text" },
          { label: "Country", name: "address[country]", type: "text" },
          { label: "Address Phone", name: "address[phone]", type: "text" },
        ]}
        data={user}
        imageFolder="users"
      />
    </div>
  );
}
