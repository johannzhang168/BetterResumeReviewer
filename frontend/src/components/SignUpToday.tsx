"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function SignUpToday() {
  const navigate = useNavigate();
  return(
    <section className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight hover:cursor-pointer transform hover:text-7xl transition-all duration-300 ease-in-out"
        onClick={() => navigate("/signup")}
      >
        <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent" >Sign up today</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="max-w-3xl text-center"
      >
        <motion.p className="text-xl sm:text-2xl font-medium text-gray-700 mb-12">
          Let us help you achieve your next dream role.
        </motion.p>
      </motion.div>
    </section>
  );
}