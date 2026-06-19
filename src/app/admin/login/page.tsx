"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isFirebaseConfigured, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, Tent, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Set local storage session
        localStorage.setItem("pth_admin_session", "true");
        router.push("/admin/dashboard");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Mock Fallback Auth
      setTimeout(() => {
        if (email === "admin@pateltenthouse.com" && password === "admin12345") {
          localStorage.setItem("pth_admin_session", "true");
          router.push("/admin/dashboard");
        } else {
          setError("Invalid email or password. (Use admin@pateltenthouse.com / admin12345)");
        }
        setLoading(false);
      }, 800);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-neutral-900/50 backdrop-blur-md p-8 rounded-2xl border border-gold/20 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full royal-red-gradient flex items-center justify-center mx-auto gold-border shadow-md">
            <Tent className="h-6 w-6 text-gold" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Admin Portal Access
          </h2>
          <p className="text-xs text-gold uppercase tracking-widest font-semibold">
            Patel Tent House
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center space-x-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-neutral-300 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pateltenthouse.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-gold text-white placeholder-neutral-700 font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-neutral-300 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-neutral-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-gold text-white placeholder-neutral-700 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition-transform gold-border cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Login"}</span>
            <ArrowRight className="h-3.5 w-3.5 text-gold" />
          </button>
        </form>

        <div className="text-center pt-2 text-[10px] text-neutral-500">
          <span>Not connected to Firebase? Default fallback: <strong>admin@pateltenthouse.com</strong> / <strong>admin12345</strong></span>
        </div>
      </div>
    </div>
  );
}
