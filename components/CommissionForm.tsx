"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export interface FormData {
  clientName: string;
  email: string;
  brief: string;
  agreedToTos: boolean;
}

export default function CommissionForm() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    email: "",
    brief: "",
    agreedToTos: false,
  });

  const [files, setFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev: FormData) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      let reference_urls: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const filePath = `${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("references_private")
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }
          reference_urls.push(filePath);
        }
      }

      const { error: insertError } = await supabase.from("commissions").insert({
        client_name: formData.clientName,
        email: formData.email,
        brief: formData.brief,
        reference_urls: reference_urls,
        status: "Pending",
      });

      if (insertError) {
        throw insertError;
      }

      setSubmitStatus("success");
    } catch (err: unknown) {
      setSubmitStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred during submission.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-green-100 max-w-md mx-auto font-sans text-black text-center">
        <h2 className="text-3xl font-black uppercase mb-4">🎉 Request Sent Successfully!</h2>
        <p className="font-bold text-lg">I will email you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white max-w-md mx-auto font-sans text-black">
      <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-center border-b-4 border-black pb-2">
        Commission Request
      </h2>

      {submitStatus === "error" && (
        <div className="mb-4 border-2 border-black bg-red-200 p-3 rounded font-bold text-red-800 text-sm">
          Error: {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1 uppercase text-sm">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
            className="w-full border-2 border-black rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none font-medium"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 uppercase text-sm">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full border-2 border-black rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none font-medium"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block font-bold mb-1 uppercase text-sm">Project Brief</label>
          <textarea
            name="brief"
            value={formData.brief}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full border-2 border-black rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none font-medium"
            placeholder="Describe your commission idea..."
          />
        </div>

        <div>
          <label className="block font-bold mb-1 uppercase text-sm">
            Reference Images (Up to 3)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full border-2 border-black rounded-md p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-black file:text-sm file:font-bold file:bg-yellow-300 hover:file:bg-yellow-400 font-medium cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            name="agreedToTos"
            checked={formData.agreedToTos}
            onChange={handleInputChange}
            required
            className="w-5 h-5 border-2 border-black rounded accent-black cursor-pointer"
          />
          <label className="font-bold text-sm select-none cursor-pointer">
            I agree to the Terms of Service
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95, x: 3, y: 3, boxShadow: "1px 1px 0px 0px #000" }}
          className={`w-full border-3 border-black p-3 font-black uppercase rounded-lg shadow-neopop transition-colors ${
            isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-300"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </motion.button>
      </form>
    </div>
  );
}
