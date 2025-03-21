"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"
import SearchBar from "./SearchBar";
// import { User } from "lucide-react"
import UserIcon from "./UserIcon";

const Navbar: React.FC = () => {
  //This needs to dynamically change because when we go to dashboard this will become the search bar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  
  
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToSolution = () => {
    const element = document.getElementById("solution");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  if(path === "/"){
    return (
      <nav className="fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md py-5 px-4 md:px-8 flex flex-wrap justify-between items-center text-gray-900 z-50 shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={scrollToTop}>
          <motion.img
            src="./image.png"
            alt="logo"
            className="w-10 h-10 md:w-12 md:h-14 opacity-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}  
          />
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-gray-700 "
          style={{ fontFamily: "Arial, sans-serif" }}
          >
            StrongHire
          </div>
        </div>
  
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-gray-900 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-900 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-900"></div>
        </button>
        <ul
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-8 text-lg font-medium mt-4 md:mt-0 pb-4 md:pb-0`}
        >
          <li
            className="hover:text-blue-500 transition-colors duration-200 cursor-pointer text-center"
            onClick={() => {
              scrollToSolution();
              setIsMenuOpen(false);
            }}
          >
            How It Works
          </li>
          <li
            className="hover:text-blue-500 transition-colors duration-200 cursor-pointer text-center"
            onClick={() => {
              navigate("/signup")
              setIsMenuOpen(false);
            }}
          >
            Sign up
          </li>
          <li
            className="hover:text-blue-500 transition-colors duration-200 cursor-pointer text-center"
            onClick={() => {
              navigate("/login")
              setIsMenuOpen(false);
            }}
          >
            Sign in
          </li>
        </ul>
      </nav>
    );
  }
  if(path === "/dashboard"){
    return (
      <nav className="fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md py-5 px-4 md:px-8 flex items-center justify-between text-gray-900 z-50 shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2">
            <motion.img
              src="./image.png"
              alt="logo"
              className="w-10 h-10 md:w-12 md:h-14 opacity-80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              onClick={scrollToTop}
            />
          </div>
  
          <div className="flex-grow flex justify-center">
            <SearchBar onChange={(arg) => console.log(arg)} />
          </div>
          <div className="relative">
            <UserIcon/>
          </div>
        </nav>
    );
  }
  return(
    <nav className="h-[80px] fixed top-0 left-0 w-full bg-white/40 backdrop-blur-md py-5 px-4 md:px-8 flex flex-wrap justify-between items-center text-gray-900 z-50 shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 hover:cursor-pointer" onClick={scrollToTop}>
          <motion.img
            src="./image.png"
            alt="logo"
            className="w-12 h-12 opacity-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}  
          />
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-gray-700 "
          style={{ fontFamily: "Arial, sans-serif" }}
          >
            StrongHire
          </div>
        </div>
    </nav>
  )
};

export default Navbar;
