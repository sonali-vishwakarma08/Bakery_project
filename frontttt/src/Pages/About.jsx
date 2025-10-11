import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import aboutImage from "../assets/images/about_hero.jpg"; 

function About() {
  return (
    <>
      <Header />
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between bg-[#fdf1f0] px-6 sm:px-10 lg:px-20 py-20 lg:py-32 gap-12">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#D9077A]">
            About <br /> The Velvet Delights
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed max-w-xl">
            At The Velvet Delights, we craft every bite with love and passion.
            From heavenly cakes to delightful snacks, our mission is to make
            every moment sweeter and memorable.
          </p>
          <button className="bg-gradient-to-r from-[#D9526B] to-[#F2BBB6] text-white font-medium py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition">
            Explore Our Story
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={aboutImage}
            alt="About Us"
            className="w-full sm:w-4/5 md:w-3/4 object-contain 
            lg:w-[500px] lg:h-[450px] rounded-xl shadow-xl"
          />
        </div>
      </div>

      <div className="bg-[#FAF9EE] py-20 px-6 sm:px-10 lg:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl text-[#D01A2D] font-bold">
            Our Mission & Vision
          </h2>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            We believe in creating delightful experiences with the perfect blend of
            taste, quality, and care. Every product is handmade with attention
            to detail and a sprinkle of joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition">
            <h3 className="text-[#D9526B] text-xl font-bold mb-2">Quality Ingredients</h3>
            <p className="text-gray-700">Only the finest ingredients go into our products, ensuring freshness and taste.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition">
            <h3 className="text-[#D9526B] text-xl font-bold mb-2">Creative Recipes</h3>
            <p className="text-gray-700">Innovative flavors and unique creations that delight every palate.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition">
            <h3 className="text-[#D9526B] text-xl font-bold mb-2">Customer Happiness</h3>
            <p className="text-gray-700">Our ultimate goal is to bring smiles and unforgettable moments to our customers.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#fdf1f0] py-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl text-[#D9077A] font-bold">Our Story</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Founded in 2020, The Velvet Delights started with a dream to create
              sweets and treats that not only taste amazing but also create memories.
              Our journey has been filled with passion, creativity, and love for
              desserts. Today, we are proud to serve our customers with joy in every bite.
            </p>
          </div>
          <div className="lg:w-1/2 flex flex-wrap justify-center gap-6">
            <img
              src="/src/assets/images/user1.png"
              alt="Team member"
              className="w-40 rounded-xl shadow-lg"
            />
            <img
              src="/src/assets/images/user2.png"
              alt="Team member"
              className="w-40 rounded-xl shadow-lg"
            />
            <img
              src="/src/assets/images/user3.png"
              alt="Team member"
              className="w-40 rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#D9526B] py-16 px-6 sm:px-10 lg:px-20 text-center rounded-t-3xl">
        <h2 className="text-3xl sm:text-4xl text-white font-bold mb-4">
          Ready to Taste Happiness?
        </h2>
        <p className="text-white mb-6 max-w-xl mx-auto">
          Explore our menu and discover delightful treats crafted just for you!
        </p>
        <button className="bg-white text-[#D9526B] font-medium py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition">
          Explore Menu
        </button>
      </div>
      <Footer />
    </>
  );
}

export default About;
