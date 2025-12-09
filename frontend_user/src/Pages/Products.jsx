import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

const Products = () => {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        const userRef = doc(firestore, "users", user.uid);

        onSnapshot(userRef, (snapshot) => {
          const data = snapshot.data();
          setWishlist(data?.wishlist || []);
          setCart(data?.cart || []);
        });
      }
    });

    return () => unsub();
  }, []);

const handleWishlistToggle = async (item) => {
  if (!currentUser) {
    toast.error("Please login to add wishlist!");
    navigate("/login");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  const alreadyExist = wishlist.some((i) => i.id === item.id);

  try {
    if (alreadyExist) {
      await updateDoc(userRef, { wishlist: arrayRemove(item) });
      setTimeout(() => toast.success("Removed from Wishlist!"), 100);
    } else {
      await updateDoc(userRef, { wishlist: arrayUnion(item) });
      setTimeout(() => toast.success("Added to Wishlist!"), 100);
    }
  } catch (error) {
    toast.error("Something went wrong!");
    console.error(error);
  }
};



  const products = [
    { id: 1, name: "Chocolate Delight", price: "$15", desc: "Rich dark chocolate layered cake.", image: "https://crumbsandcaramel.com/wp-content/uploads/2020/10/WS-Skull-Cake-Hero-Blog.jpg" },
    { id: 2, name: "Strawberry Bliss", price: "$12", desc: "Soft sponge with fresh strawberries.", image: "https://i0.wp.com/www.thelittleblogofvegan.com/wp-content/uploads/2022/07/vegan_strawberry_Cake.jpg?fit=1300%2C1789&ssl=1" },
    { id: 3, name: "Donut Treats", price: "$8", desc: "Sweet glazed mini donuts.", image: "https://www.chocolatecoveredcompany.com/cdn/shop/products/DBDNULT12.jpg?v=1729612725" },
    { id: 4, name: "Snack Box", price: "$10", desc: "Mix of sweet and savory bites.", image: "https://i.pinimg.com/736x/e6/e1/53/e6e153b4ae03df9720d7e089a5ec8a23.jpg" },
    { id: "5", name: "Velvet Chocolate Cake", price: "$10", desc: "Rich dark and red velvet chocolate layered cake.", image: "https://images.pexels.com/photos/12927075/pexels-photo-12927075.jpeg" },
    { id: "6", name: "Strawberry Donut Box", price: "$40", desc: "Strawberry Sweet glazed mini donuts", image: "https://images.pexels.com/photos/7474225/pexels-photo-7474225.jpeg" },
    { id: "7", name: "Chocolate Strawberry Layered Cake", price: "$60", desc: "Rich dark chocolate layered cake.", image: "https://images.pexels.com/photos/18613267/pexels-photo-18613267.jpeg" },
    { id: "8", name: "Cherry Cake", price: "$80", desc: "Dark cherry,chocolate layered cake.", image: "https://images.pexels.com/photos/4959705/pexels-photo-4959705.jpeg" },
  ];

  return (
    <div>
      <Header wishlist={wishlist} cart={cart} />

      <div className="bg-[#fdf1f0] min-h-screen pt-28 pb-12 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto mb-10 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-center text-[#D9526B] font-semibold text-xl mb-3">
            Find Your Favorite Treat
          </h2>
          <input
            type="text"
            placeholder="Search for your favorite treat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D9526B] text-gray-700"
          />
        </div>

        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products
            .filter((item) => {
              const q = search.toLowerCase();
              return (
                item.name.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.price.toLowerCase().includes(q)
              );
            })
            .map((item) => {
              const isInWishlist = wishlist.some((i) => i.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`, { state: item })}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                    />
                    <FaHeart
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(item);
                      }}
                      className={`absolute top-3 right-3 text-xl cursor-pointer transition ${
                        isInWishlist ? "text-[#D9526B]" : "text-white"
                      }`}
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-[#D9526B]">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                    <p className="text-gray-800 font-bold mt-2">{item.price}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
