import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

import { Providers } from "@/components/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patel Tent House | Premium Event & Wedding Decorations Bilaspur",
  description: "Patel Tent House offers premium wedding decoration, mandap setup, lighting, stage decor, and event rental services in Bilaspur, Chhattisgarh. Create your perfect package today.",
  keywords: ["Tent House Near Me", "Wedding Tent House", "Tent House Bilaspur", "Tent House Jayramnagar", "Mandap Decoration", "Wedding Decoration", "Event Rental Service"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Patel Tent House",
    "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    "url": "https://pateltenthouse.com",
    "telephone": "+919713661625",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gram Bhelai, PO Jayramnagar",
      "addressLocality": "Bilaspur",
      "addressRegion": "Chhattisgarh",
      "postalCode": "495661",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.0234,
      "longitude": 82.2599
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-gold selection:text-white">
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `
            }}
          />
          <Header />
          <main className="flex-grow pt-16 sm:pt-20">
            {children}
          </main>
          <Footer />
          <FloatingCTA />
        </Providers>
      </body>
    </html>
  );
}




