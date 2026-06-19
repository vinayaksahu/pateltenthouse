"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingCTA from "./FloatingCTA";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main className={isAdmin ? "min-h-screen" : "flex-grow pt-16 sm:pt-20"}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingCTA />}
    </>
  );
}
