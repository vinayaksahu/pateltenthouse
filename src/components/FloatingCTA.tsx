"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { getSettings, formatWhatsAppNumber } from "@/lib/db";

export default function FloatingCTA() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const primaryPhone = settings?.contactNumbers?.[0] || "9713661625";
  const whatsappPhone = formatWhatsAppNumber(primaryPhone);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Hello%20Patel%20Tent%20House,%20I%20want%20to%20inquire%20about%20event%20booking%20and%20decorations.`;

  return (
    <>
      {/* Floating Buttons for Desktop & Tablet (Hidden on small mobile) */}
      <div className="fixed bottom-20 right-6 z-40 hidden sm:flex flex-col space-y-3">
        {/* Call Button */}
        <motion.a
          href={`tel:${primaryPhone}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white shadow-xl gold-border cursor-pointer"
          title="Call Us Now"
        >
          <Phone className="h-5 w-5" />
        </motion.a>

        {/* WhatsApp Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center text-white shadow-xl border border-white/20 cursor-pointer"
          title="WhatsApp Us"
        >
          <MessageCircle className="h-6 w-6 fill-white" />
        </motion.a>
      </div>

      {/* Mobile Sticky Bottom Bar (Visible only on mobile screen < 640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 border-t border-gold/30 shadow-2xl px-4 py-2 flex items-center justify-between">
        <a
          href={`tel:${primaryPhone}`}
          className="flex flex-col items-center justify-center text-neutral-300 active:text-gold flex-1 py-1"
        >
          <Phone className="h-5 w-5 text-gold" />
          <span className="text-[10px] mt-0.5 font-medium tracking-wide">Call Now</span>
        </a>

        <div className="w-[1px] h-8 bg-neutral-800" />

        <Link
          href="/booking"
          className="mx-3 px-4 py-2.5 rounded-full royal-red-gradient text-white text-xs font-bold flex items-center justify-center space-x-1.5 flex-2 shadow-lg gold-border"
        >
          <Calendar className="h-4 w-4 text-gold" />
          <span>Book Event</span>
        </Link>

        <div className="w-[1px] h-8 bg-neutral-800" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-neutral-300 active:text-green-500 flex-1 py-1"
        >
          <MessageCircle className="h-5 w-5 text-green-500 fill-green-500/20" />
          <span className="text-[10px] mt-0.5 font-medium tracking-wide">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
