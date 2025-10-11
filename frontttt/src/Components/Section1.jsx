import React from "react";

function Section1() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-10 px-6 sm:px-8 lg:px-20 lg:gap-25  py-16 bg-[#fdf1f0] overflow-hidden">
      <div className="relative bg-[#E43F99] rounded-xl w-full sm:w-[48%] h-64 flex items-center justify-start shadow-lg px-6 py-6 lg:w-[500px]  overflow-visible">
        <div className="text-left z-10 w-full sm:w-[60%]">
          <h2 className="text-white text-lg sm:text-xl font-bold mb-2 break-words">
            Food you love,<br />
            delivered to you
          </h2>
          <p className="text-gray-100 text-xs sm:text-sm leading-relaxed mb-4 break-words">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Velit officia consequat duis enim velit mollit.
          </p>
          <button className="bg-white text-[#E43F99] rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
            Order Now
          </button>
        </div>
        <img
          src="src/assets/images/sec1_1.png"
          alt="Box 1"
          className="absolute right-[-35px] sm:right-[-60px] top-1/2 transform -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 object-contain"
        />
      </div>

      <div className="relative bg-[#E43F99] rounded-xl w-full sm:w-[48%] h-64 flex items-center justify-start shadow-lg px-6 py-6 lg:w-[500px] lg:mr-5 overflow-visible">
        <div className="text-left z-10 w-full sm:w-[60%]">
          <h2 className="text-white text-lg sm:text-xl font-bold mb-2 break-words">
            Have you tried our<br />
            delicious new cake?
          </h2>
          <p className="text-gray-100 text-xs sm:text-sm leading-relaxed mb-4 break-words">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Velit officia consequat duis enim velit mollit.
          </p>
          <button className="bg-white text-[#E43F99] rounded-full w-[130px] sm:w-[150px] h-10 cursor-pointer">
            Order Now
          </button>
        </div>
        <img
          src="src/assets/images/sec1_2.png"
          alt="Box 2"
          className="absolute right-[-35px] sm:right-[-60px] top-1/2 transform -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 object-contain"
        />
      </div>
    </div>
  );
}

export default Section1;
