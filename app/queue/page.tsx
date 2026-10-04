import React from "react";
import LiveQueue from "@/components/LiveQueue";

export default function QueuePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 border-b-4 border-black inline-block pb-2">
        Live Queue 📋
      </h1>
      <p className="text-lg font-medium mb-8">
        Track the status of your commission here. Updates are real-time!
      </p>
      <LiveQueue />
    </div>
  );
}
