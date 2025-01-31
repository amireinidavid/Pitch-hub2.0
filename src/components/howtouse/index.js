"use client";
import { motion } from "framer-motion";
import { FiPlay, FiBarChart, FiAward } from "react-icons/fi";

const steps = [
  {
    icon: <FiPlay className="w-8 h-8" />,
    title: "Record Your Pitch",
    description:
      "Use our platform to record your pitch presentation in a comfortable environment.",
  },
  {
    icon: <FiBarChart className="w-8 h-8" />,
    title: "Get AI Analysis",
    description:
      "Receive instant feedback on your delivery, pacing, and presentation style.",
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: "Improve & Perfect",
    description:
      "Use our suggestions to refine your pitch and track your progress over time.",
  },
];

export default function HowToUse() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-zinc-900">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          className="text-center mb-16"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to perfect your pitch
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 right-0 w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative z-10 p-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-300">
                <div className="text-primary mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg"
          >
            Try It Now
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
