"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8.5 h-8.5 rounded-full border border-gold/20" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full border border-gold/30 hover:border-gold text-gold transition-colors hover:bg-primary/5 cursor-pointer flex items-center justify-center"
      aria-label="Toggle dark/light mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-gold hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-gold hover:-rotate-12 transition-transform" />
      )}
    </motion.button>
  );
}
