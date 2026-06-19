export interface RentalItem {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string; // e.g., "piece", "set", "day"
  category: string;
}

export interface Booking {
  id: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  villageCity: string;
  eventAddress: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string;
  eventType: string; // "Wedding" | "Reception" | "Engagement" | "Birthday" | "Religious Event" | "Anniversary" | "Other"
  expectedGuests: number;
  packageType: "silver" | "gold" | "premium" | "custom";
  additionalRequirements?: string;
  selectedItems?: {
    itemId: string;
    name: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  }[];
  subtotal: number;
  gst: number;
  grandTotal: number;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  includes: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  photoUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: "wedding" | "mandap" | "stage" | "lighting" | "decoration" | "birthday";
  title: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  imageUrl: string;
}

export interface AvailabilityBlock {
  id: string;
  date: string; // YYYY-MM-DD
  status: "booked" | "blocked" | "pending";
  reason?: string;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  tagline: string;
  location: string;
  contactNumbers: string[];
  gstRate: number; // e.g. 18 for 18% GST, 0 for none
  rentalItems: RentalItem[];
}
