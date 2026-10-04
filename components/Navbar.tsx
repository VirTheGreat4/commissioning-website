"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export interface RouteItem {
  name: string;
  path: string;
}

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const routes: RouteItem[] = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Live Queue", path: "/queue" },
    { name: "Admin", path: "/admin" },
  ];

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-20 bg-white border-b-4 border-black z-40 flex justify-between items-center px-6">
        <Link href="/" className="font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
          STUDIO NEO 🎨
        </Link>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="border-4 border-black shadow-neopop bg-yellow-300 p-2 rounded-lg font-bold text-xl active:shadow-neopop-active active:translate-y-1 transition-all cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          ☰
        </button>
      </nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className="absolute top-0 right-0 w-72 h-full bg-[#E0E7FF] border-l-4 border-black p-6 shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="border-4 border-black shadow-neopop bg-yellow-300 p-2 rounded-lg font-bold text-xl active:shadow-neopop-active active:translate-y-1 transition-all cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-6 mt-12">
                {routes.map((route: RouteItem) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-2xl font-black border-2 border-transparent hover:border-black hover:bg-white p-3 rounded-xl transition-all"
                  >
                    {route.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
