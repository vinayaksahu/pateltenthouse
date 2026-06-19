"use client";

import Link from "next/link";
import { Tent, Phone, Mail, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-8 gold-border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-neutral-800 pb-12 mb-8">
          {/* Business Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full royal-red-gradient flex items-center justify-center gold-border">
                <Tent className="h-5 w-5 text-gold" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wide text-white block">
                  Patel Tent House
                </span>
                <span className="text-[10px] text-gold tracking-widest uppercase block -mt-1 font-semibold">
                  Bilaspur
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              {t("hero_quote")}
              <br />
              {t("footer_desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-white text-md font-bold tracking-wide mb-4 border-l-2 border-gold pl-2">
              {t("quick_links")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-gold transition-colors flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-gold" /> {t("nav_services")}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-gold transition-colors flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-gold" /> {t("nav_packages")}
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-gold transition-colors flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-gold" /> {t("nav_custom_builder")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-gold" /> {t("nav_gallery")}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold transition-colors flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-gold" /> {t("nav_booking")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-white text-md font-bold tracking-wide mb-4 border-l-2 border-gold pl-2">
              {t("contact_info")}
            </h3>
            <ul className="space-y-3.5 text-sm text-neutral-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 text-gold mt-1 mr-2.5 shrink-0" />
                <span>
                  {t("address_line1")},<br />
                  {t("address_line2")}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-gold mr-2.5 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:9713661625" className="hover:text-gold text-neutral-300">
                    9713661625 (Naresh)
                  </a>
                  <a href="tel:7000297079" className="hover:text-gold text-neutral-300">
                    7000297079 (Kamlesh)
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-gold mr-2.5 shrink-0" />
                <a href="mailto:info@pateltenthouse.com" className="hover:text-gold">
                  info@pateltenthouse.com
                </a>
              </li>
            </ul>
          </div>

          {/* Location Map Shortcut */}
          <div>
            <h3 className="font-serif text-white text-md font-bold tracking-wide mb-4 border-l-2 border-gold pl-2">
              Service Locations
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-3">
              Serving Jayramnagar, Bilaspur, Akaltara, Masturi, and neighboring regions in Chhattisgarh.
            </p>
            <a
              href="https://maps.google.com/?q=Jayramnagar+Bilaspur+Chhattisgarh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-semibold text-gold border border-gold/30 hover:border-gold px-3.5 py-1.5 rounded-full transition-colors"
            >
              <MapPin className="h-3 w-3 mr-1" />
              <span>Find Us On Google Maps</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 font-sans">
          <p>© {currentYear} Patel Tent House. {t("rights_reserved")}</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Made with <Heart className="h-3 w-3 text-primary fill-primary mx-1" /> for your auspicious events.
          </p>
        </div>
      </div>
    </footer>
  );
}
