"use client"

import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  return (
  <section className="relative flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-gray-900 text-center p-6 overflow-hidden">
     {/* <div className="absolute inset-0 z-0 animated-gradient"></div> */}
      <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 mt-30 text-black max-w-3xl mx-auto z-10 tracking-tight"
      >
      
      <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
        <TypeAnimation
          sequence={[
            "CS job hunting sucks.", 
            1000, 
            "Getting interviews is tough.", 
            1000, 
            "We're here to make it easier.", 
            1000, 
          ]}
          wrapper="span"
          speed={50} 
          repeat={Infinity}
        />
      </span>
      {/* to land your next dream job */}
      </motion.h1>

      <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 max-w-3xl mx-auto p-2 sm:p-6 z-10">
      Get tailored resume feedback that matches your experience. Whether you're a {" "}
      <span className="font-semibold text-blue-600">beginner</span>{" "}
      or a{" "}
      <span className="font-semibold text-blue-600">
      technology guru
      </span>
      , our tool will provide you the feedback you need, ensuring you're set up for success.
      </p>

      {/* Call to Action Button */}
      <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      onClick={() => {
      // document
      // .getElementById("solutions")
      // ?.scrollIntoView({ behavior: "smooth" });
      navigate("/signup") // route to signup component
      }}
      className="mt-8 px-10 py-5 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-600/90 hover:shadow-blue-600/30 transition-transformtransform hover:scale-105 transition-all duration-300 ease-in-out z-10"
      >
      <p className="text-white text-lg sm:text-xl font-semibold">
      Sign up for free today
      </p>
      </motion.button>
    </section>
  );
}