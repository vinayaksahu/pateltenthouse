"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPackages } from "@/lib/db";
import { Package } from "@/types";
import { CheckCircle, AlertCircle, ArrowRight, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getPackages();
      setPackages(data.filter((p) => p.isActive));
    }
    load();
  }, []);

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary dark:text-gold font-bold text-xs uppercase tracking-wider block">
            Flexible Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900 dark:text-white">
            Our Standard Rental Packages
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-sans">
            Choose from our pre-configured luxury event packages. Each package represents a balanced combination of tents, stage, chairs, and styling assets.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const isPopular = pkg.isPopular || pkg.id === "premium";
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden transition-all hover:-translate-y-1 duration-300 ${
                  isPopular
                    ? "bg-neutral-950 text-white ring-2 ring-gold border-0"
                    : "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-gold/15 dark:border-gold/30"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-gold text-neutral-950 text-[10px] font-extrabold px-4 py-1.5 uppercase rounded-bl-xl tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className={`font-serif text-2xl font-bold ${isPopular ? "text-gold" : "text-primary"}`}>
                    {pkg.name}
                  </h3>
                  
                  <div className="flex items-baseline mt-4 mb-6">
                    <span className="text-4xl font-serif font-bold">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <span className={`text-xs ml-1 ${isPopular ? "text-neutral-400" : "text-neutral-500"}`}>
                      / event
                    </span>
                  </div>

                  <div className={`w-full h-[1px] mb-6 ${isPopular ? "bg-neutral-800" : "bg-neutral-100 dark:bg-neutral-800"}`} />

                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3">What&apos;s Included:</h4>
                  <ul className="space-y-3">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="h-4 w-4 text-gold mr-3 shrink-0" />
                        <span className={isPopular ? "text-neutral-300" : "text-neutral-700 dark:text-neutral-300"}>
                          {inc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 pt-0">
                  <Link
                    href={`/booking?package=${pkg.id}`}
                    className={`w-full py-3.5 rounded-full text-center font-bold text-xs uppercase tracking-wider block transition-all ${
                      isPopular
                        ? "royal-red-gradient text-white hover:shadow-lg gold-border hover:scale-105"
                        : "bg-neutral-100 dark:bg-neutral-800 hover:bg-primary dark:hover:bg-gold dark:hover:text-neutral-900 hover:text-white text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:scale-105"
                    }`}
                  >
                    Book {pkg.name}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-10 border border-gold/15 dark:border-gold/30 shadow-sm space-y-6">
          <div className="border-b pb-4 border-gold/10 dark:border-gold/20">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
              Compare Packages
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Select the package that fits your event scale. Need something unique? Try our custom package builder.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-cream dark:bg-neutral-950">
                  <th className="py-3 px-4 font-serif font-bold text-neutral-700 dark:text-neutral-300">Rental Item</th>
                  <th className="py-3 px-4 font-serif font-bold text-neutral-700 dark:text-neutral-300 text-center">Silver</th>
                  <th className="py-3 px-4 font-serif font-bold text-neutral-700 dark:text-neutral-300 text-center">Gold</th>
                  <th className="py-3 px-4 font-serif font-bold text-neutral-700 dark:text-neutral-300 text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-400">
                <tr>
                  <td className="py-3 px-4 font-medium">Chandni Pipe Set</td>
                  <td className="py-3 px-4 text-center">4 Sets</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">6 Sets</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">6 Sets</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Curtains (Parda)</td>
                  <td className="py-3 px-4 text-center">6 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">10 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">10 Pcs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Banquet Chairs</td>
                  <td className="py-3 px-4 text-center">20 Pcs</td>
                  <td className="py-3 px-4 text-center">30 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">50 Pcs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Dari</td>
                  <td className="py-3 px-4 text-center">4 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">5 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">5 Pcs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Welcome Gate</td>
                  <td className="py-3 px-4 text-center">1 Gate</td>
                  <td className="py-3 px-4 text-center">1 Gate</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">1 Gate</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Carpets</td>
                  <td className="py-3 px-4 text-center">3 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">3 Pcs</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">3 Pcs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">High Power Coolers</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center">1 Unit</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">2 Units</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Royal Mandap</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">Included</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Luxury Stage</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Balloon Theme Decor</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center text-neutral-400">-</td>
                  <td className="py-3 px-4 text-center font-semibold text-primary">Included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Builder Banner */}
        <div className="bg-neutral-950 text-white rounded-2xl p-8 sm:p-12 border border-gold/40 shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 mb-6 md:mb-0 md:max-w-2xl">
            <span className="text-gold text-xs font-bold uppercase tracking-wider block">
              Flexible Customization
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Want To Customize Your Rental List?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Don&apos;t limit yourself to fixed setups. Choose the exact quantity of chairs, lights, carpets, coolers, and stages with our smart price calculator.
            </p>
          </div>

          <Link
            href="/builder"
            className="w-full md:w-auto px-6 py-3 rounded-full royal-red-gradient text-white text-xs font-bold text-center flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-md gold-border"
          >
            <span>Launch Custom Builder</span>
            <ArrowRight className="h-4 w-4 text-gold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
