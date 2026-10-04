import React from "react";
import Link from "next/link";
import PriceCalculator from "@/components/PriceCalculator";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 mt-10">
      {/* Hero Section (Left Column) */}
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
          Turn Your Ideas Into{" "}
          <span className="bg-yellow-300 px-2 border-2 border-black rounded-lg inline-block rotate-2 shadow-neopop">
            Cartoony
          </span>{" "}
          Masterpieces!
        </h1>

        <p className="text-lg font-medium text-gray-700">
          Get custom, hand-drawn chibi and portrait illustrations tailored to your vision. Fast turnaround, high resolution, and strict attention to detail.
        </p>

        {/* Floating Sticker Badges */}
        <div className="flex flex-wrap gap-4 mt-6">
          <span className="border-2 border-black bg-[#E0E7FF] font-bold px-4 py-2 rounded-full -rotate-3 shadow-neopop-active">
            ⭐ 100% Hand-Drawn
          </span>
          <span className="border-2 border-black bg-pink-200 font-bold px-4 py-2 rounded-full rotate-2 shadow-neopop-active">
            💎 Print-Ready 300 DPI
          </span>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href="/commission"
            className="inline-block mt-8 bg-emerald-300 border-4 border-black shadow-neopop hover:shadow-neopop-active hover:translate-y-1 hover:translate-x-1 transition-all text-2xl font-black px-8 py-4 rounded-xl"
          >
            🎨 Proceed to Commission Form
          </Link>
        </div>
      </div>

      {/* Calculator Widget (Right Column) */}
      <div className="w-full lg:w-[450px]">
        <p className="font-bold mb-4 flex items-center gap-2 text-lg">
          👇 Calculate Your Price Instantly!
        </p>
        <PriceCalculator />
      </div>
    </div>
  );
}
