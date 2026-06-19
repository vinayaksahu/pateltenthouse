import { isFirebaseConfigured, db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import {
  Booking,
  Package,
  Review,
  GalleryItem,
  ServiceItem,
  AvailabilityBlock,
  BusinessSettings,
  RentalItem
} from "../types";

// ==========================================
// DEFAULT SAMPLE DATA FOR LOCAL FALLBACK
// ==========================================

const DEFAULT_RENTAL_ITEMS: RentalItem[] = [
  { id: "chairs", name: "Chairs", nameHi: "कुर्सियां", pricePerUnit: 15, unit: "piece", category: "Seating" },
  { id: "lights", name: "Lights Setup", nameHi: "लाइट्स सेटअप", pricePerUnit: 100, unit: "light", category: "Lighting" },
  { id: "coolers", name: "Cooler", nameHi: "कूलर", pricePerUnit: 1500, unit: "cooler", category: "Cooling" },
  { id: "stage", name: "Stage (Decoration & Setup)", nameHi: "मंच (सजावट और सेटअप)", pricePerUnit: 5000, unit: "set", category: "Decoration" },
  { id: "mandap", name: "Mandap Set", nameHi: "मंडप सेट", pricePerUnit: 4000, unit: "set", category: "Decoration" },
  { id: "gate", name: "Welcome Gate", nameHi: "स्वागत द्वार", pricePerUnit: 2000, unit: "gate", category: "Decoration" },
  { id: "pipe_set", name: "Chandni Pipe Set", nameHi: "चांदनी पाइप सेट", pricePerUnit: 500, unit: "set", category: "Structure" },
  { id: "parda", name: "Curtains (Parda)", nameHi: "पर्दा", pricePerUnit: 100, unit: "piece", category: "Draping" },
  { id: "carpet", name: "Carpet", nameHi: "कालीन (कारपेट)", pricePerUnit: 150, unit: "piece", category: "Flooring" },
  { id: "dari", name: "Dari", nameHi: "दरी", pricePerUnit: 100, unit: "piece", category: "Flooring" },
  { id: "balloon", name: "Balloon Decoration", nameHi: "गुब्बारे की सजावट", pricePerUnit: 1500, unit: "event", category: "Decoration" },
];

const DEFAULT_PACKAGES: Package[] = [
  {
    id: "silver",
    name: "Silver Package",
    price: 8000,
    includes: [
      "Chandni Pipe Set (4)",
      "Parda (6)",
      "Carpet (3)",
      "Light (4)",
      "Chair (20)",
      "Dari (4)",
      "Welcome Gate (1)"
    ],
    isActive: true
  },
  {
    id: "gold",
    name: "Gold Package",
    price: 15000,
    includes: [
      "Chandni Pipe Set (6)",
      "Parda (10)",
      "Carpet (3)",
      "Light (4)",
      "Chair (30)",
      "Dari (5)",
      "Cooler (1)",
      "Mandap Set (1)",
      "Welcome Gate (1)"
    ],
    isActive: true
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 25000,
    includes: [
      "Chandni Pipe Set (6)",
      "Parda (10)",
      "Carpet (3)",
      "Light (4)",
      "Chair (50)",
      "Dari (5)",
      "Cooler (2)",
      "Mandap Set (1)",
      "Welcome Gate (1)",
      "Stage (1)",
      "Balloon Decoration (1)"
    ],
    isPopular: true,
    isActive: true
  }
];

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "s1", name: "Wedding Tent Setup", description: "Premium grand tent layouts using top quality structures and rich fabrics.", iconName: "Tent", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" },
  { id: "s2", name: "Mandap Decoration", description: "Traditional and modern royal mandap themes embellished with luxury decor.", iconName: "Heart", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" },
  { id: "s3", name: "Stage Decoration", description: "Splendid wedding and reception stage setups that look outstanding on photos.", iconName: "Sparkles", imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80" },
  { id: "s4", name: "Welcome Gate", description: "Elegant welcome archways featuring beautiful flowers, lighting, and curtains.", iconName: "DoorClosed", imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80" },
  { id: "s5", name: "Lighting Setup", description: "Stunning ambient lighting, serial lights, chandeliers, and decorative fixtures.", iconName: "Lightbulb", imageUrl: "https://images.unsplash.com/photo-1504437484261-41961595c87a?auto=format&fit=crop&w=800&q=80" },
  { id: "s6", name: "Carpet Setup", description: "Neat, clean, and royal carpet laying across the entryways and main halls.", iconName: "Grid", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
  { id: "s7", name: "Chair Rental", description: "Premium comfortable banquet chairs with matching satin seat covers.", iconName: "Armchair", imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80" },
  { id: "s8", name: "Cooler Rental", description: "High-power air coolers to keep guests comfortable during hot summer events.", iconName: "Wind", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
  { id: "s9", name: "Balloon Decoration", description: "Beautiful balloon arches, backdrops, and pillars for kids' events and birthdays.", iconName: "Smile", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80" },
  { id: "s10", name: "Birthday Decoration", description: "Vibrant custom themes, banners, LED lights, and photo booths.", iconName: "Cake", imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80" },
  { id: "s11", name: "Religious Event Setup", description: "Pious mandap and stage decorations for Puja, Katha, Jagran, and Satsangs.", iconName: "Flame", imageUrl: "https://images.unsplash.com/photo-1609137144813-911e2f9d5045?auto=format&fit=crop&w=800&q=80" },
  { id: "s12", name: "Engagement Decoration", description: "Luxurious ring ceremony backdrops and photo-worthy stage decoration.", iconName: "Flower", imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80" },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: "r1", customerName: "Rakesh Kumar Patel", rating: 5, comment: "Excellent Service! The team handled our entire wedding mandap and stage setup beautifully. Everything was clean and on time.", isApproved: true, createdAt: "2026-05-15" },
  { id: "r2", customerName: "Sanjay Chandrakar", rating: 5, comment: "Affordable and Quality Setup. They have the best collection of carpets, chairs, and modern lighting systems in Bilaspur.", isApproved: true, createdAt: "2026-05-28" },
  { id: "r3", customerName: "Manish Sahu", rating: 5, comment: "Best Tent House in the Area. Very professional behavior. Naresh ji and Kamlesh ji were extremely supportive.", isApproved: true, createdAt: "2026-06-10" }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g1", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", category: "wedding", title: "Royal Red Wedding Tent Setup" },
  { id: "g2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", category: "mandap", title: "Traditional Floral Mandap" },
  { id: "g3", imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80", category: "stage", title: "Golden Theme Stage Decoration" },
  { id: "g4", imageUrl: "https://images.unsplash.com/photo-1504437484261-41961595c87a?auto=format&fit=crop&w=800&q=80", category: "lighting", title: "Chandelier and LED Ambient Lights" },
  { id: "g5", imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80", category: "decoration", title: "Luxury Entry Welcome Gate" },
  { id: "g6", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80", category: "birthday", title: "Whimsical Birthday Decoration" },
  { id: "g7", imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80", category: "wedding", title: "Luxury Outdoor Reception Hall" },
  { id: "g8", imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80", category: "decoration", title: "Fairy Lights Pathway Entrance" }
];

const DEFAULT_SETTINGS: BusinessSettings = {
  id: "default_settings",
  businessName: "Patel Tent House",
  tagline: "आपके हर शुभ अवसर को बनाएं खास",
  location: "Gram Bhelai, PO Jayramnagar, Bilaspur, Chhattisgarh, India",
  contactNumbers: ["9713661625", "7000297079"],
  gstRate: 18,
  rentalItems: DEFAULT_RENTAL_ITEMS
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "B-8472",
    customerName: "Raman Patel",
    mobileNumber: "9876543210",
    whatsappNumber: "9876543210",
    villageCity: "Jayramnagar",
    eventAddress: "Near Shiva Temple, Jayramnagar",
    eventDate: "2026-06-25",
    eventTime: "18:00",
    eventType: "Wedding",
    expectedGuests: 300,
    packageType: "gold",
    subtotal: 15000,
    gst: 2700,
    grandTotal: 17700,
    status: "approved",
    createdAt: "2026-06-10T12:00:00Z"
  },
  {
    id: "B-3291",
    customerName: "Anil Sahu",
    mobileNumber: "7778889990",
    whatsappNumber: "7778889990",
    villageCity: "Bilaspur",
    eventAddress: "Vikas Nagar, Sector 2, Bilaspur",
    eventDate: "2026-06-30",
    eventTime: "11:00",
    eventType: "Birthday",
    expectedGuests: 100,
    packageType: "custom",
    selectedItems: [
      { itemId: "chairs", name: "Chairs", quantity: 150, pricePerUnit: 15, total: 2250 },
      { itemId: "lights", name: "Lights Setup", quantity: 5, pricePerUnit: 100, total: 500 },
      { itemId: "balloon", name: "Balloon Decoration", quantity: 1, pricePerUnit: 1500, total: 1500 }
    ],
    subtotal: 4250,
    gst: 765,
    grandTotal: 5015,
    status: "pending",
    createdAt: "2026-06-18T15:30:00Z"
  }
];

const DEFAULT_AVAILABILITY: AvailabilityBlock[] = [
  { id: "a1", date: "2026-06-25", status: "booked", reason: "Wedding of Raman Patel" },
  { id: "a2", date: "2026-06-28", status: "blocked", reason: "Maintenance & Inventory Count" }
];

// ==========================================
// LOCAL STORAGE INITIALIZATION ENGINE
// ==========================================

const getLocal = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ==========================================
// DB INTERFACE EXPORTS
// ==========================================

// --- SETTINGS ---
export async function getSettings(): Promise<BusinessSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, "settings", "general"));
      if (snap.exists()) {
        return snap.data() as BusinessSettings;
      }
      // Populate defaults in Firebase if not exists
      await setDoc(doc(db, "settings", "general"), DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } catch (e) {
      console.error("Firestore getSettings failed. Falling back.", e);
    }
  }
  return getLocal("pth_settings", DEFAULT_SETTINGS);
}

export async function saveSettings(settings: BusinessSettings): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "settings", "general"), settings);
      return;
    } catch (e) {
      console.error("Firestore saveSettings failed.", e);
    }
  }
  setLocal("pth_settings", settings);
}

// --- PACKAGES ---
export async function getPackages(): Promise<Package[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "packages"));
      if (!snap.empty) {
        const pkgs: Package[] = [];
        snap.forEach((doc) => pkgs.push({ id: doc.id, ...doc.data() } as Package));
        return pkgs;
      }
      // Populate defaults in Firebase
      for (const p of DEFAULT_PACKAGES) {
        await setDoc(doc(db, "packages", p.id), p);
      }
      return DEFAULT_PACKAGES;
    } catch (e) {
      console.error("Firestore getPackages failed.", e);
    }
  }
  return getLocal("pth_packages", DEFAULT_PACKAGES);
}

export async function savePackage(pkg: Package): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "packages", pkg.id), pkg);
      return;
    } catch (e) {
      console.error("Firestore savePackage failed.", e);
    }
  }
  const pkgs = getLocal("pth_packages", DEFAULT_PACKAGES);
  const idx = pkgs.findIndex((p) => p.id === pkg.id);
  if (idx > -1) {
    pkgs[idx] = pkg;
  } else {
    pkgs.push(pkg);
  }
  setLocal("pth_packages", pkgs);
}

// --- BOOKINGS ---
export async function getBookings(): Promise<Booking[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "bookings"));
      const bookings: Booking[] = [];
      snap.forEach((doc) => bookings.push({ id: doc.id, ...doc.data() } as Booking));
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Firestore getBookings failed.", e);
    }
  }
  return getLocal("pth_bookings", DEFAULT_BOOKINGS).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createBooking(booking: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
  const id = `B-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();
  const newBooking: Booking = { ...booking, id, createdAt };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "bookings", id), newBooking);
      
      // Also register in availability calendar if approved
      if (newBooking.status === "approved" || newBooking.status === "pending") {
        await setDoc(doc(db, "availability", newBooking.eventDate), {
          id: newBooking.eventDate,
          date: newBooking.eventDate,
          status: newBooking.status === "approved" ? "booked" : "pending",
          reason: `${newBooking.eventType} booking for ${newBooking.customerName}`
        });
      }
      return newBooking;
    } catch (e) {
      console.error("Firestore createBooking failed.", e);
    }
  }

  const bookings = getLocal("pth_bookings", DEFAULT_BOOKINGS);
  bookings.push(newBooking);
  setLocal("pth_bookings", bookings);

  // Sync with local calendar
  if (newBooking.status === "approved" || newBooking.status === "pending") {
    const calendar = getLocal("pth_availability", DEFAULT_AVAILABILITY);
    const existingIdx = calendar.findIndex((a) => a.date === newBooking.eventDate);
    const newBlock: AvailabilityBlock = {
      id: newBooking.eventDate,
      date: newBooking.eventDate,
      status: newBooking.status === "approved" ? "booked" : "pending",
      reason: `${newBooking.eventType} booking for ${newBooking.customerName}`
    };
    if (existingIdx > -1) {
      calendar[existingIdx] = newBlock;
    } else {
      calendar.push(newBlock);
    }
    setLocal("pth_availability", calendar);
  }

  return newBooking;
}

export async function updateBookingStatus(id: string, status: Booking["status"]): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      // Update associated calendar date if present
      const bookingSnap = await getDoc(doc(db, "bookings", id));
      if (bookingSnap.exists()) {
        const booking = bookingSnap.data() as Booking;
        if (status === "approved") {
          await setDoc(doc(db, "availability", booking.eventDate), {
            id: booking.eventDate,
            date: booking.eventDate,
            status: "booked",
            reason: `${booking.eventType} booking for ${booking.customerName}`
          });
        } else if (status === "rejected") {
          // Check if we should delete or set to available
          await deleteDoc(doc(db, "availability", booking.eventDate));
        }
      }
      return;
    } catch (e) {
      console.error("Firestore updateBookingStatus failed.", e);
    }
  }

  const bookings = getLocal("pth_bookings", DEFAULT_BOOKINGS);
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx > -1) {
    bookings[idx].status = status;
    setLocal("pth_bookings", bookings);

    const booking = bookings[idx];
    const calendar = getLocal("pth_availability", DEFAULT_AVAILABILITY);
    const calIdx = calendar.findIndex((c) => c.date === booking.eventDate);

    if (status === "approved") {
      const newBlock: AvailabilityBlock = {
        id: booking.eventDate,
        date: booking.eventDate,
        status: "booked",
        reason: `${booking.eventType} booking for ${booking.customerName}`
      };
      if (calIdx > -1) {
        calendar[calIdx] = newBlock;
      } else {
        calendar.push(newBlock);
      }
      setLocal("pth_availability", calendar);
    } else if (status === "rejected" && calIdx > -1) {
      calendar.splice(calIdx, 1);
      setLocal("pth_availability", calendar);
    }
  }
}

// --- REVIEWS ---
export async function getReviews(onlyApproved = true): Promise<Review[]> {
  if (isFirebaseConfigured && db) {
    try {
      let q = collection(db, "reviews");
      const snap = await getDocs(q);
      const reviews: Review[] = [];
      snap.forEach((doc) => {
        const data = doc.data() as Review;
        if (!onlyApproved || data.isApproved) {
          reviews.push({ ...data, id: doc.id });
        }
      });
      return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Firestore getReviews failed.", e);
    }
  }
  const localReviews = getLocal("pth_reviews", DEFAULT_REVIEWS);
  const filtered = onlyApproved ? localReviews.filter((r) => r.isApproved) : localReviews;
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addReview(review: Omit<Review, "id" | "isApproved" | "createdAt">): Promise<Review> {
  const id = `R-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString().split("T")[0];
  const newReview: Review = { ...review, id, isApproved: false, createdAt };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "reviews", id), newReview);
      return newReview;
    } catch (e) {
      console.error("Firestore addReview failed.", e);
    }
  }

  const reviews = getLocal("pth_reviews", DEFAULT_REVIEWS);
  reviews.push(newReview);
  setLocal("pth_reviews", reviews);
  return newReview;
}

export async function approveReview(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "reviews", id), { isApproved: true });
      return;
    } catch (e) {
      console.error("Firestore approveReview failed.", e);
    }
  }

  const reviews = getLocal("pth_reviews", DEFAULT_REVIEWS);
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx > -1) {
    reviews[idx].isApproved = true;
    setLocal("pth_reviews", reviews);
  }
}

export async function deleteReview(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "reviews", id));
      return;
    } catch (e) {
      console.error("Firestore deleteReview failed.", e);
    }
  }

  const reviews = getLocal("pth_reviews", DEFAULT_REVIEWS);
  const filtered = reviews.filter((r) => r.id !== id);
  setLocal("pth_reviews", filtered);
}

// --- GALLERY ---
export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      if (!snap.empty) {
        const items: GalleryItem[] = [];
        snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as GalleryItem));
        return items;
      }
      // Populate defaults
      for (const item of DEFAULT_GALLERY) {
        await setDoc(doc(db, "gallery", item.id), item);
      }
      return DEFAULT_GALLERY;
    } catch (e) {
      console.error("Firestore getGalleryItems failed.", e);
    }
  }
  return getLocal("pth_gallery", DEFAULT_GALLERY);
}

export async function addGalleryItem(item: Omit<GalleryItem, "id">): Promise<GalleryItem> {
  const id = `G-${Math.floor(1000 + Math.random() * 9000)}`;
  const newItem = { id, ...item };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "gallery", id), newItem);
      return newItem;
    } catch (e) {
      console.error("Firestore addGalleryItem failed.", e);
    }
  }

  const items = getLocal("pth_gallery", DEFAULT_GALLERY);
  items.push(newItem);
  setLocal("pth_gallery", items);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "gallery", id));
      return;
    } catch (e) {
      console.error("Firestore deleteGalleryItem failed.", e);
    }
  }

  const items = getLocal("pth_gallery", DEFAULT_GALLERY);
  const filtered = items.filter((item) => item.id !== id);
  setLocal("pth_gallery", filtered);
}

// --- SERVICES ---
export async function getServices(): Promise<ServiceItem[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "services"));
      if (!snap.empty) {
        const items: ServiceItem[] = [];
        snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as ServiceItem));
        return items;
      }
      // Populate defaults
      for (const s of DEFAULT_SERVICES) {
        await setDoc(doc(db, "services", s.id), s);
      }
      return DEFAULT_SERVICES;
    } catch (e) {
      console.error("Firestore getServices failed.", e);
    }
  }
  return getLocal("pth_services", DEFAULT_SERVICES);
}

// --- AVAILABILITY CALENDAR ---
export async function getAvailability(): Promise<AvailabilityBlock[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "availability"));
      const items: AvailabilityBlock[] = [];
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as AvailabilityBlock));
      return items;
    } catch (e) {
      console.error("Firestore getAvailability failed.", e);
    }
  }
  return getLocal("pth_availability", DEFAULT_AVAILABILITY);
}

export async function blockDate(date: string, status: "booked" | "blocked" | "pending", reason?: string): Promise<void> {
  const block: AvailabilityBlock = { id: date, date, status, reason };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "availability", date), block);
      return;
    } catch (e) {
      console.error("Firestore blockDate failed.", e);
    }
  }

  const calendar = getLocal("pth_availability", DEFAULT_AVAILABILITY);
  const idx = calendar.findIndex((c) => c.date === date);
  if (idx > -1) {
    calendar[idx] = block;
  } else {
    calendar.push(block);
  }
  setLocal("pth_availability", calendar);
}

export async function unblockDate(date: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "availability", date));
      return;
    } catch (e) {
      console.error("Firestore unblockDate failed.", e);
    }
  }

  const calendar = getLocal("pth_availability", DEFAULT_AVAILABILITY);
  const filtered = calendar.filter((c) => c.date !== date);
  setLocal("pth_availability", filtered);
}
