"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFAE5] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full mx-auto border-4 border-black shadow-neopop rounded-xl p-8 bg-[#E0E7FF]"
      >
        <h1 className="text-3xl font-black mb-6 text-center text-black">
          Artist Login 🔒
        </h1>

        {error && (
          <div className="bg-red-200 border-2 border-black p-3 rounded mb-4 font-bold text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block font-bold mb-2 text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-black p-3 rounded mb-4 w-full focus:ring-2 focus:ring-pastel-pink bg-white text-black font-medium"
              placeholder="artist@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-2 text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-black p-3 rounded mb-4 w-full focus:ring-2 focus:ring-pastel-pink bg-white text-black font-medium"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="bg-pastel-yellow border-4 border-black shadow-neopop px-6 py-3 font-bold w-full active:translate-y-1 active:shadow-neopop-active bg-[#FEF08A] text-black cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
