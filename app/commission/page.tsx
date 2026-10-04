import React from "react";
import CommissionForm from "@/components/CommissionForm";

export default function CommissionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 border-b-4 border-black inline-block pb-2">
        Request a Commission 📝
      </h1>
      <p className="text-lg font-medium mb-8">
        Fill out the details below. I will review your request and send an invoice within 24 hours.
      </p>
      <CommissionForm />
    </div>
  );
}
