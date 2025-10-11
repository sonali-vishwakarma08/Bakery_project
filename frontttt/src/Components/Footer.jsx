import React from 'react'
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className='bg-white'>
      <div className='max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-6 sm:px-10 lg:px-16'>
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="/logo.png"
            alt="The Velvet Delights"
            className="h-20 w-auto object-contain mb-3"
          />
          <h1 className='text-[#E53894] font-bold text-2xl'>The Velvet Delights</h1>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:ml-20" >
          <h1 className='text-[#E53894] text-2xl mb-4'>Quick Links</h1>
          <ul className='flex flex-col gap-2 text-gray-700 font-medium'>
            <li>
              <Link to="/" className="text-[#D9526B] hover:text-[#c13f5e] font-medium transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-gray-700 hover:text-[#c13f5e] font-medium transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-[#c13f5e] font-medium transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 hover:text-[#c13f5e] font-medium transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:ml-20">
          <h1 className='text-[#E53894] text-2xl mb-4'>Stay In Touch</h1>
          <ul className='flex flex-col gap-2 text-gray-700 font-medium'>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Whatsapp</li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:ml-20">
          <h1 className='text-[#E53894] text-2xl mb-4'>Shops</h1>
          <ul className='flex flex-col gap-2 text-gray-700 font-medium'>
            <li>Ahmedabad</li>
            <li>Baroda</li>
            <li>Surat</li>
          </ul>
        </div>
      </div>

      <div className='border-t border-gray-300'></div>

      <div className='flex flex-col md:flex-row justify-between items-center py-6 px-6 sm:px-10 lg:px-16 gap-4 lg:ml-10'>
        <p className='text-gray-700 font-medium'>
          &copy; 2025 thevelvetdelights.com
        </p>
        <div className='flex gap-6'>
          <Link to="/privacy" className='text-gray-700 font-medium hover:text-[#c13f5e] lg:ml-30'>Privacy</Link>
          <Link to="/terms" className='text-gray-700 font-medium hover:text-[#c13f5e] lg:mr-40'>Terms</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
