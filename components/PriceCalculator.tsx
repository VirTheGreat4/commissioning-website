"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface CalculatorState {
  tier: "chibi" | "portrait";
  currency: "PHP" | "USD";
  addons: number;
}

export default function PriceCalculator() {
  const [state, setState] = useState<CalculatorState>({
    tier: "chibi",
    currency: "PHP",
    addons: 0,
  });

  const [displayPrice, setDisplayPrice] = useState<number>(1000);

  useEffect(() => {
    const basePHP: number = state.tier === "chibi" ? 1000 : 3000;
    const addonPHP: number = state.addons * 500;
    const totalPHP: number = basePHP + addonPHP;

    if (state.currency === "USD") {
      setDisplayPrice(Math.round(totalPHP / 55));
    } else {
      setDisplayPrice(totalPHP);
    }
  }, [state]);

  const handleTierChange = (tier: "chibi" | "portrait"): void => {
    setState((prev: CalculatorState) => ({ ...prev, tier }));
  };

  const handleCurrencyChange = (currency: "PHP" | "USD"): void => {
    setState((prev: CalculatorState) => ({ ...prev, currency }));
  };

  const handleAddonsChange = (delta: number): void => {
    setState((prev: CalculatorState) => ({
      ...prev,
      addons: Math.max(0, prev.addons + delta),
    }));
  };

  return (
    <div className="border-4 border-black shadow-neopop rounded-xl p-6 bg-[#FEF3C7] max-w-md mx-auto font-sans text-black">
      <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-center border-b-4 border-black pb-2">
        Instant Price Calculator
      </h2>

      {/* Tier Selection */}
      <div className="mb-6">
        <label className="block font-bold mb-2 uppercase text-sm">Select Tier</label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, x: 3, y: 3, boxShadow: "1px 1px 0px 0px #000" }}
            onClick={() => handleTierChange("chibi")}
            className={`border-3 border-black p-3 font-bold uppercase rounded-lg transition-colors ${
              state.tier === "chibi"
                ? "bg-yellow-400 shadow-neopop"
                : "bg-white shadow-neopop"
            }`}
          >
            Chibi (₱1,000)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, x: 3, y: 3, boxShadow: "1px 1px 0px 0px #000" }}
            onClick={() => handleTierChange("portrait")}
            className={`border-3 border-black p-3 font-bold uppercase rounded-lg transition-colors ${
              state.tier === "portrait"
                ? "bg-yellow-400 shadow-neopop"
                : "bg-white shadow-neopop"
            }`}
          >
            Portrait (₱3,000)
          </motion.button>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="mb-6">
        <label className="block font-bold mb-2 uppercase text-sm">Currency</label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, x: 3, y: 3, boxShadow: "1px 1px 0px 0px #000" }}
            onClick={() => handleCurrencyChange("PHP")}
            className={`border-3 border-black p-3 font-bold uppercase rounded-lg transition-colors ${
              state.currency === "PHP"
                ? "bg-pink-400 shadow-neopop"
                : "bg-white shadow-neopop"
            }`}
          >
            PHP (₱)
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, x: 3, y: 3, boxShadow: "1px 1px 0px 0px #000" }}
            onClick={() => handleCurrencyChange("USD")}
            className={`border-3 border-black p-3 font-bold uppercase rounded-lg transition-colors ${
              state.currency === "USD"
                ? "bg-pink-400 shadow-neopop"
                : "bg-white shadow-neopop"
            }`}
          >
            USD ($)
          </motion.button>
        </div>
      </div>

      {/* Addons Counter */}
      <div className="mb-8">
        <label className="block font-bold mb-2 uppercase text-sm">
          Extra Heads / Props (₱500 each)
        </label>
        <div className="flex items-center justify-between border-3 border-black bg-white p-3 rounded-lg shadow-neopop">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, x: 2, y: 2 }}
            onClick={() => handleAddonsChange(-1)}
            className="bg-red-400 border-2 border-black px-4 py-1 font-black rounded shadow-neopop-active"
          >
            -
          </motion.button>
          <span className="font-black text-xl">{state.addons}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, x: 2, y: 2 }}
            onClick={() => handleAddonsChange(1)}
            className="bg-green-400 border-2 border-black px-4 py-1 font-black rounded shadow-neopop-active"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Total Price Display */}
      <div className="border-4 border-black bg-white p-4 rounded-xl shadow-neopop text-center">
        <span className="block text-sm font-bold uppercase text-gray-600">Total Price</span>
        <span className="text-4xl font-black">
          {state.currency === "PHP" ? `₱${displayPrice.toLocaleString()}` : `$${displayPrice.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}
