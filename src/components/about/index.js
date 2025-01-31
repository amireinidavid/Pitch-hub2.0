"use client";
import React from "react";
import { motion } from "framer-motion";

const JoinCommunity = () => {
  return (
    <section className="text-gray-800  dark:text-white py-24 px-8 min-h-screen">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between dark:bg-gray-800 bg-white p-12 rounded-lg shadow-lg w-full">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-4xl font-bold mb-8">
            Join The Pitch Hub community
          </h2>
          <p className="text-lg mb-6">
            Applications for 2024 are now closed, but if you want to stay
            up-to-date on when they re-open, then why not join our community?
          </p>
          <p className="mb-6">
            We love to regularly share educational content for founders, as well
            as exciting event updates and unmissable opportunities from our
            partners.
          </p>
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="firstName"
            >
              What is your first name? *
            </label>
            <input
              className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="firstName"
              type="text"
              placeholder="First name"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              What is your email address? *
            </label>
            <input
              className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="email"
              type="email"
              placeholder="Email address"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6"
          >
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="startupName"
            >
              What is your startup's name? *
            </label>
            <input
              className="w-full px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              id="startupName"
              type="text"
              placeholder="Startup name"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6"
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-600 rounded-full"
                required
              />
              <span className="ml-2 text-gray-700">
                I agree to the privacy policy *
              </span>
            </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center"
          >
            <button
              className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="submit"
            >
              Sign up
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
