export default function Navbar() {
  return (
    <nav className="flex justify-between px-12 py-3 text-sm tracking-wide">
      {/* Left Nav */}
      <ul className="flex space-x-10 font-light">
        <li className="text-pink-500 cursor-pointer">HOME</li>
        <li className="hover:text-pink-500 cursor-pointer">SHOP</li>
        <li className="hover:text-pink-500 cursor-pointer">ABOUT ME</li>
        <li className="hover:text-pink-500 cursor-pointer">CONTACT</li>
      </ul>

      {/* Right Nav */}
      <ul className="flex space-x-10 font-light">
        <li className="hover:text-pink-500 cursor-pointer">INSTAGRAM</li>
        <li className="hover:text-pink-500 cursor-pointer">FACEBOOK</li>
        <li className="hover:text-pink-500 cursor-pointer">YOUTUBE</li>
      </ul>
    </nav>
  );
}
