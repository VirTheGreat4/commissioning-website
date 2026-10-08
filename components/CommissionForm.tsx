"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface FormState {
  clientName: string;
  contactPlatform: string;
  contactHandle: string;
  artStyle: "Chibi Cuties" | "Detailed Pop Portraits";
  brief: string;
  depositAgreed: boolean;
  honeypot: string;
}

export interface ImagePreview {
  file: File;
  previewUrl: string;
}

export default function CommissionForm() {
  const [formData, setFormData] = useState<FormState>({
    clientName: "",
    contactPlatform: "Discord",
    contactHandle: "",
    artStyle: "Chibi Cuties",
    brief: "",
    depositAgreed: false,
    honeypot: "",
  });

  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "bot_detected"
  >("idle");

  const previewsRef = useRef<ImagePreview[]>(previews);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => {
        URL.revokeObjectURL(preview.previewUrl);
      });
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = 1 - previews.length;
    if (availableSlots <= 0) return;

    const filesToAdd = selectedFiles.slice(0, availableSlots);
    const newPreviews: ImagePreview[] = filesToAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number): void => {
    URL.revokeObjectURL(previews[index].previewUrl);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (formData.honeypot !== "") {
      setSubmitStatus("bot_detected");
      return;
    }

    if (!formData.depositAgreed) {
      alert(
        "I agree to the Terms & Conditions. I understand my account data may be purged after 3 weeks to maintain database health, and if approved, all communication will continue on my preferred social platform."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const reference_urls: string[] = [];

      for (const preview of previews) {
        const filePath = `${Date.now()}_${preview.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("references_private")
          .upload(filePath, preview.file);

        if (uploadError) {
          throw uploadError;
        }
        reference_urls.push(filePath);
      }

      const { error: insertError } = await supabase.from("commissions").insert({
        user_id: user?.id,
        client_name: formData.clientName,
        contact_platform: formData.contactPlatform,
        contact_handle: formData.contactHandle,
        brief: formData.brief,
        tier: formData.artStyle,
        reference_urls: reference_urls,
        status: "Pending",
      });

      if (insertError) {
        throw insertError;
      }

      setSubmitStatus("success");
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="border-4 border-black shadow-neopop rounded-2xl p-8 bg-white max-w-2xl mx-auto text-center space-y-6 relative">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="inline-block bg-pastel-yellow border-4 border-black shadow-neopop rounded-full p-4 text-4xl"
        >
          🎉
        </motion.div>
        <p className="text-xl font-black text-black leading-snug">
          🎉 Request Received! Track your request status in your Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="border-4 border-black shadow-neopop rounded-2xl p-8 bg-white max-w-2xl mx-auto space-y-6 relative">
      <input
        type="text"
        name="b_trap"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0"
        tabIndex={-1}
        autoComplete="off"
      />

      <h2 className="text-3xl font-black uppercase text-center border-b-4 border-black pb-4 text-black tracking-wide">
        Commission Request
      </h2>

      {submitStatus === "bot_detected" && (
        <div className="border-3 border-black bg-red-200 p-4 rounded-xl font-bold text-red-900 text-center">
          Bot activity detected. Submission ignored.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="border-3 border-black bg-red-200 p-4 rounded-xl font-bold text-red-900 text-center">
          An error occurred while submitting your request. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Art Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["Chibi Cuties", "Detailed Pop Portraits"] as const).map(
              (style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, artStyle: style })
                  }
                  className={`p-4 rounded-xl font-black text-lg text-center cursor-pointer transition-all ${
                    formData.artStyle === style
                      ? "bg-pastel-yellow border-4 border-black shadow-neopop-active translate-y-1"
                      : "bg-white border-2 border-black"
                  }`}
                >
                  {style}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
            className="border-3 border-black p-3 rounded-xl focus:ring-4 focus:ring-pastel-purple focus:outline-none w-full font-bold"
            placeholder="Your Full Name"
          />
        </div>

        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Preferred Contact Platform
          </label>
          <select
            name="contactPlatform"
            value={formData.contactPlatform}
            onChange={(e) =>
              setFormData({ ...formData, contactPlatform: e.target.value })
            }
            required
            className="border-3 border-black p-3 rounded-xl focus:ring-4 focus:ring-pastel-purple focus:outline-none w-full font-bold bg-white text-black cursor-pointer"
          >
            <option value="Discord">Discord</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Contact Handle
          </label>
          <input
            type="text"
            name="contactHandle"
            value={formData.contactHandle}
            onChange={(e) =>
              setFormData({ ...formData, contactHandle: e.target.value })
            }
            required
            className="border-3 border-black p-3 rounded-xl focus:ring-4 focus:ring-pastel-purple focus:outline-none w-full font-bold"
            placeholder="@username"
          />
        </div>

        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Project Brief
          </label>
          <textarea
            name="brief"
            value={formData.brief}
            onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
            required
            rows={4}
            className="border-3 border-black p-3 rounded-xl focus:ring-4 focus:ring-pastel-purple focus:outline-none w-full font-bold"
            placeholder="Describe your vision, character details, poses, and any specific requests..."
          />
        </div>

        <div>
          <label className="block font-black text-base uppercase mb-2 text-black">
            Reference Image (Max 1)
          </label>
          <input
            type="file"
            accept="image/*"
            disabled={previews.length >= 1}
            onChange={handleFileChange}
            className="border-3 border-black p-3 rounded-xl focus:ring-4 focus:ring-pastel-purple focus:outline-none w-full font-bold bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-black file:text-sm file:font-black file:bg-pastel-yellow hover:file:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <AnimatePresence>
                {previews.map((preview, index) => (
                  <motion.div
                    key={preview.previewUrl}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="border-3 border-black p-2 bg-white rounded-lg shadow-neopop-active relative rotate-1 hover:rotate-0 transition-transform max-w-xs"
                  >
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-black rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-sm hover:bg-red-600 transition-colors z-10 cursor-pointer"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                    <div className="aspect-square relative overflow-hidden rounded border border-black bg-gray-100">
                      <img
                        src={preview.previewUrl}
                        alt={`Reference preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="border-3 border-black bg-pastel-pink/40 p-4 rounded-xl space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="depositAgreed"
              checked={formData.depositAgreed}
              onChange={(e) =>
                setFormData({ ...formData, depositAgreed: e.target.checked })
              }
              className="mt-1 w-5 h-5 border-2 border-black rounded accent-black cursor-pointer"
            />
            <span className="font-bold text-sm text-black">
              I agree to the Terms & Conditions. I understand my account data may be purged after 3 weeks to maintain database health, and if approved, all communication will continue on my preferred social platform.
            </span>
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="bg-pastel-yellow border-4 border-black shadow-neopop text-xl font-black p-4 rounded-xl w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
        >
          {isSubmitting ? "Submitting Your Request..." : "Submit Request"}
        </motion.button>
      </form>
    </div>
  );
}
