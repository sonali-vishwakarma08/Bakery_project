import React from "react";
import bgImage from "../assets/images/background.png";

function Section4() {
  return (
    <div className="bg-[#fdf1f0] pb-10">
      <div
        className="w-full rounded-xl relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="flex flex-col md:flex-row p-8 md:p-10 gap-6 md:gap-10 h-auto md:h-[500px]">
          <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left px-2 md:px-6 lg:px-20 lg:gap-4">
            <h2 className="text-[#D9077A] text-4xl font-bold whitespace-nowrap">
              Our Food Gallery
            </h2>
            <p className="text-white mt-3 leading-relaxed max-w-md lg:text-xl">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
              sint. Velit officia consequat duis enim velit mollit. Exercitation
              veniam consequat nostrud amet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center md:items-start justify-center md:justify-start">
              <button className="bg-white text-black font-medium rounded-full h-10 w-[150px] cursor-pointer transition">
                Order Now
              </button>
              <button className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-black font-medium rounded-full h-10 w-[150px] hover:opacity-90 transition border border-white">
                Contact Us
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:w-1/2 items-center justify-end gap-3">
            <div className="flex flex-col gap-3">
              <img
                src="/src/assets/images/birthday cake.png"
                alt="Birthday Cake"
                className="w-48 md:w-56 lg:w-55 rounded-lg shadow-lg"
              />
              <img
                src="/src/assets/images/chocolate bar.png"
                alt="Chocolate Bar"
                className="w-48 md:w-56 lg:w-55 rounded-lg shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-3 mt-10">
              <img
                src="/src/assets/images/donutt.png"
                alt="Donut"
                className="w-48 md:w-56 lg:w-55 rounded-lg shadow-lg"
              />
              <img
                src="/src/assets/images/snackss.png"
                alt="Snacks"
                className="w-48 md:w-56 lg:w-55 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 p-4 md:hidden mt-6">
        <div className="flex flex-col gap-3">
          <img
            src="/src/assets/images/birthday cake.png"
            alt="Birthday Cake"
            className="w-40 rounded-lg"
          />
          <img
            src="/src/assets/images/chocolate bar.png"
            alt="Chocolate Bar"
            className="w-40 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <img
            src="/src/assets/images/donutt.png"
            alt="Donut"
            className="w-40 rounded-lg"
          />
          <img
            src="/src/assets/images/snackss.png"
            alt="Snacks"
            className="w-40 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Section4;
