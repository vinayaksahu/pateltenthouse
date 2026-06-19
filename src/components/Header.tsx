"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageSquare, Tent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Packages", href: "/packages" },
  { name: "Custom Builder", href: "/builder" },
  { name: "Gallery", href: "/gallery" },
  { name: "Booking", href: "/booking" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) return null; // Admin dashboard has its own navigation

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glassmorphism shadow-md py-3 gold-border-b"
            : "bg-transparent py-5"
        }`}
        style={{ borderBottom: isScrolled ? "1px solid rgba(212, 175, 55, 0.3)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full royal-red-gradient flex items-center justify-center gold-border shadow-md">
                <Tent className="h-5 w-5 text-gold" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-primary block group-hover:text-primary-hover transition-colors">
                  Patel Tent House
                </span>
                <span className="text-[10px] sm:text-[11px] text-gold tracking-widest font-sans uppercase block -mt-1 font-semibold">
                  Bilaspur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-sans text-sm font-medium tracking-wide transition-all relative py-1 ${
                      isActive
                        ? "text-primary font-bold"
                        : "text-neutral-700 hover:text-primary"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href="tel:9713661625"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/5 transition-all"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Now</span>
              </a>
              <Link
                href="/booking"
                className="px-4 py-1.5 rounded-full royal-red-gradient text-white text-xs font-semibold hover:shadow-lg gold-border transition-all hover:scale-105"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 rounded-md text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-cream p-6 shadow-2xl flex flex-col z-[1000] gold-border-l"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 border-b pb-4 border-gold/20">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full royal-red-gradient flex items-center justify-center gold-border">
                    <Tent className="h-4 w-4 text-gold" />
                  </div>
                  <span className="font-serif text-md font-bold text-primary">
                    Patel Tent House
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-neutral-500 hover:text-primary hover:bg-neutral-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col space-y-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`font-sans text-base font-semibold px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-4 border-gold"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t pt-6 border-gold/20 space-y-3">
                <a
                  href="tel:9713661625"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-primary/20 text-primary font-semibold text-sm hover:bg-primary/5 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call: 9713661625</span>
                </a>
                <a
                  href="https://wa.me/919713661625"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg royal-red-gradient text-white font-semibold text-sm hover:shadow-lg transition-all gold-border"
                >
                  <MessageSquare className="h-4 w-4 text-gold" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
