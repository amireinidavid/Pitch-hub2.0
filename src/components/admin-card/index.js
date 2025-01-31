"use client";

import { motion } from "framer-motion";

const AdminCard = ({ title, description, icon, image }) => {
  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center transform hover:scale-105 hover:rotate-2 transition-transform"
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
    >
      {image && (
        <motion.img
          src={image}
          alt={`${title}`}
          className="rounded-full w-40 h-40 object-cover mb-4 shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      {title && <h3 className="text-2xl font-bold text-center">{title}</h3>}
      {description && <p className="mt-4 text-center">{description}</p>}
    </motion.div>
  );
};

export default AdminCard;
