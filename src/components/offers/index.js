"use client";
import { motion } from "framer-motion";

const offers = [
  {
    title: "Access to Foriegn Investors and Business Partners",
    description:
      "Here at Pitch Hub we connect you to foreign investors and business partners. We also provide opportunities for startups to pitch their ideas to potential investors and secure funding. This can be crucial for getting the financial support needed to grow a business.",
  },
  {
    title: "Networking Opportunities with Industry Experts",
    description:
      "Pitch huboften host events, webinars, and workshops where puitcher can network with industry experts and professionals. For example, Nigeria Pitch Week offers a platform for entrepreneurs to present their business ideas to a panel of judges and industry leaders. This can lead to valuable connections, mentorship, and collaborations.",
  },
  {
    title: "Government and Private Sector Grants",
    description:
      " Many government and private sector offer grants to entrepreneurs who present compelling business ideas. These grants can provide crucial funding without the need for repayment, enabling startups to scale their operations and innovate within their industries. Securing a grant can also lend credibility to a business, making it more attractive to future investors.",
  },
];

const Offers = () => {
  return (
    <section className="justify-between p-16  py-24 align-middle px-32 min-h-screen flex flex-col items-center">
      <h2 className="text-6xl font-bold text-center">Our Offers</h2>
      <div className="flex flex-wrap justify-center gap-12">
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-700 p-12 rounded-lg shadow-xl w-96 h-92 flex flex-col justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-2xl font-bold object-contain">{offer.title}</h3>
            <p className="mt-4 text-lg">{offer.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Offers;
