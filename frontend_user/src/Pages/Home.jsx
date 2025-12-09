import React from "react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import Section2 from "../Components/Section2";
import Section1 from "../Components/Section1";
import Section3 from "../Components/Section3";
import Section4 from "../Components/Section4";
import Section5 from "../Components/Section5";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-12 px-6 sm:px-8 lg:px-12 py-16 bg-[#fdf1f0] lg:mt-16 overflow-hidden">
        <div className="w-full sm:w-[48%] space-y-6 text-center sm:text-left lg:ml-8">
          <h1 className="text-[#D9077A] text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
            Desert You Love,
            <br />
            delivered to you
          </h1>
          <p className="text-[#F2A007] text-base sm:text-lg md:text-lg leading-relaxed max-w-full md:max-w-md mx-auto sm:mx-0">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat nostrud amet.
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-5 mt-8">
            <button className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white cursor-pointer font-medium py-3 px-8 rounded-full w-[200px] shadow-md hover:shadow-lg transition">
              Explore Menu
            </button>

            <div className="flex items-center gap-2 cursor-pointer border border-white rounded-full w-[200px] px-5 py-2">
              <MdOutlineSlowMotionVideo size={30} className="text-[#D9526B]" />
              <p className="text-gray-800 text-lg font-medium cursor-pointer">
                Watch Video
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-[48%] flex justify-center mt-5 sm:mt-0">
          <img
            src="src/assets/images/cake.png"
            alt="The Velvet Delights"
            className="w-full sm:w-4/5 md:w-[90%] lg:w-full h-auto object-contain"
          />
          <img
            src="src/assets/images/group2.png"
            alt="review"
            className="absolute top-4 left-6 sm:top-2 sm:left-10 md:left-16 w-1/3"
          />
          <img
            src="src/assets/images/group1.png"
            alt="review"
            className="absolute right-6 top-[60%] md:top-[55%] w-1/3 transform -translate-y-1/2"
          />
          <img
            src="src/assets/images/group3.png"
            alt="review"
            className="absolute bottom-4 left-4 sm:bottom-2 sm:left-8 w-1/2 md:w-1/3 lg:w-1/2 lg:top-76 lg:left-2.5"
          />
        </div>
      </div>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </>
  );
}
export default Home;
