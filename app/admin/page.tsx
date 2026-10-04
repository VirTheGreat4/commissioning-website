import React from "react";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 border-b-4 border-black inline-block pb-2">
        Command Center 🛠️
      </h1>
      <p className="text-lg font-bold text-red-600 mb-8 bg-red-100 p-2 border-2 border-red-600 rounded inline-block">
        Restricted Access. Artist Only.
      </p>
      <AdminDashboard />
    </div>
  );
}
