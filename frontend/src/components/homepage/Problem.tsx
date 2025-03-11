"use client";

import { motion } from "framer-motion";
import {FileText, Code, UserCheck, School } from "lucide-react"

export function Problem() {
  return (
    <section
      id="problem"
      className="min-h-screen flex flex-col items-center justify-center py-10 px-6"
    >
      {/* Problem Header */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight"
      >
        <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">The Problem</span>
      </motion.h2>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="max-w-3xl text-center"
      >
        <motion.p className="text-xl sm:text-2xl font-medium text-gray-700 mb-12">
          There are no easily accessible ways to get helpful feedback on resumes.
        </motion.p>

        {/* Key Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-left space-y-6"
        >
          <div className="flex items-start space-x-3 tracking-wide">
            <FileText className="text-blue-600 text-2xl" />
            <p className="text-lg text-gray-800">
              ATS tools make your resume look inauthentic and won't get you past a recruiter screen
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Code className="text-blue-600 text-2xl" />
            <p className="text-lg text-gray-800">Most college students struggle with finding experience, not formatting experience on their resume</p>
          </div>
          <div className="flex items-start space-x-3">
            <UserCheck className="text-blue-600 text-2xl" />
            <p className="text-lg text-gray-800">
              Career coaches with proven track records are expensive and rare
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <School className="text-blue-600 text-2xl" />
            <p className="text-lg text-gray-800">Many university career centers are known to be extremely unreliable in offering individual and even career-specific guidance. </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Optional Call to Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <a
          href="#solution"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("solution")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-block bg-blue-600 py-4 px-10 rounded-lg shadow-lg hover:bg-blue-600/90 hover:shadow-blue-600/30 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <p className="text-white text-lg font-semibold">
            See How We Solve This
          </p>
        </a>
      </motion.div>

    
    </section>
  )

}