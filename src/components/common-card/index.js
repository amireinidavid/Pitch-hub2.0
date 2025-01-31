"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CommonCard = ({ title, icon, type, pitch, footerContent }) => {
  const ref = useRef(null);

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      <Card className="flex bg-gray-100 dark:bg-gray-800 flex-col gap-6 ml-6 rounded-2xl p-8 transition duration-300 hover:bg-white dark:hover:bg-gray-700 cursor-pointer">
        <CardHeader className="p-0">
          {icon && <div className="mb-4">{icon}</div>}
          {title && (
            <CardTitle className="text-xl max-w-[250px] text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-gray-950 dark:text-gray-50">
              {title}
            </CardTitle>
          )}
          {type && <div className="flex text-balance">{type}</div>}
          {pitch && (
            <CardContent className="mt-3 text-gray-600 dark:text-gray-300">
              {pitch}
            </CardContent>
          )}
        </CardHeader>
        <CardFooter className="p-0">{footerContent}</CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommonCard;
