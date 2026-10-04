"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface PublicQueueRecord {
  id: string;
  client_name: string;
  tier: string;
  status: "Accepted" | "Sketching" | "Coloring";
}

export default function LiveQueue() {
  const [queue, setQueue] = useState<PublicQueueRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("commissions")
        .select("id, client_name, tier, status")
        .in("status", ["Accepted", "Sketching", "Coloring"])
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setQueue(data as PublicQueueRecord[]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch live queue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const maskName = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0];
    }
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastNameInitial}.`;
  };

  const getStatusBadgeColor = (status: PublicQueueRecord["status"]): string => {
    switch (status) {
      case "Accepted":
        default:
          return "bg-gray-200 text-black";
      case "Sketching":
        return "bg-blue-200 text-black";
      case "Coloring":
        return "bg-pink-200 text-black";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] font-black text-xl">
        Loading Queue...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans text-black">
      <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-center border-b-4 border-black pb-3">
        Live Commission Queue
      </h2>

      {error && (
        <div className="mb-6 border-2 border-black bg-red-200 p-4 rounded-lg font-bold text-red-800">
          Error: {error}
        </div>
      )}

      {queue.length === 0 ? (
        <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
          Queue is currently empty! Open for new commissions.
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((record: PublicQueueRecord) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center border-4 border-black shadow-neopop rounded-xl p-4 bg-white"
            >
              <div>
                <h3 className="font-black text-lg uppercase">{maskName(record.client_name)}</h3>
                <span className="text-sm font-bold text-gray-600 uppercase">{record.tier}</span>
              </div>
              <div
                className={`border-2 border-black rounded-full px-4 py-1 font-bold text-sm shadow-sm ${getStatusBadgeColor(
                  record.status
                )}`}
              >
                {record.status}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
