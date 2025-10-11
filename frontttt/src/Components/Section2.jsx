import React from "react";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaBell } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";

function Section2() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 bg-[#fdf1f0]">
      <div className="w-full md:w-1/2 p-3 space-y-6 text-center md:text-left lg:ml-10">
        <h1 className="text-4xl text-[#D9077A] font-bold">
          We Deliver Anywhere
        </h1>
        <p className="text-[#626262] font-semibold leading-relaxed max-w-md mx-auto md:mx-0 text-center md:text-left">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          Velit officia consequat duis enim velit mollit. Exercitation veniam
          consequat nostrud amet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center md:items-start justify-center md:justify-start">
          <button className="relative bg-white text-black rounded-full w-[150px] h-10 bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] hover:opacity-90 transition">
            <span className="block h-full bg-white rounded-full text-center leading-10">
              Contact Us
            </span>
          </button>
          <button className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-black font-medium rounded-full h-10 w-[150px] hover:opacity-90 transition border border-white">
            View Menu
          </button>
        </div>
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center w-full">
          <div className="flex items-center bg-white rounded-full w-full max-w-[250px] h-12 px-4 shadow-md">
            <div className="bg-[#FFD5D5] p-2 rounded-full flex items-center justify-center">
              <PiShoppingCartFill size={24} />
            </div>
            <p className="ml-3 font-medium text-black">Online Order</p>
          </div>
          <div className="flex items-center bg-white rounded-full w-full max-w-[250px] h-12 px-4 shadow-md">
            <div className="bg-[#FFD5D5] p-2 rounded-full flex items-center justify-center">
              <IoMdTime size={24} />
            </div>
            <p className="ml-3 font-medium text-black">24/7 Services</p>
          </div>
          <div className="flex items-center bg-white rounded-full w-full max-w-[252px] h-12 px-4 shadow-md">
            <div className="bg-[#FFD5D5] p-2 rounded-full flex items-center justify-center">
              <FaBell size={24} />
            </div>
            <p className="ml-3 font-medium text-black">Reservation</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
        <img
          src="src/assets/images/sec_cake.png"
          alt="The Velvet Delights"
          className="w-full sm:w-4/5 md:w-[50%] lg:w-[80%] lg:ml-13 h-auto object-contain"
        />
      </div>
    </div>
  );
}
export default Section2;
