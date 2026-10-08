"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface CommissionRecord {
  id: string;
  client_name: string;
  email: string;
  brief: string;
  reference_urls: string[];
  status: "Pending" | "Accepted" | "Sketching" | "Coloring" | "Completed";
  created_at: string;
}

export default function AdminDashboard() {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const fetchData = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const [commissionsRes, storeSettingsRes] = await Promise.all([
        supabase.from("commissions").select("*").order("created_at", { ascending: false }),
        supabase.from("store_settings").select("is_open").eq("id", 1).single(),
      ]);

      if (commissionsRes.error) {
        throw commissionsRes.error;
      }

      if (commissionsRes.data) {
        setCommissions(commissionsRes.data as CommissionRecord[]);
      }

      if (storeSettingsRes.data) {
        setIsOpen(storeSettingsRes.data.is_open ?? true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAvailability = async (): Promise<void> => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("store_settings")
        .update({ is_open: nextState })
        .eq("id", 1);

      if (updateError) {
        throw updateError;
      }
    } catch (err: unknown) {
      setIsOpen(!nextState);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update store availability.");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string): Promise<void> => {
    const validStatus = newStatus as CommissionRecord["status"];

    // Optimistic update
    setCommissions((prev: CommissionRecord[]) =>
      prev.map((item) => (item.id === id ? { ...item, status: validStatus } : item))
    );

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("commissions")
        .update({ status: validStatus })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }
    } catch (err: unknown) {
      // Revert on error
      fetchData();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] font-black text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-black">
      <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-center border-b-4 border-black pb-3">
        Admin Dashboard - Commissions
      </h2>

      <div className="flex justify-between items-center border-4 border-black shadow-neopop rounded-xl p-6 mb-8 bg-white">
        <h2 className="text-2xl font-black">Store Status</h2>
        <button onClick={toggleAvailability} className={`border-4 border-black font-black text-xl px-6 py-3 rounded-xl shadow-neopop transition-all ${isOpen ? 'bg-[#A7F3D0]' : 'bg-pastel-pink'}`}>
          {isOpen ? '🟢 OPEN FOR COMMISSIONS' : '🔴 CLOSED'}
        </button>
      </div>

      {error && (
        <div className="mb-6 border-2 border-black bg-red-200 p-4 rounded-lg font-bold text-red-800">
          Error: {error}
        </div>
      )}

      {commissions.length === 0 ? (
        <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
          No commission requests found.
        </div>
      ) : (
        <div className="space-y-6">
          {commissions.map((record: CommissionRecord) => {
            const supabase = createClient();
            return (
              <div
                key={record.id}
                className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-2 border-black pb-3 gap-2">
                  <div>
                    <h3 className="text-xl font-black uppercase">{record.client_name}</h3>
                    <a
                      href={`mailto:${record.email}`}
                      className="text-sm font-bold text-purple-700 underline"
                    >
                      {record.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm uppercase">Status:</span>
                    <select
                      value={record.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleStatusChange(record.id, e.target.value)
                      }
                      className="border-2 border-black rounded p-2 bg-yellow-200 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Sketching">Sketching</option>
                      <option value="Coloring">Coloring</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm uppercase text-gray-600 mb-1">Brief</h4>
                  <p className="bg-gray-50 border-2 border-black p-3 rounded-md font-medium whitespace-pre-wrap">
                    {record.brief}
                  </p>
                </div>

                {record.reference_urls && record.reference_urls.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm uppercase text-gray-600 mb-1">
                      Reference Images
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {record.reference_urls.map((urlPath: string, index: number) => {
                        const { data } = supabase.storage
                          .from("references_private")
                          .getPublicUrl(urlPath);
                        const publicUrl = data.publicUrl;

                        return (
                          <a
                            key={index}
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-black bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded font-bold text-sm shadow-sm inline-block"
                          >
                            View Ref #{index + 1}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
