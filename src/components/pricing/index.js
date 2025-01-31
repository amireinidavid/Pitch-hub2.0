"use client";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

const plans = [
  {
    name: "Starter",
    price: "Free",
    features: [
      "5 pitch recordings per month",
      "Basic AI analysis",
      "Standard templates",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    popular: true,
    features: [
      "Unlimited pitch recordings",
      "Advanced AI analysis",
      "Premium templates",
      "Priority support",
      "Progress tracking",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Custom AI training",
      "Team management",
      "API access",
      "Dedicated support",
      "Custom integration",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-20 bg-gradient-to-b from-zinc-900 via-[#0A0F1C] to-zinc-900">
      <motion.div
        className="container mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="text-center mb-16"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that best fits your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-2xl relative ${
                plan.popular
                  ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/50"
                  : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50"
              } border`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-sm text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-gray-400">/month</span>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <FiCheck className="text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-full font-semibold ${
                  plan.popular
                    ? "bg-primary text-white"
                    : "bg-zinc-700 text-white hover:bg-zinc-600"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
