function Section3() {
  return (
    <div className="bg-[#fdf1f0] py-10 px-3 sm:px-8 lg:px-12 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl text-[#D01A2D] font-bold">
          We Offer You Different Tastes
        </h2>
      </div>

      <div className="max-w-[1140px]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-[#D01A2D] rounded-xl flex flex-col gap-6 p-4 w-full lg:w-[300px] h-auto lg:h-80 lg:ml-6">
          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md mt-3">
            <img src="src/assets/images/cakke.png" className="w-[30px]" alt="Birthday Cake" />
            <p className="ml-3 font-medium text-black">Birthday Cake</p>
          </div>

          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img src="src/assets/images/donut.png" className="w-[30px]" alt="Donut" />
            <p className="ml-3 font-medium text-black">Donut</p>
          </div>

          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img src="src/assets/images/chocklate.png" className="w-[30px]" alt="Chocolate Bar" />
            <p className="ml-3 font-medium text-black">Chocolate Bar</p>
          </div>

          <div className="flex items-center bg-white rounded-full h-12 px-4 shadow-md">
            <img src="src/assets/images/snacks.png" className="w-[30px]" alt="Snacks" />
            <p className="ml-3 font-medium text-black">Snacks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 flex-1 lg:gap-17">
          <div className="relative bg-[#FFD5D5] rounded-xl h-60 flex items-center justify-start shadow-lg px-4 py-3 lg:w-[380px] lg:ml-15 overflow-visible">
            <div className="text-left w-full z-10 pr-12 sm:pr-14 md:pr-16">
              <h2 className="text-black font-bold text-lg sm:text-xl mb-2">Birthday Cake</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                Velit officia consequat duis enim velit mollit.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-black font-semibold">$10.9</p>
                <button className="bg-white text-black rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
            <img
              src="src/assets/images/cakke.png"
              alt="Birthday Cake"
              className="absolute right-[-45px] sm:right-[-55px] top-1/2 transform -translate-y-1/2 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 object-contain"
            />
          </div>

          <div className="relative bg-[#E53894] rounded-xl h-60 flex items-center justify-start shadow-lg px-4 py-3 lg:w-[380px] lg:ml-15  overflow-visible">
            <div className="text-left w-full z-10 pr-12 sm:pr-14 md:pr-16">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-2">Donut</h2>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4">
                Velit officia consequat duis enim velit mollit.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-black font-semibold">$10.9</p>
                <button className="bg-white text-black rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
            <img
              src="src/assets/images/donut.png"
              alt="Donut"
              className="absolute right-[-45px] sm:right-[-55px] top-1/2 transform -translate-y-1/2 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 object-contain"
            />
          </div>

          <div className="relative bg-[#E53894] rounded-xl h-60 flex items-center justify-start shadow-lg px-4 py-3 lg:w-[380px] lg:ml-15 overflow-visible">
            <div className="text-left w-full z-10 pr-12 sm:pr-14 md:pr-16">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-2">Chocolate Bar</h2>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4">
                Velit officia consequat duis enim velit mollit.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-black font-semibold">$10.9</p>
                <button className="bg-white text-black rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
            <img
              src="src/assets/images/chocklate.png"
              alt="Chocolate Bar"
              className="absolute right-[-45px] sm:right-[-55px] top-1/2 transform -translate-y-1/2 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 object-contain"
            />
          </div>

          <div className="relative bg-[#E53894] rounded-xl h-60 flex items-center justify-start shadow-lg px-4 py-3 lg:w-[380px] lg:ml-15 overflow-visible">
            <div className="text-left w-full z-10 pr-12 sm:pr-14 md:pr-16">
              <h2 className="text-white font-bold text-lg sm:text-xl mb-2">Snacks</h2>
              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4">
                Velit officia consequat duis enim velit mollit.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-black font-semibold">$10.9</p>
                <button className="bg-white text-black rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
            <img
              src="src/assets/images/snacks.png"
              alt="Snacks"
              className="absolute right-[-45px] sm:right-[-55px] top-1/2 transform -translate-y-1/2 w-32 sm:w-40 md:w-44 h-32 sm:h-40 md:h-44 object-contain"
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
export default Section3;
