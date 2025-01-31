"use client";

import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="p-8 text-center mb-6 bg-gray-100 dark:bg-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold">Join Us Today!</h2>
        <p className="mt-4 text-xl">
          Pitch your ideas and connect with potential investors.
        </p>
        <button className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200">
          Get Started
        </button>
      </motion.div>
    </section>
  );
};

export default CTA;
