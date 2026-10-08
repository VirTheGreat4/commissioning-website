"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface Commission {
  id: string;
  client_name: string;
  contact_platform: string;
  contact_handle: string;
  brief: string;
  tier: string;
  status: string;
  created_at?: string;
  user_id?: string;
}

export default function DashboardPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("commissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setCommissions(data as Commission[]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch commissions.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Accepted":
        return "bg-green-200 text-black";
      case "Sketching":
        return "bg-blue-200 text-black";
      case "Coloring":
        return "bg-pink-200 text-black";
      case "Completed":
        return "bg-purple-200 text-black";
      case "Declined":
        return "bg-red-200 text-black";
      case "Pending":
      default:
        return "bg-yellow-200 text-black";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAE5] p-6 flex justify-center items-center">
        <div className="font-black text-xl text-black">Loading Commissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAE5] p-6 text-black">
      <div className="max-w-4xl mx-auto mt-10 space-y-8">
        <h1 className="text-4xl font-black uppercase text-center border-b-4 border-black pb-4 text-black tracking-wide">
          My Commissions
        </h1>

        {error && (
          <div className="border-3 border-black bg-red-200 p-4 rounded-xl font-bold text-red-900 text-center">
            {error}
          </div>
        )}

        {commissions.length === 0 ? (
          <div className="border-4 border-black shadow-neopop rounded-2xl p-8 bg-white text-center space-y-4">
            <p className="font-black text-xl text-black">No commission requests found.</p>
            <p className="font-bold text-gray-700">Submit a new request to track its progress here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {commissions.map((commission) => {
              const isApproved =
                commission.status === "Accepted" || commission.status === "Sketching";

              return (
                <motion.div
                  key={commission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-4 border-black shadow-neopop rounded-2xl p-6 bg-white space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 border-b-2 border-black pb-4">
                    <div>
                      <h2 className="text-2xl font-black uppercase text-black">
                        {commission.client_name}
                      </h2>
                      <p className="font-bold text-sm text-gray-600 uppercase">
                        Tier: {commission.tier}
                      </p>
                      <p className="font-bold text-sm text-gray-600">
                        Platform: {commission.contact_platform} ({commission.contact_handle})
                      </p>
                    </div>
                    <div
                      className={`border-2 border-black rounded-full px-4 py-1 font-black text-sm shadow-sm ${getStatusBadgeColor(
                        commission.status
                      )}`}
                    >
                      {commission.status}
                    </div>
                  </div>

                  {isApproved && (
                    <div className="border-3 border-black bg-[#BBF7D0] p-4 rounded-xl font-black text-black leading-relaxed shadow-neopop-sm">
                      🎉 Request Approved! Please check your {commission.contact_platform} ({commission.contact_handle}) messages. I will contact you there to discuss details and deposit. This website is for tracking only!
                    </div>
                  )}

                  {commission.brief && (
                    <div className="bg-gray-50 border-2 border-black p-4 rounded-xl">
                      <h3 className="font-black text-sm uppercase text-black mb-1">
                        Brief
                      </h3>
                      <p className="font-medium text-gray-800 text-sm whitespace-pre-wrap">
                        {commission.brief}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
