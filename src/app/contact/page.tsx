"use client";

import { MapPin, Phone, MessageSquare, Clock, Map, Send, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSettings, formatWhatsAppNumber } from "@/lib/db";
import { BusinessSettings } from "@/types";

export default function ContactPage() {
  const [inquiry, setInquiry] = useState({
    name: "",
    phone: "",
    subject: "Booking Query",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const contactNumbers = settings?.contactNumbers || ["9713661625", "7000297079"];
  const primaryPhone = contactNumbers[0];
  const whatsappPhone = formatWhatsAppNumber(primaryPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone || !inquiry.message) {
      alert("Please fill in Name, Phone, and Message fields.");
      return;
    }
    setLoading(true);

    // Simulate sending email/message
    setTimeout(() => {
      // Create WhatsApp link for message
      const text = `Hello Patel Tent House,\n\nI have a contact query.\n\n*Name:* ${inquiry.name}\n*Phone:* ${inquiry.phone}\n*Subject:* ${inquiry.subject}\n*Message:* ${inquiry.message}`;
      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/${whatsappPhone}?text=${encoded}`, "_blank");
      
      setSuccess(true);
      setLoading(false);
      setInquiry({ name: "", phone: "", subject: "Booking Query", message: "" });
      
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary dark:text-gold font-bold text-xs uppercase tracking-wider block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900 dark:text-white">
            Contact Patel Tent House
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans">
            Ready to secure your booking or have specific decoration questions? Connect with our event managers Naresh and Kamlesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details (Left 1 Column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-gold/15 dark:border-gold/30 shadow-sm space-y-6">
              <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-white border-b pb-3 border-gold/10 dark:border-gold/20">
                Business Details
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Location */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 bg-primary/10 dark:bg-gold/10 p-2 rounded-full text-primary dark:text-gold shrink-0">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Business Location</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      Gram Bhelai, PO Jayramnagar,<br />
                      Bilaspur, Chhattisgarh, India
                    </p>
                  </div>
                </div>

                {/* Contacts */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 bg-primary/10 dark:bg-gold/10 p-2 rounded-full text-primary dark:text-gold shrink-0">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Call / Contacts</h3>
                    <div className="flex flex-col mt-1 text-neutral-500 dark:text-neutral-400 space-y-1">
                      {contactNumbers.map((phone: string, idx: number) => {
                        const name = idx === 0 ? "Naresh Kumar Patel" : idx === 1 ? "Kamlesh Kumar Patel" : `Contact ${idx + 1}`;
                        return (
                          <a key={idx} href={`tel:${phone}`} className="hover:text-primary dark:hover:text-gold transition-colors">
                            {name}: <strong>{phone}</strong>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 bg-primary/10 dark:bg-gold/10 p-2 rounded-full text-primary dark:text-gold shrink-0">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Email Address</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                      <a href="mailto:info@pateltenthouse.com" className="hover:text-primary dark:hover:text-gold transition-colors">
                        info@pateltenthouse.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 bg-primary/10 dark:bg-gold/10 p-2 rounded-full text-primary dark:text-gold shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Operating Hours</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                      Open 24 Hours / 7 Days<br />
                      <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block mt-1">
                        (Active during wedding seasons)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <a
                  href={`tel:${primaryPhone}`}
                  className="w-full py-2.5 rounded-xl border border-primary dark:border-gold text-primary dark:text-gold font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-primary dark:hover:bg-gold hover:text-white dark:hover:text-neutral-900 transition-all cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Primary</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 fill-white" />
                  <span>WhatsApp Primary</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Jayramnagar+Bilaspur+Chhattisgarh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-700"
                >
                  <Map className="h-4 w-4 text-gold" />
                  <span>View Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form & Maps Iframe (Right 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-gold/15 dark:border-gold/30 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white border-b pb-3 border-gold/10 dark:border-gold/20">
                Send Direct Message
              </h2>

              {success ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-xs sm:text-sm flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-green-600 shrink-0" />
                  <span>
                    <strong>Message Drafted!</strong> Redirecting you to WhatsApp to dispatch your message. Thank you for connecting with us!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder="Naresh Patel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        placeholder={primaryPhone}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">Inquiry Subject</label>
                    <select
                      value={inquiry.subject}
                      onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800 bg-white"
                    >
                      <option>Booking Query</option>
                      <option>Custom Quotation</option>
                      <option>Review Submission</option>
                      <option>Other Queries</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">Message / Inquiry Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder="Write your event dates and required items (Chairs, Stage details)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition-transform gold-border cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{loading ? "Drafting..." : "Send Message via WhatsApp"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Google Map Mock Iframe or link */}
            <div className="rounded-2xl overflow-hidden h-72 border border-gold/15 shadow-sm relative bg-neutral-200">
              <iframe
                title="Patel Tent House Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14699.288258356976!2d82.25997232230006!3d22.023447953257805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a280e7225fb8423%3A0xe9634e7cb8a994ef!2sJayramnagar%2C%20Chhattisgarh%20495661!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale opacity-80"
                allowFullScreen
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-semibold gold-border shadow-md text-neutral-800 dark:text-neutral-200">
                Gram Bhelai, PO Jayramnagar, Bilaspur, CG
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
