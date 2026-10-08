"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArtStyleShowcase from "@/components/ArtStyleShowcase";

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12 sm:gap-16">
      {/* Hero Section */}
      <section className="min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)] flex flex-col justify-between items-center text-center py-2 sm:py-4 max-w-5xl mx-auto">
        <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-4 md:gap-6">
          <motion.img
            src="/dudu.png"
            alt="Dudu Mascot"
            className="w-14 sm:w-20 md:w-28 drop-shadow-[3px_3px_0px_#000] inline-block -rotate-6"
            animate={{ y: [0, -8, 0], rotate: [-6, -2, -6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mt-1 sm:mt-2">
            Transform Your Favorite Photos Into
            <div className="my-2 sm:my-3">
              <span className="inline-block bg-pastel-yellow border-3 sm:border-4 border-black rounded-xl sm:rounded-2xl shadow-neopop-active sm:shadow-neopop px-3 sm:px-6 py-1.5 sm:py-2.5 my-2 sm:my-3 text-xl sm:text-3xl md:text-4xl lg:text-5xl">
                Vibrant, <span className="whitespace-nowrap">Hand-Drawn</span> Keepsakes 🎨
              </span>
            </div>
          </h1>
          <motion.img
            src="/bubu.png"
            alt="Bubu Mascot"
            className="w-14 sm:w-20 md:w-28 drop-shadow-[3px_3px_0px_#000] inline-block rotate-6"
            animate={{ y: [0, -10, 0], rotate: [6, 2, 6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        <p className="text-xs sm:text-base md:text-lg font-medium text-gray-800 my-2 sm:my-4 max-w-xl mx-auto leading-snug sm:leading-relaxed px-2">
          Upload your cherished memories—anniversaries, couples, pets, or portraits—and receive a 100% hand-drawn digital masterpiece crafted at <span className="font-bold underline decoration-pastel-pink decoration-4">student-friendly, budget-accessible rates</span>.
        </p>

        {/* Floating Sticker Badges */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2.5 my-2 sm:my-3 max-w-2xl mx-auto">
          <span className="border-2 border-black bg-[#FEF08A] font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full rotate-2 shadow-neopop-active text-[11px] sm:text-xs md:text-sm hover:scale-105 transition-transform select-none">
            💖 Student-Friendly & Affordable Rates
          </span>
          <span className="border-2 border-black bg-pastel-blue text-black font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full -rotate-3 shadow-neopop-active text-[11px] sm:text-xs md:text-sm hover:scale-105 transition-transform select-none">
            📸 Reference-to-Art Specialist
          </span>
          <span className="border-2 border-black bg-pastel-yellow text-black font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full rotate-2 shadow-neopop-active text-[11px] sm:text-xs md:text-sm hover:scale-105 transition-transform select-none">
            ⭐ 100% Hand-Drawn (No AI)
          </span>
          <span className="border-2 border-black bg-pastel-pink font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full -rotate-1 shadow-neopop-active text-[11px] sm:text-xs md:text-sm hover:scale-105 transition-transform select-none">
            📐 300 DPI for High Quality Printing
          </span>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/commission"
            className="inline-block bg-[#A7F3D0] border-3 sm:border-4 border-black shadow-neopop hover:shadow-neopop-active hover:translate-y-1 hover:translate-x-1 transition-all text-base sm:text-xl font-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl my-2 sm:my-3"
          >
            ✨ Start Your Custom Commission
          </Link>
        </div>

        {/* Animated Scroll-Down Indicator */}
        <motion.div 
          className="flex flex-col items-center justify-center mt-2 sm:mt-3 mb-1 cursor-pointer select-none"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
        >
          <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider bg-white border-2 border-black px-3 py-1 rounded-full shadow-neopop-active mb-1 hover:bg-pastel-yellow transition-colors">
            Scroll for Artstyles ↓
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 sm:border-3 border-black bg-pastel-yellow rounded-full flex items-center justify-center shadow-neopop font-black text-sm sm:text-base">
            ↓
          </div>
        </motion.div>
      </section>

      {/* Art Style Showcase Section */}
      <ArtStyleShowcase />
    </div>
  );
}
