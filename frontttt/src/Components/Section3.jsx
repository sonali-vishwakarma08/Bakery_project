import React from "react";

function Section3() {
  return (
    <div className="bg-[#fdf1f0] py-10 px-6 sm:px-10 lg:px-16 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl text-[#D01A2D] font-bold pb-10">
          We Offer You Different Tastes
        </h2>
      </div>

      <div className="max-w-[1170px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-10">
            <div className="w-full lg:w-auto flex justify-center">
                <div className="bg-[#D01A2D] rounded-xl flex flex-col gap-4 p-5 
                  w-full sm:w-[400px] md:w-[500px] lg:w-[300px] 
                  h-auto lg:h-[320px]">
          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md mt-5">
              <img
                src="src/assets/images/cakke.png"
                className="w-[30px]"
                alt="Birthday Cake"
              />
              <p className="ml-3 font-medium text-black">Birthday Cake</p>
          </div>
          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img
              src="src/assets/images/donut.png"
              className="w-[30px]"
              alt="Donut"
            />
            <p className="ml-3 font-medium text-black">Donut</p>
          </div>
          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img
              src="src/assets/images/chocklate.png"
              className="w-[30px]"
              alt="Chocolate Bar"
            />
            <p className="ml-3 font-medium text-black">Chocolate Bar</p>
          </div>
          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img
              src="src/assets/images/snacks.png"
              className="w-[30px]"
              alt="Snacks"
            />
            <p className="ml-3 font-medium text-black">Snacks</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 flex-1 justify-items-center">
        <div className="relative bg-[#FFD5D5] rounded-xl flex items-center justify-start shadow-lg 
            px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5 w-full max-w-[400px] h-auto sm:h-56 md:h-56 lg:h-60">
            <div className="text-left w-full z-10 pr-16 sm:pr-20 md:pr-24">
              <h2 className="text-black font-bold text-lg sm:text-xl mb-1">
                Birthday Cake
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2">
                Velit officia consequat duis enim velit mollit.
              </p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-black font-semibold">$10.9</p>
              <button className="bg-white text-black rounded-full w-[120px] sm:w-[140px] h-9 cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
            <img
              src="src/assets/images/cakke.png"
              alt="Birthday Cake"
              className="absolute right-[-40px] sm:right-[-50px] top-1/2 transform -translate-y-1/2 w-28 sm:w-36 md:w-40 lg:w-44 object-contain"
            />
        </div>

        <div className="relative bg-[#E53894] rounded-xl flex items-center justify-start shadow-lg 
            px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5 w-full max-w-[400px] h-auto sm:h-56 md:h-56 lg:h-60">
          <div className="text-left w-full z-10 pr-16 sm:pr-20 md:pr-24">
            <h2 className="text-white font-bold text-lg sm:text-xl mb-1">
              Donut
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2">
              Velit officia consequat duis enim velit mollit.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-black font-semibold">$10.9</p>
              <button className="bg-white text-black rounded-full w-[120px] sm:w-[140px] h-9 cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
          <img
            src="src/assets/images/donut.png"
            alt="Donut"
            className="absolute right-[-40px] sm:right-[-50px] top-1/2 transform -translate-y-1/2 w-28 sm:w-36 md:w-40 lg:w-44 object-contain"
          />
        </div>

        <div className="relative bg-[#E53894] rounded-xl flex items-center justify-start shadow-lg 
            px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5 w-full max-w-[400px] h-auto sm:h-56 md:h-56 lg:h-60">
          <div className="text-left w-full z-10 pr-16 sm:pr-20 md:pr-24">
            <h2 className="text-white font-bold text-lg sm:text-xl mb-1">
              Chocolate Bar
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2">
              Velit officia consequat duis enim velit mollit.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-black font-semibold">$10.9</p>
              <button className="bg-white text-black rounded-full w-[120px] sm:w-[140px] h-9 cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
          <img
            src="src/assets/images/chocklate.png"
            alt="Chocolate Bar"
            className="absolute right-[-40px] sm:right-[-50px] top-1/2 transform -translate-y-1/2 w-28 sm:w-36 md:w-40 lg:w-44 object-contain"
          />
        </div>

        <div className="relative bg-[#E53894] rounded-xl flex items-center justify-start shadow-lg 
            px-4 py-3 sm:px-5 sm:py-4 md:px-5 md:py-4 lg:px-6 lg:py-5 w-full max-w-[400px] h-auto sm:h-56 md:h-56 lg:h-60">
          <div className="text-left w-full z-10 pr-16 sm:pr-20 md:pr-24">
            <h2 className="text-white font-bold text-lg sm:text-xl mb-1">
              Snacks
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-2">
              Velit officia consequat duis enim velit mollit.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-black font-semibold">$10.9</p>
              <button className="bg-white text-black rounded-full w-[120px] sm:w-[140px] h-9 cursor-pointer">
                Add to Cart
              </button>
            </div>
          </div>
          <img
            src="src/assets/images/snacks.png"
            alt="Snacks"
            className="absolute right-[-40px] sm:right-[-50px] top-1/2 transform -translate-y-1/2 w-28 sm:w-36 md:w-40 lg:w-44 object-contain"
          />
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Section3;
