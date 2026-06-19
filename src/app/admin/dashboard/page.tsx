"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getBookings,
  getPackages,
  getAvailability,
  getReviews,
  getSettings,
  updateBookingStatus,
  savePackage,
  blockDate,
  unblockDate,
  approveReview,
  deleteReview,
  saveSettings,
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem
} from "@/lib/db";
import {
  Booking,
  Package,
  Review,
  AvailabilityBlock,
  BusinessSettings,
  RentalItem,
  GalleryItem
} from "@/types";
import {
  BarChart,
  Calendar,
  Layers,
  Settings as SettingsIcon,
  Star,
  Users,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Search,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  AlertTriangle,
  Lock,
  Heart,
  Bell,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

// Auspicious Hindu Marriage Dates (Vivah Muhurats) for 2026/2027
const MUHURAT_DATES = [
  // 2026
  { date: "2026-02-05", label: "Magha Shukla Tritiya" },
  { date: "2026-02-06", label: "Magha Shukla Chaturthi" },
  { date: "2026-02-08", label: "Magha Shukla Shashthi" },
  { date: "2026-02-10", label: "Magha Shukla Ashtami" },
  { date: "2026-02-12", label: "Magha Shukla Dashami" },
  { date: "2026-02-14", label: "Magha Krishna Dwadashi" },
  { date: "2026-02-19", label: "Phalguna Shukla Dwitiya" },
  { date: "2026-02-20", label: "Phalguna Shukla Tritiya" },
  { date: "2026-02-21", label: "Phalguna Shukla Chaturthi" },
  { date: "2026-02-24", label: "Phalguna Shukla Saptami" },
  { date: "2026-02-25", label: "Phalguna Shukla Ashtami" },
  { date: "2026-02-26", label: "Phalguna Shukla Navami" },
  { date: "2026-03-02", label: "Phalguna Shukla Dwadashi" },
  { date: "2026-03-03", label: "Phalguna Shukla Trayodashi" },
  { date: "2026-03-04", label: "Phalguna Shukla Chaturdashi" },
  { date: "2026-03-07", label: "Phalguna Krishna Tritiya" },
  { date: "2026-03-08", label: "Phalguna Krishna Chaturthi" },
  { date: "2026-03-09", label: "Phalguna Krishna Panchami" },
  { date: "2026-03-11", label: "Phalguna Krishna Saptami" },
  { date: "2026-03-12", label: "Phalguna Krishna Ashtami" },
  { date: "2026-04-15", label: "Chaitra Krishna Dwadashi" },
  { date: "2026-04-20", label: "Vaishakha Shukla Tritiya (Akshaya Tritiya)" },
  { date: "2026-04-21", label: "Vaishakha Shukla Chaturthi" },
  { date: "2026-04-25", label: "Vaishakha Shukla Ashtami" },
  { date: "2026-04-26", label: "Vaishakha Shukla Navami" },
  { date: "2026-04-27", label: "Vaishakha Shukla Dashami" },
  { date: "2026-04-28", label: "Vaishakha Shukla Ekadashi" },
  { date: "2026-04-29", label: "Vaishakha Shukla Dwadashi" },
  { date: "2026-05-01", label: "Vaishakha Shukla Chaturdashi" },
  { date: "2026-05-03", label: "Vaishakha Krishna Dwitiya" },
  { date: "2026-05-05", label: "Vaishakha Krishna Chaturthi" },
  { date: "2026-05-06", label: "Vaishakha Krishna Panchami" },
  { date: "2026-05-07", label: "Vaishakha Krishna Shashthi" },
  { date: "2026-05-08", label: "Vaishakha Krishna Saptami" },
  { date: "2026-05-13", label: "Vaishakha Krishna Dwadashi" },
  { date: "2026-05-14", label: "Vaishakha Krishna Trayodashi" },
  { date: "2026-06-21", label: "Ashadha Shukla Shashthi" },
  { date: "2026-06-22", label: "Ashadha Shukla Saptami" },
  { date: "2026-06-23", label: "Ashadha Shukla Ashtami" },
  { date: "2026-06-24", label: "Ashadha Shukla Navami" },
  { date: "2026-06-25", label: "Ashadha Shukla Dashami" },
  { date: "2026-06-26", label: "Ashadha Shukla Ekadashi" },
  { date: "2026-06-27", label: "Ashadha Shukla Dwadashi" },
  { date: "2026-06-29", label: "Ashadha Shukla Chaturdashi" },
  { date: "2026-07-01", label: "Ashadha Krishna Dwitiya" },
  { date: "2026-07-06", label: "Ashadha Krishna Saptami" },
  { date: "2026-07-07", label: "Ashadha Krishna Ashtami" },
  { date: "2026-07-11", label: "Ashadha Krishna Dwadashi" },
  { date: "2026-11-21", label: "Kartika Shukla Ekadashi (Dev Uthani)" },
  { date: "2026-11-24", label: "Kartika Shukla Chaturdashi" },
  { date: "2026-11-25", label: "Kartika Purnima" },
  { date: "2026-11-26", label: "Margashirsha Krishna Pratipada" },
  { date: "2026-12-02", label: "Margashirsha Krishna Ashtami" },
  { date: "2026-12-03", label: "Margashirsha Krishna Navami" },
  { date: "2026-12-04", label: "Margashirsha Krishna Dashami" },
  { date: "2026-12-05", label: "Margashirsha Krishna Ekadashi" },
  { date: "2026-12-06", label: "Margashirsha Krishna Dwadashi" },
  { date: "2026-12-11", label: "Margashirsha Shukla Dwitiya" },
  { date: "2026-12-12", label: "Margashirsha Shukla Tritiya" },

  // 2027
  { date: "2027-01-15", label: "Pausha Shukla Ashtami" },
  { date: "2027-01-18", label: "Pausha Shukla Ekadashi" },
  { date: "2027-01-19", label: "Pausha Shukla Dwadashi" },
  { date: "2027-01-20", label: "Pausha Shukla Trayodashi" },
  { date: "2027-01-24", label: "Pausha Krishna Dwitiya" },
  { date: "2027-01-26", label: "Pausha Krishna Chaturthi" },
  { date: "2027-01-27", label: "Pausha Krishna Panchami" },
  { date: "2027-01-30", label: "Pausha Krishna Ashtami" },
  { date: "2027-01-31", label: "Pausha Krishna Navami" },
  { date: "2027-02-02", label: "Pausha Krishna Ekadashi" },
  { date: "2027-02-03", label: "Pausha Krishna Dwadashi" },
  { date: "2027-02-09", label: "Magha Shukla Dwitiya" },
  { date: "2027-02-10", label: "Magha Shukla Tritiya" },
  { date: "2027-02-11", label: "Magha Shukla Chaturthi" },
  { date: "2027-02-14", label: "Magha Shukla Saptami" },
  { date: "2027-02-15", label: "Magha Shukla Ashtami" },
  { date: "2027-02-21", label: "Magha Krishna Dwitiya" },
  { date: "2027-02-22", label: "Magha Krishna Tritiya" },
  { date: "2027-02-25", label: "Magha Krishna ... " },
  { date: "2027-02-26", label: "Magha Krishna Saptami" },
  { date: "2027-02-27", label: "Magha Krishna Ashtami" },
  { date: "2027-02-28", label: "Magha Krishna Navami" },
  { date: "2027-03-02", label: "Magha Krishna Ekadashi" },
  { date: "2027-03-03", label: "Magha Krishna Dwadashi" },
  { date: "2027-03-09", label: "Phalguna Shukla Dwitiya" },
  { date: "2027-03-10", label: "Phalguna Shukla Tritiya" },
  { date: "2027-03-11", label: "Phalguna Shukla Chaturthi" },
  { date: "2027-03-14", label: "Phalguna Shukla Saptami" },
  { date: "2027-03-15", label: "Phalguna Shukla Ashtami" },
  { date: "2027-04-18", label: "Chaitra Shukla Ekadashi" },
  { date: "2027-04-19", label: "Chaitra Shukla Dwadashi" },
  { date: "2027-04-21", label: "Chaitra Shukla Chaturdashi" },
  { date: "2027-04-23", label: "Chaitra Krishna Pratipada" },
  { date: "2027-04-24", label: "Chaitra Krishna Dwitiya" },
  { date: "2027-04-25", label: "Chaitra Krishna Tritiya" },
  { date: "2027-04-26", label: "Chaitra Krishna Chaturthi" },
  { date: "2027-04-27", label: "Chaitra Krishna Panchami" },
  { date: "2027-04-28", label: "Chaitra Krishna Shashthi" },
  { date: "2027-05-04", label: "Vaishakha Shukla Dwitiya" },
  { date: "2027-05-07", label: "Vaishakha Shukla Panchami" },
  { date: "2027-05-08", label: "Vaishakha Shukla Shashthi" },
  { date: "2027-05-09", label: "Vaishakha Shukla Saptami" },
  { date: "2027-05-13", label: "Vaishakha Shukla Ekadashi" },
  { date: "2027-05-14", label: "Vaishakha Shukla Dwadashi" },
  { date: "2027-05-15", label: "Vaishakha Shukla Trayodashi" },
  { date: "2027-05-16", label: "Vaishakha Shukla Chaturdashi" },
  { date: "2027-05-17", label: "Vaishakha Purnima" },
  { date: "2027-05-18", label: "Jyeshtha Krishna Pratipada" },
  { date: "2027-05-19", label: "Jyeshtha Krishna Dwitiya" },
  { date: "2027-05-20", label: "Jyeshtha Krishna Tritiya" },
  { date: "2027-05-21", label: "Jyeshtha Krishna Chaturthi" },
  { date: "2027-05-22", label: "Jyeshtha Krishna Panchami" },
  { date: "2027-05-23", label: "Jyeshtha Krishna Shashthi" },
  { date: "2027-05-24", label: "Jyeshtha Krishna Saptami" },
  { date: "2027-05-25", label: "Jyeshtha Krishna Ashtami" },
  { date: "2027-05-30", label: "Jyeshtha Krishna Dwadashi" },
  { date: "2027-05-31", label: "Jyeshtha Krishna Trayodashi" },
  { date: "2027-06-01", label: "Jyeshtha Krishna Chaturdashi" },
  { date: "2027-06-05", label: "Jyeshtha Shukla Pratipada" },
  { date: "2027-06-09", label: "Jyeshtha Shukla Panchami" },
  { date: "2027-06-10", label: "Jyeshtha Shukla Shashthi" },
  { date: "2027-06-11", label: "Jyeshtha Shukla Saptami" },
  { date: "2027-06-12", label: "Jyeshtha Shukla Ashtami" },
  { date: "2027-06-13", label: "Jyeshtha Shukla Navami" },
  { date: "2027-06-15", label: "Jyeshtha Shukla Ekadashi" },
  { date: "2027-06-16", label: "Jyeshtha Shukla Dwadashi" },
  { date: "2027-06-17", label: "Jyeshtha Shukla Trayodashi" }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Database Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Gallery Management Form State
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState<"wedding" | "mandap" | "stage" | "lighting" | "decoration" | "birthday">("wedding");

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);

  // Muhurat filters
  const [muhuratYearFilter, setMuhuratYearFilter] = useState("all");
  const [muhuratMonthFilter, setMuhuratMonthFilter] = useState("all");

  // Editing Forms/Modals States
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);
  const [newItemModal, setNewItemModal] = useState(false);
  
  // Date blocker inputs
  const [blockDateInput, setBlockDateInput] = useState("");
  const [blockReasonInput, setBlockReasonInput] = useState("");
  const [blockStatusInput, setBlockStatusInput] = useState<"blocked" | "booked">("blocked");

  // Load and check Auth
  useEffect(() => {
    const session = localStorage.getItem("pth_admin_session");
    if (session !== "true") {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      loadAllData();
    }
  }, [router]);

  async function loadAllData() {
    try {
      const b = await getBookings();
      const p = await getPackages();
      const a = await getAvailability();
      const r = await getReviews(false); // get ALL reviews (unapproved too)
      const s = await getSettings();
      const g = await getGalleryItems();
      
      setBookings(b);
      setPackages(p);
      setAvailability(a);
      setReviews(r);
      setSettings(s);
      setGalleryItems(g);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("pth_admin_session");
    router.push("/admin/login");
  };

  // Action Handlers
  const handleApproveBooking = async (id: string) => {
    await updateBookingStatus(id, "approved");
    await loadAllData();
  };

  const handleRejectBooking = async (id: string) => {
    await updateBookingStatus(id, "rejected");
    await loadAllData();
  };

  const handleCompleteBooking = async (id: string) => {
    await updateBookingStatus(id, "completed");
    await loadAllData();
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    await blockDate(blockDateInput, blockStatusInput, blockReasonInput);
    setBlockDateInput("");
    setBlockReasonInput("");
    await loadAllData();
  };

  const handleUnblockDate = async (dateStr: string) => {
    await unblockDate(dateStr);
    await loadAllData();
  };

  const handleApproveReview = async (id: string) => {
    await approveReview(id);
    await loadAllData();
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      await loadAllData();
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    await savePackage(editingPkg);
    setEditingPkg(null);
    await loadAllData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await saveSettings(settings);
    alert("Settings updated successfully.");
    await loadAllData();
  };

  // Add/Edit Rental Item
  const handleSaveRentalItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !editingItem) return;
    
    const currentItems = [...settings.rentalItems];
    const idx = currentItems.findIndex((i) => i.id === editingItem.id);
    
    if (idx > -1) {
      currentItems[idx] = editingItem;
    } else {
      currentItems.push(editingItem);
    }

    const updatedSettings = { ...settings, rentalItems: currentItems };
    await saveSettings(updatedSettings);
    setEditingItem(null);
    setNewItemModal(false);
    await loadAllData();
  };

  const handleDeleteRentalItem = async (itemId: string) => {
    if (!settings) return;
    if (confirm("Are you sure you want to delete this item?")) {
      const filtered = settings.rentalItems.filter((i) => i.id !== itemId);
      const updated = { ...settings, rentalItems: filtered };
      await saveSettings(updated);
      await loadAllData();
    }
  };

  // Gallery Handlers
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl) return;
    try {
      await addGalleryItem({
        title: newGalleryTitle || "Work Showcase",
        imageUrl: newGalleryUrl,
        category: newGalleryCategory
      });
      setNewGalleryTitle("");
      setNewGalleryUrl("");
      await loadAllData();
      alert("Gallery image added successfully!");
    } catch (e) {
      console.error("Failed to add gallery item", e);
      alert("Error adding gallery image.");
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery image?")) {
      try {
        await deleteGalleryItem(id);
        await loadAllData();
      } catch (e) {
        console.error("Failed to delete gallery item", e);
      }
    }
  };

  // Muhurat toggle blocking handler
  const handleToggleMuhuratDate = async (dateStr: string, label: string) => {
    const existingBlock = availability.find((a) => a.date === dateStr);
    if (existingBlock) {
      if (confirm(`Do you want to unblock ${dateStr} (${label})?`)) {
        await unblockDate(dateStr);
        await loadAllData();
      }
    } else {
      if (confirm(`Do you want to block ${dateStr} (${label}) as a Muhurat?`)) {
        await blockDate(dateStr, "blocked", `Vivah Muhurat: ${label}`);
        await loadAllData();
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = "Booking ID,Customer Name,Phone,Date,Event,Guests,Package,Subtotal,GST,Total,Status\n";
    const rows = bookings
      .map(
        (b) =>
          `"${b.id}","${b.customerName}","${b.mobileNumber}","${b.eventDate}","${b.eventType}",${b.expectedGuests},"${b.packageType}",${b.subtotal},${b.gst},${b.grandTotal},"${b.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Patel_Tent_House_Bookings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search and Filter bookings list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobileNumber.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Overview metrics calculations
  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((b) => b.status === "pending").length;
  const completedEvents = bookings.filter((b) => b.status === "completed").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "approved" || b.status === "completed")
    .reduce((acc, curr) => acc + curr.grandTotal, 0);

  // Revenue by package breakdown
  const packagePopularity = bookings.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.packageType] = (acc[curr.packageType] || 0) + 1;
    return acc;
  }, {});

  const mostPopularPackage = Object.entries(packagePopularity).sort((a, b) => b[1] - a[1])[0]?.[0] || "silver";

  // Simple custom flexbox visual bar chart data
  const upcomingEventsList = bookings
    .filter((b) => b.status === "approved" && new Date(b.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5);

  if (!authorized) {
    return <div className="text-center py-20 bg-cream dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">Authenticating access...</div>;
  }

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
      {/* Admin Navbar */}
      <div className="bg-neutral-950 text-white py-3 px-6 border-b border-gold/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full royal-red-gradient flex items-center justify-center gold-border">
            <Lock className="h-4 w-4 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-md font-bold">PTH Management Console</h1>
            <span className="text-[10px] text-gold tracking-widest uppercase font-semibold">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full border border-white/20 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer relative flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {bookings.filter(b => b.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {bookings.filter(b => b.status === "pending").length}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-gold/20 dark:border-gold/30 rounded-2xl shadow-xl z-50 p-4 text-xs max-h-96 overflow-y-auto text-neutral-800 dark:text-neutral-200"
                  >
                    <div className="flex justify-between items-center border-b pb-2 mb-3 dark:border-neutral-800">
                      <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">
                        New Booking Notifications
                      </h4>
                      <span className="text-[9px] bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">
                        {bookings.filter(b => b.status === "pending").length} Pending
                      </span>
                    </div>

                    <div className="space-y-2">
                      {bookings.filter(b => b.status === "pending").map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setActiveTab("bookings");
                            setSearchQuery(b.id);
                            setShowNotifications(false);
                          }}
                          className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-gold/30 dark:hover:border-gold/30 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-neutral-800 dark:text-neutral-150">
                              {b.customerName}
                            </span>
                            <span className="text-[8px] bg-gold/10 dark:bg-gold/20 text-gold px-1.5 py-0.5 rounded font-bold uppercase">
                              {b.packageType}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-450 mt-0.5">
                            Date: {b.eventDate} | {b.villageCity}
                          </p>
                          <div className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 flex justify-between items-center">
                            <span>ID: {b.id}</span>
                            <span className="text-primary dark:text-gold hover:underline font-semibold">
                              Manage Request →
                            </span>
                          </div>
                        </div>
                      ))}

                      {bookings.filter(b => b.status === "pending").length === 0 && (
                        <div className="py-6 text-center text-neutral-405 dark:text-neutral-550">
                          No pending booking requests.
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-neutral-400 hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-2xl border border-gold/15 dark:border-gold/30 p-5 shadow-sm space-y-4 h-fit">
          <h2 className="font-serif text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2 border-b dark:border-neutral-800 pb-2">
            Navigation Menu
          </h2>

          <nav className="flex flex-col space-y-2 text-xs sm:text-sm font-semibold">
            {[
              { id: "overview", label: "Dashboard Overview", icon: TrendingUp },
              { id: "bookings", label: "Bookings Manager", icon: FileSpreadsheet },
              { id: "calendar", label: "Availability Calendar", icon: Calendar },
              { id: "muhurat", label: "Vivah Muhurats", icon: Heart },
              { id: "gallery", label: "Gallery Moderator", icon: ImageIcon },
              { id: "packages", label: "Standard Packages", icon: Layers },
              { id: "items", label: "Rental Items & Price", icon: DollarSign },
              { id: "reviews", label: "Reviews Approvals", icon: Star },
              { id: "settings", label: "Console Settings", icon: SettingsIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary/10 dark:bg-gold/10 text-primary dark:text-gold border-l-4 border-gold"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary dark:hover:text-gold"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Display Area (Right 3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Total Revenue</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-primary block mt-1">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Total Requests</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 block mt-1">
                      {totalBookings}
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Pending Requests</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-amber-500 block mt-1">
                      {pendingRequests}
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Popular Package</span>
                    <span className="text-sm font-serif font-extrabold text-gold block mt-2.5 uppercase">
                      {mostPopularPackage}
                    </span>
                  </div>
                </div>

                {/* Upcoming Events & Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Custom CSS Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                    <h3 className="font-serif text-base font-bold text-neutral-800 border-b pb-2">
                      Revenue Performance
                    </h3>
                    <p className="text-[11px] text-neutral-400">Estimated booking packages contributions (Approved & Completed):</p>
                    
                    <div className="space-y-3.5 pt-3 text-xs">
                      {["silver", "gold", "premium", "custom"].map((pType) => {
                        const count = bookings
                          .filter((b) => (b.status === "approved" || b.status === "completed") && b.packageType === pType)
                          .length;
                        const share = totalBookings > 0 ? (count / totalBookings) * 100 : 0;
                        return (
                          <div key={pType} className="space-y-1">
                            <div className="flex justify-between font-semibold capitalize text-neutral-700">
                              <span>{pType} Package</span>
                              <span>{count} Bookings ({Math.round(share)}%)</span>
                            </div>
                            <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${share}%` }}
                                className="royal-red-gradient h-full rounded-full"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming list */}
                  <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                    <h3 className="font-serif text-base font-bold text-neutral-800 border-b pb-2">
                      Upcoming Approved Events
                    </h3>
                    
                    <div className="divide-y divide-neutral-100 text-xs">
                      {upcomingEventsList.length === 0 ? (
                        <p className="text-center py-10 text-neutral-400">No upcoming events scheduled.</p>
                      ) : (
                        upcomingEventsList.map((ue) => (
                          <div key={ue.id} className="py-2.5 flex justify-between items-center">
                            <div>
                              <strong className="text-neutral-800">{ue.customerName}</strong>
                              <div className="text-[10px] text-neutral-500">
                                {ue.eventType} • {ue.villageCity}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                              {ue.eventDate}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-gold/10 dark:border-neutral-850 gap-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">Bookings Database</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-405">Approve, complete, or reject client reservation submissions.</p>
                  </div>

                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-neutral-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by Name or Reference ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-cream border-b border-neutral-200">
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Ref ID</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Client Name</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Date & Event</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Package</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Grand Total</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700 text-center">Status</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-3 font-bold">{b.id}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold">{b.customerName}</div>
                            <div className="text-[10px] text-neutral-400">{b.mobileNumber}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-neutral-800">{b.eventDate}</div>
                            <div className="text-[10px] text-neutral-500 capitalize">{b.eventType} • {b.villageCity}</div>
                          </td>
                          <td className="py-3 px-3 capitalize font-semibold">{b.packageType}</td>
                          <td className="py-3 px-3 font-bold text-primary">₹{b.grandTotal.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                b.status === "pending"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : b.status === "approved"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : b.status === "completed"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1">
                            {b.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveBooking(b.id)}
                                  className="p-1 rounded bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 cursor-pointer"
                                  title="Approve Booking"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRejectBooking(b.id)}
                                  className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                                  title="Reject Booking"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            {b.status === "approved" && (
                              <button
                                onClick={() => handleCompleteBooking(b.id)}
                                className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-neutral-400">
                            No matching bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* CALENDAR BLOCK TAB */}
            {activeTab === "calendar" && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 border-b pb-2">
                    Block Calendar Dates
                  </h2>

                  <form onSubmit={handleBlockDate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs sm:text-sm">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Target Date</label>
                      <input
                        type="date"
                        required
                        value={blockDateInput}
                        onChange={(e) => setBlockDateInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">Block Status</label>
                      <select
                        value={blockStatusInput}
                        onChange={(e) => setBlockStatusInput(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold bg-white"
                      >
                        <option value="blocked">Blocked (Manual)</option>
                        <option value="booked">Booked (Reservation)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-neutral-700">Reason / Details</label>
                      <input
                        type="text"
                        value={blockReasonInput}
                        onChange={(e) => setBlockReasonInput(e.target.value)}
                        placeholder="Maintenance or Wedding details"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer"
                    >
                      Block Date
                    </button>
                  </form>
                </div>

                {/* Blocked Dates List */}
                <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-800 border-b pb-2">
                    Blocked Date Configurations
                  </h3>

                  <div className="divide-y divide-neutral-100 text-xs">
                    {availability.map((block) => (
                      <div key={block.id} className="py-3 flex justify-between items-center">
                        <div>
                          <strong className="text-neutral-800">{block.date}</strong>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              block.status === "booked" ? "bg-rose-100 text-rose-800" : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {block.status}
                          </span>
                          <div className="text-[10px] text-neutral-500 mt-0.5">{block.reason || "No reason specified."}</div>
                        </div>

                        <button
                          onClick={() => handleUnblockDate(block.date)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {availability.length === 0 && (
                      <p className="text-center py-10 text-neutral-400">No dates are currently blocked.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* HINDU MARRIAGE MUHURATS TAB */}
            {activeTab === "muhurat" && (
              <motion.div
                key="muhurat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Year and Month Filters */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 border-gold/10 gap-3">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Hindu Vivah Muhurat Calendar
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-405">
                        Auspicious marriage dates for 2026 & 2027. Instantly block dates on the Availability Calendar.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <select
                        value={muhuratYearFilter}
                        onChange={(e) => setMuhuratYearFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      >
                        <option value="all">All Years</option>
                        <option value="2026">2026 Only</option>
                        <option value="2027">2027 Only</option>
                      </select>

                      <select
                        value={muhuratMonthFilter}
                        onChange={(e) => setMuhuratMonthFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      >
                        <option value="all">All Months</option>
                        <option value="01">January (जनवरी)</option>
                        <option value="02">February (फरवरी)</option>
                        <option value="03">March (मार्च)</option>
                        <option value="04">April (अप्रैल)</option>
                        <option value="05">May (मई)</option>
                        <option value="06">June (जून)</option>
                        <option value="07">July (जुलाई)</option>
                        <option value="11">November (नवंबर)</option>
                        <option value="12">December (दिसंबर)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calendar Grid List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {MUHURAT_DATES.filter((item) => {
                      const year = item.date.split("-")[0];
                      const month = item.date.split("-")[1];
                      const matchesYear = muhuratYearFilter === "all" || year === muhuratYearFilter;
                      const matchesMonth = muhuratMonthFilter === "all" || month === muhuratMonthFilter;
                      return matchesYear && matchesMonth;
                    }).map((item) => {
                      const isBlocked = availability.find((a) => a.date === item.date);
                      const booking = bookings.find((b) => b.eventDate === item.date && b.status !== "rejected");
                      
                      let statusText = "Available";
                      let badgeColor = "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400";
                      
                      if (booking) {
                        statusText = `Booked (${booking.customerName})`;
                        badgeColor = "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455";
                      } else if (isBlocked) {
                        statusText = "Blocked (Manual)";
                        badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
                      }

                      // Format date nicely
                      const formattedDate = new Date(item.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      });

                      return (
                        <div
                          key={item.date}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 shadow-xs ${
                            booking
                              ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/5"
                              : isBlocked
                              ? "border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30"
                              : "border-gold/10 hover:border-gold/30 bg-white dark:bg-neutral-900 hover:shadow-sm"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center">
                              <strong className="text-neutral-800 dark:text-neutral-250 text-sm">
                                {formattedDate}
                              </strong>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${badgeColor}`}>
                                {statusText}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                              {item.label}
                            </p>
                            {booking && (
                              <div className="mt-2 p-1.5 rounded bg-neutral-50 dark:bg-neutral-800 text-[10px] space-y-0.5 border border-neutral-100 dark:border-neutral-700">
                                <div className="font-semibold text-neutral-700 dark:text-neutral-350 truncate">
                                  Client: {booking.customerName}
                                </div>
                                <div className="text-neutral-500">
                                  Type: {booking.eventType} | Status: <span className="font-bold">{booking.status}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            disabled={!!booking}
                            onClick={() => handleToggleMuhuratDate(item.date, item.label)}
                            className={`w-full py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer ${
                              booking
                                ? "border-neutral-205 text-neutral-400 bg-neutral-50 dark:bg-neutral-850 dark:border-neutral-700 cursor-not-allowed"
                                : isBlocked
                                ? "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                                : "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            }`}
                          >
                            {isBlocked ? "Unblock Date" : "Block Date"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* DECORATION GALLERY TAB */}
            {activeTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Add Gallery Item Form */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 border-b dark:border-neutral-800 pb-2">
                    Add New Gallery Image
                  </h2>

                  <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs sm:text-sm">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Title / Name</label>
                      <input
                        type="text"
                        required
                        value={newGalleryTitle}
                        onChange={(e) => setNewGalleryTitle(e.target.value)}
                        placeholder="e.g. Royal Red Wedding Tent"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Image URL</label>
                      <input
                        type="url"
                        required
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Category</label>
                      <select
                        value={newGalleryCategory}
                        onChange={(e) => setNewGalleryCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      >
                        <option value="wedding">Wedding (शादी)</option>
                        <option value="mandap">Mandap (मंडप)</option>
                        <option value="stage">Stage (मंच)</option>
                        <option value="lighting">Lighting (लाइट्स)</option>
                        <option value="decoration">Decoration (सजावट)</option>
                        <option value="birthday">Birthday (जन्मदिन)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer hover:scale-[1.01] transition-transform"
                      >
                        Upload Image to Gallery
                      </button>
                    </div>
                  </form>
                </div>

                {/* Gallery Items Grid */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-800 dark:text-neutral-200 border-b dark:border-neutral-800 pb-2">
                    Current Decoration Gallery Catalog
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-neutral-50 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-neutral-200 dark:bg-neutral-750">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 bg-neutral-950/75 text-gold text-[9px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm border border-gold/20">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white dark:bg-neutral-900">
                          <div>
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs truncate max-w-[150px]">
                              {item.title}
                            </h4>
                            <span className="text-[9px] text-neutral-400">ID: {item.id}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                            title="Delete gallery image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {galleryItems.length === 0 && (
                      <div className="col-span-full py-16 text-center text-neutral-400 dark:text-neutral-550">
                        No gallery images found. Add some images using the form above.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PACKAGES TAB */}
            {activeTab === "packages" && (
              <motion.div
                key="packages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 border-b pb-2">
                    Rental Package Deals
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="border border-neutral-200 rounded-xl p-5 space-y-4 relative bg-cream/35">
                        <h3 className="font-serif text-md font-bold text-primary">{pkg.name}</h3>
                        <div className="text-lg font-bold text-neutral-800">₹{pkg.price.toLocaleString("en-IN")}</div>
                        
                        <ul className="text-xs text-neutral-500 space-y-1 max-h-24 overflow-y-auto pr-1">
                          {pkg.includes.map((inc, i) => (
                            <li key={i}>• {inc}</li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingPkg(pkg)}
                            className="p-1 text-primary hover:bg-primary/5 rounded border border-primary/20 cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Package Form */}
                {editingPkg && (
                  <div className="bg-white rounded-2xl p-6 border border-gold/30 shadow-md space-y-4">
                    <h3 className="font-serif text-md font-bold text-neutral-900">
                      Edit package: {editingPkg.name}
                    </h3>

                    <form onSubmit={handleSavePackage} className="space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Package Name</label>
                          <input
                            type="text"
                            required
                            value={editingPkg.name}
                            onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Package Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={editingPkg.price}
                            onChange={(e) => setEditingPkg({ ...editingPkg, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">Includes (Comma separated)</label>
                        <textarea
                          rows={3}
                          required
                          value={editingPkg.includes.join(", ")}
                          onChange={(e) => setEditingPkg({ ...editingPkg, includes: e.target.value.split(",").map(i => i.trim()) })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none text-neutral-800"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPkg(null)}
                          className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl royal-red-gradient text-white font-semibold gold-border cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}

            {/* RENTAL ITEMS TAB */}
            {activeTab === "items" && (
              <motion.div
                key="items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 bg-white rounded-2xl p-6 border border-gold/15 shadow-sm"
              >
                <div className="flex justify-between items-center border-b pb-4 border-gold/10">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900">Custom Rental Items</h2>
                    <p className="text-xs text-neutral-500">Configure catalog unit costs for the live package builder.</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem({ id: `item_${Math.floor(100 + Math.random() * 900)}`, name: "", nameHi: "", pricePerUnit: 0, unit: "piece", category: "Decoration" });
                      setNewItemModal(true);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer gold-border"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-cream border-b border-neutral-200">
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Item ID</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Item Name</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Category</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700">Rate / Unit</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-neutral-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-700">
                      {settings?.rentalItems.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-3 font-semibold text-neutral-500">{item.id}</td>
                          <td className="py-3 px-3 font-bold text-neutral-900">{item.name}</td>
                          <td className="py-3 px-3 capitalize">{item.category}</td>
                          <td className="py-3 px-3 font-semibold">₹{item.pricePerUnit} / {item.unit}</td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setNewItemModal(true);
                              }}
                              className="p-1 rounded bg-neutral-50 text-primary hover:bg-neutral-100 border border-neutral-200 cursor-pointer"
                              title="Edit item"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRentalItem(item.id)}
                              className="p-1 rounded bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit Item Modal Popup */}
                {newItemModal && editingItem && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gold/30 shadow-2xl space-y-4">
                      <h3 className="font-serif text-lg font-bold text-neutral-900 border-b pb-2">
                        {editingItem.name ? "Edit Rental Item" : "Add Rental Item"}
                      </h3>

                      <form onSubmit={handleSaveRentalItem} className="space-y-4 text-xs sm:text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700">Item Name (English)</label>
                            <input
                              type="text"
                              required
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              placeholder="e.g. Chairs, Stage decoration"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700">Item Name (Hindi)</label>
                            <input
                              type="text"
                              value={editingItem.nameHi || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, nameHi: e.target.value })}
                              placeholder="e.g. कुर्सियां, मंच"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700">Rate (₹)</label>
                            <input
                              type="number"
                              required
                              value={editingItem.pricePerUnit}
                              onChange={(e) => setEditingItem({ ...editingItem, pricePerUnit: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700">Unit Label</label>
                            <input
                              type="text"
                              required
                              value={editingItem.unit}
                              onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                              placeholder="piece, set"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Category</label>
                          <select
                            value={editingItem.category}
                            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none bg-white"
                          >
                            <option>Seating</option>
                            <option>Lighting</option>
                            <option>Decoration</option>
                            <option>Structure</option>
                            <option>Draping</option>
                            <option>Flooring</option>
                            <option>Cooling</option>
                          </select>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setNewItemModal(false);
                              setEditingItem(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl royal-red-gradient text-white font-semibold gold-border cursor-pointer"
                          >
                            Save Item
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* REVIEWS APPROVAL TAB */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 bg-white rounded-2xl p-6 border border-gold/15 shadow-sm"
              >
                <div className="border-b pb-4 border-gold/10">
                  <h2 className="font-serif text-xl font-bold text-neutral-900">Reviews & Testimonials Moderator</h2>
                  <p className="text-xs text-neutral-500">Approve user-submitted comments before showing them on the frontend.</p>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cream/20 gap-3 text-xs sm:text-sm">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <strong className="text-neutral-800 font-bold">{rev.customerName}</strong>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              rev.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {rev.isApproved ? "Approved" : "Pending"}
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400">{rev.createdAt}</div>
                        <p className="italic text-neutral-600 mt-2 font-medium leading-relaxed">&quot;{rev.comment}&quot;</p>
                      </div>

                      <div className="flex space-x-2 shrink-0 self-end sm:self-center">
                        {!rev.isApproved && (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200 cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <p className="text-center py-10 text-neutral-400">No reviews found.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* CONSOLE SETTINGS TAB */}
            {activeTab === "settings" && settings && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-6"
              >
                <div className="border-b pb-4 border-gold/10 dark:border-neutral-800">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">Console Settings</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Edit business contacts, tax parameters, and metadata configurations.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Business Name</label>
                      <input
                        type="text"
                        required
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">GST Percentage (%)</label>
                      <input
                        type="number"
                        required
                        value={settings.gstRate}
                        onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300">Tagline (Hindi / English)</label>
                    <input
                      type="text"
                      required
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300">Business Location Address</label>
                    <textarea
                      rows={2}
                      required
                      value={settings.location}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300">Contact Phone Numbers (Comma separated)</label>
                    <input
                      type="text"
                      required
                      value={settings.contactNumbers.join(", ")}
                      onChange={(e) => setSettings({ ...settings, contactNumbers: e.target.value.split(",").map(c => c.trim()) })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer hover:scale-[1.01] transition-transform"
                  >
                    Save Settings Configuration
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
