"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getServices, getSettings, formatWhatsAppNumber } from "@/lib/db";
import { ServiceItem, BusinessSettings } from "@/types";
import {
  Tent,
  Heart,
  Sparkles,
  DoorClosed,
  Lightbulb,
  Grid,
  Armchair,
  Wind,
  Smile,
  Cake,
  Flame,
  Flower,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: { [key: string]: any } = {
  Tent: Tent,
  Heart: Heart,
  Sparkles: Sparkles,
  DoorClosed: DoorClosed,
  Lightbulb: Lightbulb,
  Grid: Grid,
  Armchair: Armchair,
  Wind: Wind,
  Smile: Smile,
  Cake: Cake,
  Flame: Flame,
  Flower: Flower,
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getServices();
      setServices(data);
      const settingsData = await getSettings();
      setSettings(settingsData);
    }
    load();
  }, []);

  const primaryPhone = settings?.contactNumbers?.[0] || "9713661625";
  const whatsappPhone = formatWhatsAppNumber(primaryPhone);

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary dark:text-gold font-bold text-xs uppercase tracking-wider block">
            Our Offerings
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900 dark:text-white">
            Professional Event & Decor Services
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-sans">
            We provide everything needed to elevate your celebrations, from grandiose structural tenting to micro-details like banquets, coolers, and customized balloon backdrops.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          {services.map((svc, index) => {
            const IconComponent = iconMap[svc.iconName] || Tent;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gold/15 dark:border-gold/30 hover:border-gold dark:hover:border-gold transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Service Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={svc.imageUrl}
                      alt={svc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 dark:from-neutral-950/80 to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-2.5 rounded-full text-primary dark:text-gold gold-border shadow-md">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6 space-y-2">
                    <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                      {svc.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                      {svc.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Inquiry button */}
                <div className="p-6 pt-0">
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=Hello%20Patel%20Tent%20House,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(
                      svc.name
                    )}%20services.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-primary dark:border-gold text-primary dark:text-gold font-bold text-xs text-center flex items-center justify-center space-x-2 hover:bg-primary dark:hover:bg-gold hover:text-white dark:hover:text-neutral-900 transition-all uppercase tracking-wide"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
