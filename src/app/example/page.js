// "use client";

// import MembershipCard from "@/components/card";
// import React from "react";
// // import { tiers } from "@/utils";
// const Example = () => {
//   const tiers = [
//     {
//       tier: "Tier 1",
//       description: "Basic Membership",
//       bgColor: "bg-gradient-to-br from-orange-400 to-yellow-500",
//     },
//     {
//       tier: "Tier 2",
//       description: "Pro Membership",
//       bgColor: "bg-gradient-to-br from-blue-300 to-green-600",
//     },
//     {
//       tier: "Tier 3",
//       description: "Elite Membership",
//       bgColor: "bg-gradient-to-br from-blue-300 to-red-500",
//     },
//     {
//       tier: "Tier 4",
//       description: "Pro plusMembership",
//       bgColor: "bg-gradient-to-br from-yellow-300 to-blue-500",
//     },
//   ];

//   return (
//     <div className="sm:flex  w-full place-content-center bg-gradient-to-br  px-4 py-12 text-slate-900 dark:text-white gap-8">
//       {tiers.map((tier, index) => (
//         <MembershipCard key={index} {...tier} />
//       ))}
//     </div>
//   );
// };

// export default Example;

// import { motion } from "framer-motion";

// const SquishyCard = () => {
//   return (
//     <section className="bg-neutral-900 px-4 py-12">
//       <div className="mx-auto w-fit">
//         <Card />
//       </div>
//     </section>
//   );
// };

// const Card = () => {
//   return (
//     <motion.div
//       whileHover="hover"
//       transition={{
//         duration: 1,
//         ease: "backInOut",
//       }}
//       variants={{
//         hover: {
//           scale: 1.05,
//         },
//       }}
//       className="relative h-96 w-80 shrink-0 overflow-hidden rounded-xl bg-indigo-500 p-8"
//     >
//       <div className="relative z-10 text-white">
//         <span className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light text-white">
//           Pro
//         </span>
//         <motion.span
//           initial={{ scale: 0.85 }}
//           variants={{
//             hover: {
//               scale: 1,
//             },
//           }}
//           transition={{
//             duration: 1,
//             ease: "backInOut",
//           }}
//           className="my-2 block origin-top-left font-mono text-6xl font-black leading-[1.2]"
//         >
//           $299/
//           <br />
//           Month
//         </motion.span>
//         <p>
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, rem.
//         </p>
//       </div>
//       <button className="absolute bottom-4 left-4 right-4 z-20 rounded border-2 border-white bg-white py-2 text-center font-mono font-black uppercase text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white">
//         Get it now
//       </button>
//       <Background />
//     </motion.div>
//   );
// };

// const Background = () => {
//   return (
//     <motion.svg
//       width="320"
//       height="384"
//       viewBox="0 0 320 384"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="absolute inset-0 z-0"
//       variants={{
//         hover: {
//           scale: 1.5,
//         },
//       }}
//       transition={{
//         duration: 1,
//         ease: "backInOut",
//       }}
//     >
//       <motion.circle
//         variants={{
//           hover: {
//             scaleY: 0.5,
//             y: -25,
//           },
//         }}
//         transition={{
//           duration: 1,
//           ease: "backInOut",
//           delay: 0.2,
//         }}
//         cx="160.5"
//         cy="114.5"
//         r="101.5"
//         fill="#262626"
//       />
//       <motion.ellipse
//         variants={{
//           hover: {
//             scaleY: 2.25,
//             y: -25,
//           },
//         }}
//         transition={{
//           duration: 1,
//           ease: "backInOut",
//           delay: 0.2,
//         }}
//         cx="160.5"
//         cy="265.5"
//         rx="101.5"
//         ry="43.5"
//         fill="#262626"
//       />
//     </motion.svg>
//   );
// };

// export default SquishyCard;

"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

const MembershipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="relative w-80 h-48 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ rotateY: 180 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className={`absolute w-full h-full transition-transform transform ${
            isFlipped ? "rotateY-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full bg-black rounded-lg flex flex-col items-center justify-center text-center text-white">
            <div className="text-2xl font-bold border-2 border-gold-500 rounded-full px-4 py-2">
              VIP CARD
            </div>
            <div className="mt-2 text-sm">MEMBERS ONLY</div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gold-500 opacity-20"></div>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full bg-black rounded-lg flex flex-col items-center justify-center text-center text-white"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="text-xl font-bold">ERIC SMITH</div>
            <div className="mt-2 text-sm">ericsmith@member.com</div>
            <div className="mt-1 text-sm">+65 2568 2114 25</div>
            <div className="mt-1 text-sm">City, Country</div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gold-500 opacity-20"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MembershipCard;
