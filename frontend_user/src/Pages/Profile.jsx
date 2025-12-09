import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle, FaPhoneAlt, FaCity } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please Login First!");
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data());
      } else {
        toast.error("User Data Not Found!");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: user.name,
        phone: user.phone,
        city: user.city,
      });

      toast.success("Profile Updated Successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const renderField = (label, value, fieldKey, Icon) => (
    <div className="flex items-center bg-[#FFF7F6] border border-[#F8C9D0] px-4 py-3 rounded-xl shadow-sm">
      <Icon className="text-[#D9077A] text-xl mr-3" />
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setUser({ ...user, [fieldKey]: e.target.value })}
          className="bg-transparent border-b border-[#D9077A] text-gray-700 w-full focus:outline-none focus:border-[#D9077A]"
        />
      ) : (
        <p className="text-gray-700 font-medium w-full">
          {value || "Not Added"}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="bg-[#fdf1f0] min-h-screen flex justify-center py-24 px-4">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-[#D9077A] w-24 h-24 mb-3 shadow-lg rounded-full bg-[#ffe4ec] p-1" />

            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
                className="text-center border-b border-[#D9077A] text-[#D9077A] font-bold text-xl focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold text-[#D9077A]">
                {user.name}
              </h2>
            )}

            <p className="text-gray-600 flex items-center gap-1 text-sm mt-1">
              <MdEmail className="text-[#D9077A]" />
              {user.email}
            </p>
          </div>

          <div className="space-y-4">
            {renderField("Phone", user.phone, "phone", FaPhoneAlt)}
            {renderField("City", user.city, "city", FaCity)}
          </div>

          <div className="mt-8 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-2 border-[#D9526B] text-[#D9526B] py-3 rounded-full hover:bg-[#ffe4e0]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white py-3 rounded-full font-medium hover:opacity-90 cursor-pointer outline-none"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/myorders")}
                  className="flex-1 border-2 border-[#D9526B] text-[#D9526B] py-3 rounded-full hover:bg-[#ffe4e0] cursor-pointer outline-none"
                >
                  My Orders
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
