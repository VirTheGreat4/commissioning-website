"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface ArtStyle {
  id: string;
  title: string;
  description: string;
  turnaround: string;
  sampleImage: string;
  tag: string;
  price?: string;
}

const STATIC_ART_STYLES: ArtStyle[] = [
  {
    id: "chibi-cuties",
    title: "Chibi Cuties",
    description:
      "Expressive, adorable, simplified proportions with bold vibrant ink lines.",
    turnaround: "⏱️ Minimum 1-Week Turnaround",
    sampleImage: "https://picsum.photos/seed/chibi_showcase/600/500",
    tag: "💖 Budget-Friendly Starter Style",
  },
  {
    id: "detailed-pop-portraits",
    title: "Detailed Pop Portraits",
    description:
      "High-detail stylized likeness capturing hair textures, outfit folds, and signature pop-art lineart.",
    turnaround: "⏱️ Minimum 1 to 2 Weeks Turnaround",
    sampleImage: "https://picsum.photos/seed/portrait_showcase/600/500",
    tag: "💎 Premium Detail, Accessible Rates",
  },
];

export default function ArtStyleShowcase() {
  const [artStyles, setArtStyles] = useState<ArtStyle[]>(STATIC_ART_STYLES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtStyles = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("art_styles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const mapped: ArtStyle[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            turnaround: item.turnaround,
            sampleImage: item.sample_image_url || item.sampleImage || "https://picsum.photos/seed/default/600/500",
            tag: item.tag,
            price: item.price,
          }));
          setArtStyles(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch art styles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtStyles();
  }, []);

  return (
    <section className="mt-16 w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black inline-block relative">
          <span className="bg-pastel-yellow px-4 py-1.5 border-4 border-black rounded-xl shadow-neopop inline-block rotate-1">
            ✦ Available Artstyles ✦
          </span>
        </h2>
        <p className="text-lg font-bold text-gray-800 mt-4 max-w-xl mx-auto">
          Choose between iconic chibi charm or highly detailed pop portraits, all crafted with love and 100% hand-drawn precision.
        </p>
      </div>

      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {artStyles.map((style) => (
          <motion.div
            key={style.id}
            whileHover={{ scale: 1.01 }}
            className="border-4 border-black shadow-neopop rounded-2xl overflow-hidden bg-white hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Sample Image */}
              <img
                src={style.sampleImage}
                alt={style.title}
                className="h-64 w-full object-cover border-b-4 border-black"
              />

              {/* Card Content */}
              <div className="p-6">
                <div>
                  <span className="border-2 border-black bg-pastel-pink text-xs font-black px-3 py-1 rounded-full uppercase inline-block shadow-sm">
                    {style.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black mt-2 text-black">
                  {style.title}
                </h3>

                <p className="font-medium text-gray-700 mt-1">
                  {style.description}
                </p>

                {style.price && (
                  <div className="mt-4 mb-2 text-xl md:text-2xl font-black text-center text-green-800 bg-[#A7F3D0] border-2 border-black rounded-lg py-1.5 shadow-neopop-active">
                    {style.price}
                  </div>
                )}

                {/* Turnaround Notice */}
                <div className="border-2 border-dashed border-black bg-pastel-yellow p-2 rounded-lg font-black text-xs sm:text-sm text-center text-black">
                  {style.turnaround}
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 pt-0">
              <Link
                href="/commission"
                className="block w-full text-center bg-pastel-blue hover:bg-[#93c5fd] border-4 border-black shadow-neopop hover:shadow-neopop-active hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-lg font-black py-3 px-4 rounded-xl text-black"
              >
                🎨 Commission In This Style ➔
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
