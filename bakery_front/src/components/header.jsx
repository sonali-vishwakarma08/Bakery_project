import { FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-pink-50">
      <div className="flex justify-between items-center px-12 py-4 mx-1"> 

        {/* Logo / Title */}
        <h1 className="text-2xl font-serif text-gray-800">
          The Velvet Delight
        </h1>

        {/* Right Icons */}
        <div className="flex items-center space-x-9">
          {/* Search */}
          <FaSearch className="text-gray-700 text-lg cursor-pointer hover:text-black" />

          {/* Login */}
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaUser className="text-gray-700 text-lg" />
            <span className="text-sm text-gray-800">Log In</span>
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <FaShoppingBag className="text-gray-800 text-xl" />
            <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
