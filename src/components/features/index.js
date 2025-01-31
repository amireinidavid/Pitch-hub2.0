"use client";
import { motion } from "framer-motion";
import { FiMic, FiTrendingUp, FiAward, FiBarChart2 } from "react-icons/fi";

const features = [
  {
    icon: <FiMic className="w-8 h-8" />,
    title: "AI Speech Analysis",
    description:
      "Get real-time feedback on your pitch delivery, tone, and pace.",
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: "Progress Tracking",
    description: "Monitor your improvement over time with detailed analytics.",
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: "Expert Templates",
    description: "Access proven pitch templates from industry experts.",
  },
  {
    icon: <FiBarChart2 className="w-8 h-8" />,
    title: "Performance Metrics",
    description: "Measure and optimize your pitch effectiveness.",
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-zinc-900 bg-primary">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to deliver perfect pitches every time
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors duration-300"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
