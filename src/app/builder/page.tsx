"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSettings } from "@/lib/db";
import { RentalItem, BusinessSettings } from "@/types";
import {
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  Calculator,
  Download,
  ShoppingBag,
  HelpCircle,
  Undo
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function CustomPackageBuilder() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [items, setItems] = useState<RentalItem[]>([]);
  
  // Selected items: [itemId]: quantity
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  
  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  // GST Toggle
  const [includeGST, setIncludeGST] = useState(false);
  
  // AI Budget Input
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetSuggestion, setBudgetSuggestion] = useState<{
    items: { item: RentalItem; qty: number }[];
    total: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setSettings(data);
      setItems(data.rentalItems);
    }
    load();
  }, []);

  const handleQtyChange = (itemId: string, val: number) => {
    setSelectedQuantities((prev) => {
      const newQty = Math.max(0, (prev[itemId] || 0) + val);
      return { ...prev, [itemId]: newQty };
    });
  };

  const resetSelection = () => {
    setSelectedQuantities({});
    setBudgetSuggestion(null);
  };

  // Calculations
  const selectedItemsList = items
    .filter((item) => selectedQuantities[item.id] > 0)
    .map((item) => ({
      item,
      quantity: selectedQuantities[item.id],
      total: item.pricePerUnit * selectedQuantities[item.id]
    }));

  const subtotal = selectedItemsList.reduce((acc, curr) => acc + curr.total, 0);
  const gstRate = settings?.gstRate || 18;
  const gst = includeGST ? Math.round((subtotal * gstRate) / 100) : 0;
  const grandTotal = subtotal + gst;

  // Smart Recommendations
  const chairCount = selectedQuantities["chairs"] || 0;
  const stageSelected = (selectedQuantities["stage"] || 0) > 0;
  const mandapSelected = (selectedQuantities["mandap"] || 0) > 0;
  const gateSelected = (selectedQuantities["gate"] || 0) > 0;

  let recommendation: { text: string; actionText: string; link: string } | null = null;
  if (chairCount >= 100) {
    recommendation = {
      text: "You selected 100+ Chairs. We recommend checking out our Gold Package (₹15,000) for a better bundled price!",
      actionText: "View Gold Package",
      link: "/packages"
    };
  } else if (stageSelected && mandapSelected && gateSelected) {
    recommendation = {
      text: "You have selected a Stage, Mandap, and Welcome Gate. Our Premium Package (₹25,000) offers this and much more at a bulk discount!",
      actionText: "View Premium Package",
      link: "/packages"
    };
  }

  // AI Budget Planner Suggester
  const runBudgetPlanner = () => {
    const budget = parseFloat(budgetInput);
    if (isNaN(budget) || budget <= 0) return;

    let remaining = budget;
    if (includeGST) {
      // Back calculate pre-GST budget limit
      remaining = budget / (1 + gstRate / 100);
    }

    const suggestedQuantities: { [key: string]: number } = {};

    // Helper to add item if budget permits
    const attemptAdd = (id: string, preferredQty: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      
      let qty = preferredQty;
      while (qty > 0 && remaining < item.pricePerUnit * qty) {
        qty--;
      }
      if (qty > 0) {
        suggestedQuantities[id] = qty;
        remaining -= item.pricePerUnit * qty;
      }
    };

    // Priority-based greedy allocation
    if (remaining >= 25000) {
      // Premium setup suggestion
      attemptAdd("stage", 1);
      attemptAdd("mandap", 1);
      attemptAdd("gate", 1);
      attemptAdd("coolers", 2);
      attemptAdd("chairs", 100);
      attemptAdd("lights", 10);
      attemptAdd("parda", 10);
      attemptAdd("carpet", 3);
      attemptAdd("dari", 5);
      attemptAdd("pipe_set", 6);
    } else if (remaining >= 15000) {
      // Gold setup suggestion
      attemptAdd("mandap", 1);
      attemptAdd("gate", 1);
      attemptAdd("coolers", 1);
      attemptAdd("chairs", 50);
      attemptAdd("lights", 6);
      attemptAdd("parda", 10);
      attemptAdd("carpet", 3);
      attemptAdd("dari", 5);
      attemptAdd("pipe_set", 6);
    } else if (remaining >= 8000) {
      // Silver setup suggestion
      attemptAdd("gate", 1);
      attemptAdd("chairs", 30);
      attemptAdd("lights", 4);
      attemptAdd("parda", 6);
      attemptAdd("carpet", 3);
      attemptAdd("dari", 4);
      attemptAdd("pipe_set", 4);
    } else {
      // Budget setup
      attemptAdd("chairs", Math.min(50, Math.floor(remaining / 15)));
      attemptAdd("lights", Math.min(6, Math.floor(remaining / 100)));
      attemptAdd("gate", Math.min(1, Math.floor(remaining / 2000)));
      attemptAdd("parda", Math.min(4, Math.floor(remaining / 100)));
      attemptAdd("carpet", Math.min(2, Math.floor(remaining / 150)));
      attemptAdd("dari", Math.min(2, Math.floor(remaining / 100)));
    }

    // Apply suggestions to state
    setSelectedQuantities(suggestedQuantities);
    
    // Construct suggestion results for feedback
    const suggestedList = Object.entries(suggestedQuantities).map(([id, qty]) => {
      const item = items.find((i) => i.id === id)!;
      return { item, qty };
    });

    const total = suggestedList.reduce((acc, curr) => acc + curr.item.pricePerUnit * curr.qty, 0);
    setBudgetSuggestion({
      items: suggestedList,
      total: Math.round(includeGST ? total * (1 + gstRate / 100) : total)
    });
  };

  // WhatsApp Quote Text Generator
  const sendWhatsAppQuote = () => {
    if (!clientName) {
      alert("Please enter your name to send a WhatsApp Quote.");
      return;
    }
    const itemsText = selectedItemsList
      .map((si) => `• ${si.item.name} (${si.quantity} x ₹${si.item.pricePerUnit})`)
      .join("\n");

    const message = `Hello Patel Tent House,\n\nI want to request a custom package quotation.\n\n*Customer Details:*\nName: ${clientName}\nPhone: ${clientPhone || "N/A"}\n\n*Selected Items:*\n${itemsText}\n\n*Estimated Cost:*\nSubtotal: ₹${subtotal.toLocaleString("en-IN")}\n${
      includeGST ? `GST (${gstRate}%): ₹${gst.toLocaleString("en-IN")}\n` : ""
    }*Grand Total: ₹${grandTotal.toLocaleString("en-IN")}*\n\nPlease confirm availability for booking.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919713661625?text=${encoded}`, "_blank");
  };

  // PDF Quotation Generator
  const downloadPDFQuote = () => {
    const doc = new jsPDF() as any;

    // Header Branding
    doc.setFillColor(154, 13, 13); // Royal Red
    doc.rect(0, 0, 210, 38, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("serif", "bold");
    doc.setFontSize(22);
    doc.text("PATEL TENT HOUSE", 14, 18);

    doc.setFontSize(10);
    doc.setFont("sans-serif", "normal");
    doc.text("आपके हर शुभ अवसर को बनाएं खास", 14, 25);
    doc.text("Jayramnagar, Bilaspur, CG | Ph: 9713661625, 7000297079", 14, 31);

    // Document Title
    doc.setTextColor(154, 13, 13);
    doc.setFontSize(14);
    doc.setFont("serif", "bold");
    doc.text("ESTIMATED QUOTATION", 14, 48);

    // Date
    const today = new Date().toLocaleDateString("en-IN");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date: ${today}`, 155, 48);

    // Client details
    doc.setDrawColor(212, 175, 55); // Gold
    doc.setLineWidth(0.5);
    doc.line(14, 52, 196, 52);

    doc.setFont("sans-serif", "bold");
    doc.text("Customer Details:", 14, 60);
    doc.setFont("sans-serif", "normal");
    doc.text(`Name: ${clientName || "Valued Client"}`, 14, 66);
    doc.text(`Contact Phone: ${clientPhone || "N/A"}`, 14, 72);

    // Table Data
    const tableBody = selectedItemsList.map((si, i) => [
      i + 1,
      si.item.name,
      si.quantity,
      `Rs. ${si.item.pricePerUnit}`,
      `Rs. ${si.total}`
    ]);

    doc.autoTable({
      startY: 78,
      head: [["S.No", "Rental Item", "Quantity", "Rate / Unit", "Total Price"]],
      body: tableBody,
      headStyles: { fillColor: [154, 13, 13], textColor: [255, 255, 255] },
      theme: "striped",
      styles: { fontSize: 9 }
    });

    const finalY = doc.previousAutoTable.finalY + 10;

    // Totals
    doc.setFont("sans-serif", "bold");
    doc.text(`Subtotal: Rs. ${subtotal.toLocaleString("en-IN")}`, 140, finalY);
    if (includeGST) {
      doc.text(`GST (${gstRate}%): Rs. ${gst.toLocaleString("en-IN")}`, 140, finalY + 6);
      doc.text(`Grand Total: Rs. ${grandTotal.toLocaleString("en-IN")}`, 140, finalY + 12);
    } else {
      doc.text(`Grand Total: Rs. ${grandTotal.toLocaleString("en-IN")}`, 140, finalY + 6);
    }

    // Footer note
    doc.setFont("serif", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Note: This is an estimated price. Rates may vary depending on actual location distance and site challenges.", 14, finalY + 25);
    doc.text("Thank you for choosing Patel Tent House. We look forward to decoration of your grand event!", 14, finalY + 30);

    doc.save(`Quotation_Patel_Tent_House_${today}.pdf`);
  };

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary font-bold text-xs uppercase tracking-wider block">
            Custom Package
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900">
            Interactive Rental Builder
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm text-neutral-500 font-sans">
            Build your wedding event inventory list dynamically. Select custom quantities and get immediate price calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Picker (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Budget Planner */}
            <div className="bg-neutral-950 text-white rounded-2xl p-6 border border-gold/30 shadow-md space-y-4">
              <h2 className="font-serif text-lg font-bold text-gold flex items-center">
                <Sparkles className="h-5 w-5 mr-2" /> AI Budget Package Recommender
              </h2>
              <p className="text-xs text-neutral-300">
                Enter your total decoration budget (in Rupees) and we will automatically select the best items configuration for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-3 text-neutral-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    placeholder="Enter Budget (e.g. 10000)"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-gold text-sm font-semibold"
                  />
                </div>
                
                <button
                  onClick={runBudgetPlanner}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Generate Plan
                </button>
              </div>

              {budgetSuggestion && (
                <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-2">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider">AI Suggested Items Combination:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
                    {budgetSuggestion.items.map((bs, i) => (
                      <span key={i}>
                        {bs.item.name}: <strong className="text-white">{bs.qty}</strong>
                      </span>
                    ))}
                  </div>
                  <div className="text-xs border-t border-neutral-800 pt-2 flex justify-between mt-2">
                    <span>Suggested Total:</span>
                    <strong className="text-gold">₹{budgetSuggestion.total.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Recommendation Banner Alert */}
            <AnimatePresence>
              {recommendation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary/10 border-l-4 border-gold p-4 rounded-r-xl"
                >
                  <div className="flex items-start">
                    <div className="ml-3">
                      <p className="text-sm text-neutral-800 font-medium">
                        {recommendation.text}
                      </p>
                      <div className="mt-2">
                        <Link
                          href={recommendation.link}
                          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center space-x-1"
                        >
                          <span>{recommendation.actionText}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rental Items List */}
            <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" /> Choose Rental Items & Quantities
              </h2>
              
              <div className="divide-y divide-neutral-100">
                {items.map((item) => {
                  const qty = selectedQuantities[item.id] || 0;
                  return (
                    <div key={item.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                          {item.name}
                        </h3>
                        <span className="text-xs text-neutral-500">
                          ₹{item.pricePerUnit} / {item.unit}
                        </span>
                      </div>

                      {/* Quantity Selectors */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          disabled={qty === 0}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                            qty === 0
                              ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                              : "border-primary/20 text-primary hover:bg-primary/5 active:bg-primary/10"
                          }`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        
                        <span className="w-8 text-center font-bold text-sm sm:text-base text-neutral-800">
                          {qty}
                        </span>

                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border border-primary/20 text-primary hover:bg-primary/5 active:bg-primary/10 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calculator Sidebar (Right 1 Column) */}
          <div className="space-y-6">
            {/* Live Estimator Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gold/30 shadow-md space-y-6 sticky top-24">
              <div className="border-b pb-4 border-gold/15 flex justify-between items-center">
                <h2 className="font-serif text-lg font-bold text-neutral-900 flex items-center">
                  <Calculator className="h-4.5 w-4.5 mr-2 text-primary" /> Live Calculator
                </h2>
                
                {selectedItemsList.length > 0 && (
                  <button
                    onClick={resetSelection}
                    className="text-[10px] font-bold text-neutral-400 hover:text-primary flex items-center space-x-0.5"
                  >
                    <Undo className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Selections List */}
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                {selectedItemsList.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">
                    No items selected yet. Adjust quantities to calculate pricing.
                  </p>
                ) : (
                  selectedItemsList.map((si) => (
                    <div key={si.item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-semibold text-neutral-800">{si.item.name}</span>
                        <div className="text-[10px] text-neutral-500">
                          {si.quantity} x ₹{si.item.pricePerUnit}
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900">₹{si.total.toLocaleString("en-IN")}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                {/* GST Toggle */}
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-neutral-500 font-medium flex items-center">
                    Include Estimate GST ({gstRate}%)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeGST}
                    onChange={(e) => setIncludeGST(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {includeGST && (
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">GST ({gstRate}%)</span>
                    <span className="font-bold">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-sm text-neutral-900">Grand Total</span>
                  <span className="font-serif font-extrabold text-xl text-primary">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Form client info */}
              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <input
                  type="text"
                  placeholder="Your Name (Required)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={sendWhatsAppQuote}
                  disabled={selectedItemsList.length === 0}
                  className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                    selectedItemsList.length === 0
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border-0"
                      : "bg-[#25D366] hover:bg-[#20ba59] text-white hover:scale-105 shadow-md"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 fill-white" />
                  <span>Send WhatsApp Quote</span>
                </button>

                <button
                  onClick={downloadPDFQuote}
                  disabled={selectedItemsList.length === 0}
                  className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border transition-all ${
                    selectedItemsList.length === 0
                      ? "bg-white text-neutral-300 border-neutral-200 cursor-not-allowed"
                      : "bg-white text-primary border-primary hover:bg-primary/5 hover:scale-105"
                  }`}
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF Estimate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
