"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getGalleryItems } from "@/lib/db";
import { GalleryItem } from "@/types";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", name: "All Work" },
  { id: "wedding", name: "Wedding Setup" },
  { id: "mandap", name: "Mandap Decor" },
  { id: "stage", name: "Stage Design" },
  { id: "lighting", name: "Event Lighting" },
  { id: "decoration", name: "Flower / Gate" },
  { id: "birthday", name: "Birthday Events" },
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Lightbox State
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getGalleryItems();
      setGallery(data);
    }
    load();
  }, []);

  const filteredItems = activeCategory === "all"
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const openLightbox = (id: string) => {
    const idx = filteredItems.findIndex((item) => item.id === id);
    if (idx > -1) setSelectedIdx(idx);
  };

  const closeLightbox = () => setSelectedIdx(null);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredItems]);

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary dark:text-gold font-bold text-xs uppercase tracking-wider block">
            Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900 dark:text-white">
            Decoration Gallery
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans">
            Feast your eyes on some of our premium custom setups, grand entry archways, sparkling lightings, and royal mandaps in Bilaspur.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gold/15 dark:border-gold/30 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                closeLightbox();
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                activeCategory === cat.id
                  ? "royal-red-gradient text-white border-primary shadow-sm"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-gold dark:hover:border-gold hover:text-primary dark:hover:text-gold"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Masonry-like Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gold/15 dark:border-gold/30 cursor-pointer bg-white dark:bg-neutral-900"
                onClick={() => openLightbox(item.id)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-end">
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                      <ZoomIn className="h-4 w-4 text-gold" />
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-gold font-bold uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold truncate mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-neutral-400 text-sm">
            No gallery items found in this category.
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-10 select-none"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Image Showcase Container */}
              <div
                className="relative max-w-4xl w-full h-[60vh] sm:h-[75vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={filteredItems[selectedIdx].imageUrl}
                    alt={filteredItems[selectedIdx].title}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Title Overlay in Footer */}
              <div className="absolute bottom-6 left-6 right-6 text-center text-white pointer-events-none">
                <span className="text-[10px] text-gold uppercase tracking-widest block font-bold">
                  {filteredItems[selectedIdx].category}
                </span>
                <span className="font-serif text-base font-medium mt-1 block">
                  {filteredItems[selectedIdx].title}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
