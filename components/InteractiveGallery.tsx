"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface PortfolioItem {
  id: string;
  image_url: string;
  category: string;
}

export default function InteractiveGallery() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase.from("portfolio").select("*");

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setItems(data as PortfolioItem[]);
        const uniqueCategories = ["All", ...Array.from(new Set(data.map((item: any) => item.category)))];
        setCategories(uniqueCategories);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch portfolio items.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const filteredItems = useMemo<PortfolioItem[]>(() => {
    if (filter === "All") {
      return items;
    }
    return items.filter((item: PortfolioItem) => item.category === filter);
  }, [items, filter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] font-black text-xl">
        Loading Gallery...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-black">
      <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-center border-b-4 border-black pb-3">
        Commission Portfolio
      </h2>

      {error && (
        <div className="mb-6 border-2 border-black bg-red-200 p-4 rounded-lg font-bold text-red-800">
          Error: {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => setFilter(category)} 
            className={`border-2 border-black font-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${filter === category ? 'bg-pastel-purple shadow-neopop-active translate-y-1' : 'bg-white shadow-neopop hover:bg-pastel-yellow'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {filteredItems.map((item: PortfolioItem) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="break-inside-avoid border-4 border-black shadow-neopop rounded-xl overflow-hidden bg-white mb-6"
            >
              <img
                src={item.image_url}
                alt={item.category}
                loading="lazy"
                className="w-full h-auto block hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
          No portfolio items found in this category.
        </div>
      )}
    </div>
  );
}
