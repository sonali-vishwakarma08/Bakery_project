// src/Pages/Profile.jsx
import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { Camera } from "lucide-react";
import { userAPI, orderAPI, wishlistAPI, SERVER_BASE_URL } from "../services/api";

/**
 * Soft Pastel Profile Page
 * - Uses Tailwind utility classes
 * - Pastel pink background, soft shadows, rounded-xl cards
 * - Keeps same API calls & logic as original
 *
 * Note: Decorative image uses uploaded file path:
 * /mnt/data/ae289bc1-116f-484a-a745-db1e2c5bf2e4.png
 */

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
  });
  const [activeTab, setActiveTab] = useState("orders");
  const [favorites, setFavorites] = useState([]);

  // Formik for profile update
  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required("Name is required"),
      email: Yup.string().email().required("Email required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await userAPI.updateProfile(values);

        if (response.user) {
          setUser((prev) => ({ ...prev, ...response.user }));
          setIsEditing(false);
          toast.success("Profile updated successfully!");

          localStorage.setItem("user", JSON.stringify(response.user));
          if (profileImg) localStorage.setItem("profileImg", profileImg);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile!");
      }
    },
    enableReinitialize: true,
  });

  // Formik for password change
  const passwordFormik = useFormik({
    initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Required"),
      newPassword: Yup.string().min(6).required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        await userAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        toast.success("Password changed successfully");
        passwordFormik.resetForm();
      } catch (err) {
        console.error(err);
        toast.error("Failed to change password");
      }
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();

        if (response.user) {
          const data = {
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone,
            joinDate: new Date(response.user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          };

          setUser(data);
          const saved = Array.isArray(response.user.savedAddresses) ? response.user.savedAddresses : [];
          const primary = response.user.address && Object.values(response.user.address).some(Boolean) ? [response.user.address] : [];
          setAddresses([...saved, ...primary]);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        const saved = localStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
        console.warn("Could not load profile from API: ", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // load saved image from localStorage
    const savedImg = localStorage.getItem("profileImg");
    if (savedImg) setProfileImg(savedImg);

    // load orders
    const loadOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data || res);
      } catch (err) {
        console.warn("Failed to load orders", err);
        setOrders([]);
      }
    };
    loadOrders();

    const loadWishlist = async () => {
      try {
        const res = await wishlistAPI.get();
        const list = (res.data || res).map((w) => {
          const p = w.product || {};
          return {
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] ? `${SERVER_BASE_URL}/uploads/products/${p.images[0]}` : null,
          };
        });
        setFavorites(list);
      } catch (err) {
        const data = JSON.parse(localStorage.getItem("the-velvet-delights")) || { wishlist: {}, cart: {} };
        setFavorites(Object.values(data.wishlist || {}));
      }
    };
    loadWishlist();
  }, []);

  // handle image upload (base64 -> preview & stored in localStorage on success)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  };

  const avatarLetter = (user.name || "U").charAt(0).toUpperCase();

  return (
    <>
      <Header />
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-24 pb-16 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Decorative top card */}
          {/* <div className="rounded-2xl overflow-hidden shadow-sm mb-6">
            <img
              src="/mnt/data/ae289bc1-116f-484a-a745-db1e2c5bf2e4.png"
              alt="account decorative"
              className="w-full h-40 object-cover"
            />
          </div> */}

          <div className="bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-24">
                <div className="animate-spin border-t-4 border-pink-300 rounded-full w-12 h-12"></div>
              </div>
            ) : (
              <>
                {/* LEFT SIDEBAR */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-pink-300 shadow-lg overflow-hidden flex items-center justify-center relative border-4 border-white">
                    {profileImg ? (
                      <img src={profileImg} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white">
                        {avatarLetter}
                      </div>
                    )}

                    <label
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-sm border"
                      title="Upload profile image"
                    >
                      <Camera size={14} className="text-pink-500" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h2>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>

                  <div className="mt-6 w-full space-y-2">
                    {/* Sidebar buttons */}
                    <SidebarButton label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
                    <SidebarButton label="Favorites" active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")} />
                    <SidebarButton label="Personal data" active={activeTab === "personal"} onClick={() => setActiveTab("personal")} />
                    <SidebarButton label="Change password" active={activeTab === "password"} onClick={() => setActiveTab("password")} />
                    <SidebarButton label="Addresses" active={activeTab === "addresses"} onClick={() => setActiveTab("addresses")} />
                    <button
                      onClick={() => {
                        // simple sign out, adapt to your auth flow
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-pink-600 hover:bg-pink-50 transition"
                    >
                      Sign out
                    </button>
                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="md:col-span-3">
                  {/* Orders */}
                  {activeTab === "orders" && (
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h3>
                      {orders.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-pink-100 bg-pink-50 p-8 text-center text-pink-600">
                          You have no orders yet. Start ordering your bakery favorites! 🧁
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <article key={order._id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex -space-x-3">
                                  {order.items?.slice(0, 3).map((it, idx) => {
                                    const img = it.product?.images?.[0]
                                      ? `${SERVER_BASE_URL}/uploads/products/${it.product.images[0]}`
                                      : null;
                                    return img ? (
                                      <img key={idx} src={img} alt={it.product?.name} className="w-12 h-12 rounded-lg object-cover border" />
                                    ) : (
                                      <div key={idx} className="w-12 h-12 rounded-lg bg-gray-100 border" />
                                    );
                                  })}
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                  <div>
                                    <p className="text-xs text-gray-400">Order number</p>
                                    <p className="font-medium text-gray-800">#{order._id.slice(-8)}</p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-400">Order date</p>
                                    <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-400">Total</p>
                                    <p className="font-medium text-gray-800">₹{order.total_amount}</p>
                                  </div>

                                  <div className="flex items-center justify-end">
                                    <div className="text-right">
                                      <p className={`text-sm font-semibold ${order.status === "Delivered" ? "text-green-600" : "text-pink-600"}`}>
                                        {order.status}
                                      </p>
                                      <div className="mt-2">
                                        <button
                                          className="px-4 py-2 border rounded-md text-sm bg-pink-50 text-pink-600 hover:bg-pink-100"
                                          onClick={() => (window.location.href = `/orders/${order._id}`)}
                                        >
                                          View order
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Optional order items preview */}
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                                {order.items?.map((it, idx) => {
                                  const img = it.product?.images?.[0]
                                    ? `${SERVER_BASE_URL}/uploads/products/${it.product.images[0]}`
                                    : null;
                                  return (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border bg-pink-50/30">
                                      {img ? (
                                        <img src={img} alt={it.product?.name} className="w-14 h-14 rounded object-cover" />
                                      ) : (
                                        <div className="w-14 h-14 rounded bg-gray-100" />
                                      )}
                                      <div>
                                        <p className="font-medium text-sm">{it.product?.name}</p>
                                        <p className="text-xs text-gray-500">Qty {it.quantity} • ₹{it.price}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Favorites */}
                  {activeTab === "favorites" && (
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Favorites</h3>
                      {favorites.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-pink-100 bg-pink-50 p-8 text-center text-pink-600">
                          No favorites yet. Save tasty items to find them later! 🧁
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {favorites.map((item) => (
                            <div key={item.id || item._id} className="rounded-xl border p-3 bg-white shadow-sm hover:shadow-md transition">
                              <img src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-md" />
                              <p className="mt-3 font-medium text-sm">{item.name}</p>
                              <p className="text-pink-600 font-semibold mt-1">{item.price}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Personal data */}
                  {activeTab === "personal" && (
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Personal data</h3>

                      {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoCard label="Full Name" value={user.name} />
                          <InfoCard label="Email" value={user.email} />
                          <InfoCard label="Phone" value={user.phone} />
                          <div className="md:col-span-2 flex gap-3">
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow">
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                // quick copy email
                                navigator.clipboard?.writeText(user.email || "");
                                toast.info("Email copied to clipboard");
                              }}
                              className="px-6 py-2 rounded-full border text-pink-600"
                            >
                              Copy Email
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-xl">
                          {["name", "email", "phone"].map((f) => (
                            <div key={f}>
                              <label className="text-sm text-gray-600 uppercase tracking-wide">{f}</label>
                              <input
                                type={f === "email" ? "email" : f === "phone" ? "tel" : "text"}
                                name={f}
                                value={formik.values[f]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                placeholder={f}
                              />
                              {formik.touched[f] && formik.errors[f] && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors[f]}</p>
                              )}
                            </div>
                          ))}

                          <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow">
                              Save changes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                formik.resetForm();
                              }}
                              className="px-6 py-2 rounded-full border"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </section>
                  )}

                  {/* Change password */}
                  {activeTab === "password" && (
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Change password</h3>

                      <form onSubmit={passwordFormik.handleSubmit} className="max-w-md space-y-4">
                        <div>
                          <label className="text-sm text-gray-600">Current password</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordFormik.values.currentPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className="w-full px-4 py-3 border rounded-lg mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600">New password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordFormik.values.newPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className="w-full px-4 py-3 border rounded-lg mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600">Confirm new password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordFormik.values.confirmPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            className="w-full px-4 py-3 border rounded-lg mt-1"
                          />
                        </div>

                        <div>
                          <button type="submit" className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow">
                            Change password
                          </button>
                        </div>
                      </form>
                    </section>
                  )}

                  {/* Addresses */}
                  {activeTab === "addresses" && (
                    <section>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Addresses</h3>

                      {addresses.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-pink-100 bg-pink-50 p-8 text-center text-pink-600">
                          No saved addresses yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.map((addr, i) => (
                            <div key={i} className="rounded-xl border p-4 bg-white shadow-sm flex justify-between items-start">
                              <div>
                                <p className="font-semibold">{addr.name || "Address"}</p>
                                <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-sm text-gray-600">{addr.country}</p>
                                {addr.landmark && <p className="text-sm text-gray-600">Landmark: {addr.landmark}</p>}
                              </div>

                              <div className="flex flex-col gap-2">
                                <button className="px-3 py-1 text-sm border rounded text-pink-600">Edit</button>
                                <button className="px-3 py-1 text-sm border rounded">Set primary</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ---------- Helper components ---------- */

function SidebarButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
        active ? "bg-pink-50 border border-pink-100 text-pink-700 font-medium" : "hover:bg-gray-50"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value || "-"}</p>
    </div>
  );
}
