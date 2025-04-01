"use client";

import { motion } from "framer-motion";
import { Upload, MessagesSquare, Repeat } from "lucide-react"

export function Solution() {
  return(
    <section id="solution" className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight"
      >
        <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Our Solution</span>
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="max-w-3xl text-center"
      >
        <motion.p className="text-xl sm:text-2xl font-medium text-gray-700 mb-12">
          An AI resume coach for everyone.
        </motion.p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.3 },
          },
        }}
        className="grid md:grid-rows-3 gap-12 max-w-4xl w-full"
      >
        {/* Step 1 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="p-8 rounded-lg bg-gradient-to-b from-white to-gray-100 border border-gray-300 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center"
        >
          <Upload className="text-6xl text-blue-600 mb-6" />
          <h3 className="text-2xl font-semibold mb-4">1. Start a chat</h3>
          <p className="text-lg">
            Upload your resume, and paste the job description of your desired role, and our specialized model will analyze it along with your profile attributes to provide specialized feedback.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="p-8 rounded-lg bg-gradient-to-b from-white to-gray-100 border border-gray-300 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center"
        >
          <MessagesSquare className="text-6xl text-blue-600 mb-6" />
          <h3 className="text-2xl font-semibold mb-4">2. Chat</h3>
          <p className="text-lg">
            Ask questions about your feedback, as well as upload an updated resume!
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="p-8 rounded-lg bg-gradient-to-b from-white to-gray-100 border border-gray-300 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center"
        >
          <Repeat className="text-6xl text-blue-600 mb-6" />
          <h3 className="text-2xl font-semibold mb-4">3. Rinse and Repeat!</h3>
          <p className="text-lg">Chat for as long as you'd like, or start a new chat.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}