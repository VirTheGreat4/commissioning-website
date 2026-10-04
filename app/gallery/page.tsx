import React from "react";
import InteractiveGallery from "@/components/InteractiveGallery";

export default function GalleryPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 border-b-4 border-black inline-block pb-2">
        Art Gallery 🖼️
      </h1>
      <p className="text-lg font-medium mb-8">
        Take a look at my previous commissions and personal projects!
      </p>
      <InteractiveGallery />
    </div>
  );
}
