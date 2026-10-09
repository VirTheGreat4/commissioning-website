"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function CommissionButton({ text, className }: { text: string, className: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from('store_settings').select('is_open').eq('id', 1).single()
      .then(({ data }) => { if (data) setIsOpen(data.is_open); });
  }, []);

  const handleClick = () => {
    if (isOpen) {
      router.push('/commission');
    } else {
      alert("🔴 COMMISSIONING REQUESTS ARE CURRENTLY CLOSED.\n\nThis might be due to a pile-up of commissions in the queue or personal time of the artist.\n\nPlease check the Live Queue to see current progress!");
    }
  };

  return <button onClick={handleClick} className={className}>{text}</button>;
}
