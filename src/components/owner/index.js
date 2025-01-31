"use client";

import { motion } from "framer-motion";

const Owner = () => {
  return (
    <section className="p-8 bg-gray-300 dark:bg-gray-700">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">About the Owner</h2>
        <p className="text-xl">John Doe - Entrepreneur, Innovator, Visionary</p>
        <p className="mt-4">
          John Doe is the mastermind behind this platform, dedicated to bringing
          innovative ideas to life.
        </p>
      </motion.div>
    </section>
  );
};

export default Owner;
