"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Tent,
  Award,
  Users,
  Calendar as CalendarIcon,
  Sparkles,
  Phone,
  MessageSquare,
  ArrowRight,
  Star,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { getPackages, getReviews, getServices } from "@/lib/db";
import { Package, Review, ServiceItem } from "@/types";

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const pkgs = await getPackages();
      const revs = await getReviews(true); // only approved
      const svcs = await getServices();
      setPackages(pkgs.filter((p) => p.isActive));
      setReviews(revs.slice(0, 3)); // show top 3
      setServices(svcs.slice(0, 6)); // show first 6 services
    }
    loadData();
  }, []);

  const heroBg = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-neutral-950 text-white py-20 px-4">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Patel Tent House Wedding Setup"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70" />
        </div>

        {/* Decorative Gold Border Corners */}
        <div className="absolute inset-6 pointer-events-none border border-gold/15 z-10 hidden sm:block">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-gold" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-gold" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-gold" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-gold" />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-primary/20 text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4" />
            <span>Bilaspur&apos;s Premier Event Rentals</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-white"
          >
            Patel <span className="gold-text-gradient block sm:inline">Tent House</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-2xl text-neutral-300 font-serif max-w-3xl mx-auto leading-relaxed"
          >
            Wedding, Mandap, Decoration, Chair, Light & Event Setup Services
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-md sm:text-lg text-gold font-serif italic"
          >
            &quot;आपके हर शुभ अवसर को बनाएं खास&quot;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full royal-red-gradient text-white font-bold text-sm shadow-xl gold-border hover:scale-105 transition-all text-center"
            >
              Book Now
            </Link>
            <Link
              href="/builder"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-gold text-gold font-bold text-sm hover:scale-105 transition-all text-center"
            >
              Get Custom Quote
            </Link>
            <a
              href="https://wa.me/919713661625"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-xl hover:bg-[#20ba59] transition-all hover:scale-105"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              <span>WhatsApp Inquiry</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* STATISTICS & ABOUT SECTION */}
      <section className="py-20 bg-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <span className="text-primary font-bold text-sm uppercase tracking-wider block border-l-4 border-gold pl-2">
                About Patel Tent House
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                Crafting Auspicious Occasions With Grandeur & Royal Decor
              </h2>
              <p className="text-neutral-600 leading-relaxed font-sans text-sm sm:text-base">
                Located in Gram Bhelai (PO Jayramnagar) Bilaspur, Patel Tent House has been the most trusted event organizer and tent service provider in the region. We offer absolute reliability, premium materials, and decorative aesthetics to transform weddings, receptions, engagements, and religious events into breathtaking celebrations.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gold/15 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-2">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl font-bold text-neutral-900">500+</span>
                  <span className="text-xs text-neutral-500 font-medium">Total Events</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gold/15 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-2">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl font-bold text-neutral-900">450+</span>
                  <span className="text-xs text-neutral-500 font-medium">Happy Clients</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gold/15 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="block text-2xl font-bold text-neutral-900">15+</span>
                  <span className="text-xs text-neutral-500 font-medium">Years Exp.</span>
                </div>
              </div>
            </div>

            {/* Right Features Check */}
            <div className="bg-neutral-950 text-white p-8 rounded-2xl shadow-xl gold-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
              <h3 className="text-xl font-serif text-gold font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-gold" /> Why Choose Us
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-gold/10 p-1.5 rounded-full text-gold shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Professional Team</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Highly experienced decoration designers and structural technicians.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-gold/10 p-1.5 rounded-full text-gold shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Quality Materials</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Spotless white curtains, premium quality carpets, and sturdy pipe sets.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-gold/10 p-1.5 rounded-full text-gold shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Timely Execution</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Rigid setup deadlines to ensure decorations are ready long before the event begins.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-gold/10 p-1.5 rounded-full text-gold shrink-0">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Affordable Pricing</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Luxury wedding thematic setups at competitive local rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20 bg-white border-y border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-primary font-bold text-xs uppercase tracking-wider block">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
              Our Professional Rental & Decor Services
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
            <p className="text-sm text-neutral-500">
              Explore our wide range of services designed to fulfill all decoration and structural setup needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-cream rounded-2xl overflow-hidden shadow-sm border border-gold/15 hover:border-gold hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={svc.imageUrl}
                    alt={svc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                      {svc.description}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/919713661625?text=Hello%20Patel%20Tent%20House,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(
                      svc.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-white hover:bg-primary hover:text-white border border-primary/20 text-primary rounded-xl text-xs font-bold text-center block transition-all uppercase tracking-wide"
                  >
                    Quick Inquiry
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-bold text-sm group"
            >
              <span>View All 12 Services</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-primary font-bold text-xs uppercase tracking-wider block">
              Budget Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
              Select A Royal Package Deal
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
            <p className="text-sm text-neutral-500">
              Choose from our curated wedding packages designed for various budgets.
            </p>
          </div>

          {/* Packages Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const isPopular = pkg.isPopular || pkg.id === "premium";
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
                    isPopular
                      ? "bg-neutral-950 text-white ring-2 ring-gold border-0"
                      : "bg-white text-neutral-900 border border-gold/20"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-gold text-neutral-950 text-[10px] font-extrabold px-3 py-1 uppercase rounded-bl-xl tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className={`font-serif text-2xl font-bold ${isPopular ? "text-gold" : "text-primary"}`}>
                      {pkg.name}
                    </h3>
                    
                    <div className="flex items-baseline mt-4 mb-6">
                      <span className="text-3xl sm:text-4xl font-serif font-bold">
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-xs ml-1 ${isPopular ? "text-neutral-400" : "text-neutral-500"}`}>
                        / Event
                      </span>
                    </div>

                    <div className={`w-full h-[1px] mb-6 ${isPopular ? "bg-neutral-800" : "bg-neutral-100"}`} />

                    <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Includes:</h4>
                    <ul className="space-y-2.5">
                      {pkg.includes.map((inc, i) => (
                        <li key={i} className="flex items-center text-xs sm:text-sm">
                          <CheckCircle className="h-4 w-4 text-gold mr-2.5 shrink-0" />
                          <span className={isPopular ? "text-neutral-300" : "text-neutral-700"}>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 pt-0">
                    <Link
                      href={`/booking?package=${pkg.id}`}
                      className={`w-full py-3 rounded-full text-center font-bold text-xs uppercase tracking-wider block transition-all ${
                        isPopular
                          ? "royal-red-gradient text-white hover:shadow-lg gold-border"
                          : "bg-neutral-100 hover:bg-primary hover:text-white text-neutral-800 border border-neutral-200"
                      }`}
                    >
                      Book {pkg.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white border-y border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-primary font-bold text-xs uppercase tracking-wider block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-cream rounded-2xl p-8 border border-gold/15 shadow-sm space-y-4"
              >
                <div className="flex text-gold space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < rev.rating ? "fill-gold text-gold" : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-neutral-600 font-sans italic text-sm sm:text-base leading-relaxed">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-serif text-sm">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900">
                      {rev.customerName}
                    </h4>
                    <span className="text-[10px] text-neutral-500">Verified Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/reviews"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-bold text-sm group"
            >
              <span>Read More & Write A Review</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT BANNER */}
      <section className="py-16 royal-red-gradient text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold">
            Planning An Auspicious Event?
          </h2>
          <p className="text-neutral-200 text-sm sm:text-base max-w-2xl mx-auto">
            Book our professional tent setups, gorgeous mandaps, and stage decorators today. Get in touch directly via Call or WhatsApp for a customized quote.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="tel:9713661625"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              <span>Call: 9713661625</span>
            </a>
            <a
              href="https://wa.me/917000297079"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              <span>WhatsApp: 7000297079</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
