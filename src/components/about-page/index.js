"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-zinc-900">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
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
          {/* Left side - Image */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
            className="relative h-[500px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/assets/hero.jpg" // Add your image
              alt="About Pitch Hub"
              fill
              className="object-cover"
            />
            {/* Floating accent elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
            className="space-y-6"
          >
            <motion.h2
              className="text-4xl font-bold text-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Why Choose Pitch Hub?
            </motion.h2>

            <motion.p
              className="text-gray-300 text-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              At Pitch Hub, we understand that a great pitch can make all the
              difference. Our platform combines cutting-edge AI technology with
              proven presentation techniques to help you deliver impactful
              pitches that leave lasting impressions.
            </motion.p>

            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {[
                "AI-powered real-time feedback",
                "Personalized coaching and tips",
                "Industry-specific templates",
                "Performance analytics and tracking",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  whileHover={{ x: 10 }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-gray-300">{feature}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg mt-8"
            >
              Learn More About Us
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
