"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAvailability, createBooking } from "@/lib/db";
import { AvailabilityBlock } from "@/types";
import {
  Calendar as CalendarIcon,
  User,
  Phone,
  MapPin,
  Clock,
  Users,
  Package as PackageIcon,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedPackage = searchParams.get("package") || "silver";

  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form State
  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    whatsappNumber: "",
    villageCity: "",
    eventAddress: "",
    eventDate: "",
    eventTime: "18:00",
    eventType: "Wedding",
    expectedGuests: 100,
    packageType: preselectedPackage as any,
    additionalRequirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getAvailability();
      setAvailability(data);
    }
    load();
  }, []);

  // Update selected package if URL change
  useEffect(() => {
    if (preselectedPackage) {
      setForm((f) => ({ ...f, packageType: preselectedPackage as any }));
    }
  }, [preselectedPackage]);

  // Calendar calculations
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check date status
  const getDateStatus = (dayStr: string) => {
    const block = availability.find((a) => a.date === dayStr);
    return block ? block.status : "available";
  };

  const handleDateSelect = (dateStr: string, status: string) => {
    if (status === "blocked") return;
    setForm((f) => ({ ...f, eventDate: dateStr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.mobileNumber || !form.eventDate) {
      alert("Please fill in Name, Phone, and Event Date.");
      return;
    }

    setLoading(true);
    
    // Estimate pricing
    let subtotal = 8000;
    if (form.packageType === "gold") subtotal = 15000;
    else if (form.packageType === "premium") subtotal = 25000;
    else if (form.packageType === "custom") subtotal = 5000; // base deposit for custom

    const gst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gst;

    try {
      const res = await createBooking({
        customerName: form.customerName,
        mobileNumber: form.mobileNumber,
        whatsappNumber: form.whatsappNumber || form.mobileNumber,
        villageCity: form.villageCity,
        eventAddress: form.eventAddress,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        eventType: form.eventType,
        expectedGuests: Number(form.expectedGuests),
        packageType: form.packageType,
        additionalRequirements: form.additionalRequirements,
        subtotal,
        gst,
        grandTotal,
        status: "pending"
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setCreatedId(res.id);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDateStatus = form.eventDate ? getDateStatus(form.eventDate) : "available";

  return (
    <div className="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary font-bold text-xs uppercase tracking-wider block">
            Reservation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900">
            Book Patel Tent House
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm text-neutral-500 font-sans">
            Schedule decorations, seating structure, lighting sets, and event styling for your upcoming celebrations.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form Input Block (Left 2 Columns) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gold/15 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 border-b pb-3 border-gold/10">
                    Event Details & Client Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-primary" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        placeholder="Naresh Patel"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.mobileNumber}
                        onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                        placeholder="9713661625"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={form.whatsappNumber}
                        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                        placeholder="Leave blank to use mobile number"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* Village/City */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> Village / City
                      </label>
                      <input
                        type="text"
                        value={form.villageCity}
                        onChange={(e) => setForm({ ...form, villageCity: e.target.value })}
                        placeholder="Jayramnagar"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* Full Address */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> Event Address & Location details
                      </label>
                      <textarea
                        rows={2}
                        value={form.eventAddress}
                        onChange={(e) => setForm({ ...form, eventAddress: e.target.value })}
                        placeholder="Enter full landmark address, house details, etc."
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* Event Type */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <PackageIcon className="h-3.5 w-3.5 mr-1 text-primary" /> Event Type
                      </label>
                      <select
                        value={form.eventType}
                        onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800 bg-white"
                      >
                        <option>Wedding</option>
                        <option>Reception</option>
                        <option>Engagement</option>
                        <option>Birthday</option>
                        <option>Religious Event</option>
                        <option>Anniversary</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Expected Guests */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1 text-primary" /> Expected Guests
                      </label>
                      <input
                        type="number"
                        value={form.expectedGuests}
                        onChange={(e) => setForm({ ...form, expectedGuests: Number(e.target.value) })}
                        placeholder="100"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                      />
                    </div>

                    {/* Event Date (prefills from calendar click) */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1 text-primary" /> Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={form.eventDate}
                        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800 bg-white"
                      />
                    </div>

                    {/* Event Time */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> Event Time
                      </label>
                      <input
                        type="time"
                        value={form.eventTime}
                        onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800 bg-white"
                      />
                    </div>

                    {/* Package Type */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center">
                        <PackageIcon className="h-3.5 w-3.5 mr-1 text-primary" /> Package Type
                      </label>
                      <select
                        value={form.packageType}
                        onChange={(e) => setForm({ ...form, packageType: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800 bg-white"
                      >
                        <option value="silver">Silver Package (₹8,000)</option>
                        <option value="gold">Gold Package (₹15,000)</option>
                        <option value="premium">Premium Package (₹25,000)</option>
                        <option value="custom">Custom Package (Adjust in builder)</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Additional Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.additionalRequirements}
                      onChange={(e) => setForm({ ...form, additionalRequirements: e.target.value })}
                      placeholder="e.g. Extra coolers required, specific stage background colors, additional welcoming carpet length."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold text-sm text-neutral-800"
                    />
                  </div>

                  {/* Date Status Warnings */}
                  {selectedDateStatus === "booked" && (
                    <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl border border-amber-200 text-xs flex items-start space-x-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Note:</strong> The selected date is currently labeled as <strong>Booked</strong>. You can still submit this request, but approval is subject to inventory and structural team availability.
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center space-x-2 gold-border cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Submitting Request..." : "Request Event Booking"}
                  </button>
                </form>
              </div>

              {/* Availability Calendar Sidebar (Right 1 Column) */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 border-gold/10">
                    <h2 className="font-serif text-lg font-bold text-neutral-900 flex items-center">
                      <CalendarIcon className="h-4.5 w-4.5 mr-2 text-primary" /> Booking Calendar
                    </h2>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevMonth}
                        className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center font-serif font-bold text-sm text-neutral-800">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 py-1">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {/* Empty padding for offset */}
                    {[...Array(firstDay)].map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Days of Month */}
                    {[...Array(daysInMonth)].map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      
                      // Format: YYYY-MM-DD local
                      const year = dateObj.getFullYear();
                      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                      const dayStr = String(day).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${dayStr}`;

                      const status = getDateStatus(formattedDate);
                      const isSelected = form.eventDate === formattedDate;

                      let bgClass = "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200/50";
                      if (status === "booked") {
                        bgClass = "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/50";
                      } else if (status === "blocked") {
                        bgClass = "bg-neutral-100 text-neutral-400 border border-neutral-200/50 cursor-not-allowed";
                      } else if (status === "pending") {
                        bgClass = "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50";
                      }

                      if (isSelected) {
                        bgClass = "bg-primary text-white border border-primary scale-105 shadow-md";
                      }

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDateSelect(formattedDate, status)}
                          disabled={status === "blocked"}
                          className={`h-9 rounded-lg flex flex-col items-center justify-center font-bold transition-all relative ${bgClass}`}
                        >
                          <span>{day}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="border-t border-neutral-100 pt-3 text-[10px] sm:text-xs grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-600" />
                      <span className="text-neutral-500 font-medium">Available</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-600" />
                      <span className="text-neutral-500 font-medium">Booked</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-400" />
                      <span className="text-neutral-500 font-medium">Blocked</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // SUCCESS VIEW
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border-2 border-gold/40 shadow-xl text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-neutral-900">
                  Booking Request Submitted!
                </h2>
                <p className="text-xs text-gold font-bold uppercase tracking-wider">
                  Reference ID: {createdId}
                </p>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Your booking request for a <strong>{form.eventType}</strong> event on <strong>{form.eventDate}</strong> has been successfully recorded. Our management team will contact you shortly to confirm the setup details.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    const message = `Hello Patel Tent House,\n\nI just submitted a booking request via the website.\n\n*Reference ID:* ${createdId}\n*Name:* ${form.customerName}\n*Event:* ${form.eventType}\n*Date:* ${form.eventDate}\n\nPlease check my request and confirm.`;
                    window.open(`https://wa.me/919713661625?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-transform hover:scale-105"
                >
                  <MessageSquare className="h-4.5 w-4.5 fill-white" />
                  <span>Notify via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({
                      customerName: "",
                      mobileNumber: "",
                      whatsappNumber: "",
                      villageCity: "",
                      eventAddress: "",
                      eventDate: "",
                      eventTime: "18:00",
                      eventType: "Wedding",
                      expectedGuests: 100,
                      packageType: "silver",
                      additionalRequirements: ""
                    });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Book Another Event
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 bg-cream">Loading booking details...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}
