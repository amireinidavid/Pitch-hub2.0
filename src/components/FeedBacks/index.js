"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Startup Founder",
    image: "/testimonial1.jpg",
    content:
      "PitchHub transformed how I present to investors. The AI feedback was game-changing for my startup's success.",
  },
  {
    name: "Michael Chen",
    role: "Sales Director",
    image: "/testimonial2.jpg",
    content:
      "The real-time analysis helped me identify and improve my weak points. My pitch conversion rate increased by 40%.",
  },
  {
    name: "Emma Davis",
    role: "TED Speaker",
    image: "/testimonial3.jpg",
    content:
      "As a professional speaker, I was skeptical at first. But the insights provided were incredibly valuable.",
  },
];

export default function FeedBacks() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F1C] to-zinc-900">
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
            Success Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of professionals who've elevated their pitch game
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
