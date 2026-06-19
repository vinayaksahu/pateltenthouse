"use client";

import { useEffect, useState } from "react";
import { getReviews, addReview } from "@/lib/db";
import { Review } from "@/types";
import { Star, CheckCircle, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Submit Form State
  const [form, setForm] = useState({
    customerName: "",
    rating: 5,
    comment: ""
  });
  
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function load() {
    const data = await getReviews(true); // only approved
    setReviews(data);
  }

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.comment) {
      alert("Please fill in both Name and Comment fields.");
      return;
    }

    setLoading(true);
    try {
      await addReview({
        customerName: form.customerName,
        rating: form.rating,
        comment: form.comment
      });
      setSuccess(true);
      setForm({ customerName: "", rating: 5, comment: "" });
      
      // reload reviews list
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (e) {
      console.error(e);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-primary dark:text-gold font-bold text-xs uppercase tracking-wider block">
            Testimonials
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-neutral-900 dark:text-white">
            Reviews & Customer Feedback
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-sans">
            Hear from our satisfied clients about their experiences, or submit your own review to help us keep improving.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Submit Review Card (Right Column) */}
          <div className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-gold/15 dark:border-gold/30 shadow-sm space-y-5 h-fit lg:sticky lg:top-24 order-2 lg:order-2">
            <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-white border-b pb-3 border-gold/10 dark:border-gold/20">
              Submit Your Review
            </h2>

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="review-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">Rating</label>
                    <div className="flex items-center space-x-1.5 pt-1">
                      {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setForm({ ...form, rating: starValue })}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-0.5 text-neutral-300 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                starValue <= (hoverRating || form.rating)
                                  ? "fill-gold text-gold"
                                  : "text-neutral-200 dark:text-neutral-700"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300">Comment / Review</label>
                    <textarea
                      rows={4}
                      required
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="How was the tent quality, mandap design, and team behavior?"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white focus:outline-none focus:border-gold text-neutral-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition-transform gold-border cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? "Submitting..." : "Submit Review"}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="review-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Review Submitted!</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      Thank you! Your feedback has been recorded and will show on the website as soon as it is approved by the admin.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reviews List (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-1">
            <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary dark:text-gold" /> Approved Customer Testimonials
            </h2>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-3.5"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-gold/10 text-primary dark:text-gold flex items-center justify-center font-serif font-bold text-sm">
                        {rev.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {rev.customerName}
                        </h4>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{rev.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex text-gold space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? "fill-gold text-gold" : "text-neutral-200 dark:text-neutral-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 italic font-sans text-xs sm:text-sm leading-relaxed pl-12 border-l-2 border-gold/20 dark:border-gold/40">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-20 text-neutral-400 text-sm">
                  No testimonials found. Be the first to leave one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
