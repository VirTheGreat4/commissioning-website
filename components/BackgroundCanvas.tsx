"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FFFDF5]">
      {/* Top-Right Cartoon Wave */}
      <svg
        className="absolute -top-12 -right-12 w-80 h-80 md:w-[480px] md:h-[480px] filter drop-shadow-[4px_4px_0px_#000]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150 0 C 220 80, 260 140, 310 180 C 370 230, 440 240, 500 230 L 500 0 Z"
          fill="#FEF08A"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M260 0 C 320 60, 360 100, 420 120 C 460 135, 480 135, 500 130 L 500 0 Z"
          fill="#BAE6FD"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom-Left Cartoon Wave */}
      <svg
        className="absolute -bottom-12 -left-12 w-80 h-80 md:w-[480px] md:h-[480px] filter drop-shadow-[4px_4px_0px_#000]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 350 C 70 340, 140 360, 200 310 C 260 260, 300 200, 350 150 L 0 150 Z"
          fill="#BAE6FD"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M0 500 L 0 280 C 80 290, 150 250, 220 280 C 280 310, 310 390, 380 430 C 420 450, 470 470, 500 480 L 500 500 Z"
          fill="#FEF08A"
          stroke="black"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Comic Doodles */}
      {/* Doodle 1: Top-Left Sparkle */}
      <motion.div
        className="absolute top-20 left-10 md:left-24 bg-pastel-yellow border-2 border-black rounded-full px-3 py-1 font-black text-xl shadow-neopop"
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.div>

      {/* Doodle 2: Top-Right Star */}
      <motion.div
        className="absolute top-32 right-16 md:right-36 bg-pastel-pink border-2 border-black rounded-full px-3 py-1 font-black text-xl shadow-neopop"
        animate={{ y: [0, -10, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        ★
      </motion.div>

      {/* Doodle 3: Mid-Left Sparkle Symbol */}
      <motion.div
        className="absolute top-1/2 left-8 md:left-16 bg-pastel-blue border-2 border-black rounded-full px-3 py-1 font-black text-xl shadow-neopop"
        animate={{ y: [0, -14, 0], rotate: [0, 6, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        ✦
      </motion.div>

      {/* Doodle 4: Mid-Right Wave/Squiggle */}
      <motion.div
        className="absolute top-1/2 right-10 md:right-28 bg-pastel-purple border-2 border-black rounded-full px-3 py-1 font-black text-xl shadow-neopop"
        animate={{ y: [0, -12, 0], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        〰️
      </motion.div>

      {/* Doodle 5: Bottom-Right Sparkle */}
      <motion.div
        className="absolute bottom-40 right-12 md:right-32 bg-pastel-yellow border-2 border-black rounded-full px-3 py-1 font-black text-2xl shadow-neopop"
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        ✦
      </motion.div>

      {/* Doodle 6: Bottom-Left Heart/Star */}
      <motion.div
        className="absolute bottom-28 left-20 md:left-48 bg-pastel-pink border-2 border-black rounded-full px-3 py-1 font-black text-xl shadow-neopop"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        ★
      </motion.div>
    </div>
  );
}
