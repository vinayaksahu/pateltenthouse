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
  deleteGalleryItem,
  saveReview
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
  Image as ImageIcon,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  Package as PackageIcon,
  Sliders,
  CheckSquare
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
  { date: "2027-02-25", label: "Magha Krishna Shashthi" },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Expandable bookings tracking
  const [expandedBookings, setExpandedBookings] = useState<{ [key: string]: boolean }>({});

  // Inventory Checklist States
  const [inventoryCheckDate, setInventoryCheckDate] = useState(new Date().toISOString().split("T")[0]);
  const [inventoryCapacity, setInventoryCapacity] = useState<{ [itemId: string]: number }>({
    chairs: 500, lights: 50, coolers: 10, stage: 5, mandap: 5, gate: 5, pipe_set: 20, parda: 50, carpet: 10, dari: 20, balloon: 10
  });
  const [editingCapacityId, setEditingCapacityId] = useState<string | null>(null);
  const [editingCapacityVal, setEditingCapacityVal] = useState(500);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Gallery Management Form State
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState<"wedding" | "mandap" | "stage" | "lighting" | "decoration" | "birthday">("wedding");
  const [newGalleryMode, setNewGalleryMode] = useState<"url" | "file">("url");

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);

  // Muhurat filters
  const [muhuratYearFilter, setMuhuratYearFilter] = useState("all");
  const [muhuratMonthFilter, setMuhuratMonthFilter] = useState("all");

  // Editing Forms/Modals States
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);
  const [newItemModal, setNewItemModal] = useState(false);

  // Reviews Add/Edit States
  const [newReviewModal, setNewReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewFormName, setReviewFormName] = useState("");
  const [reviewFormRating, setReviewFormRating] = useState(5);
  const [reviewFormComment, setReviewFormComment] = useState("");
  const [reviewFormApproved, setReviewFormApproved] = useState(true);
  
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

  // Load Inventory Capacity from LocalStorage
  useEffect(() => {
    const cap = localStorage.getItem("pth_inventory_capacity");
    if (cap) {
      try {
        setInventoryCapacity(JSON.parse(cap));
      } catch (e) {
        console.error("Failed to parse inventory capacity", e);
      }
    }
  }, []);

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
    
    let urlToSave = newGalleryUrl;

    if (newGalleryMode === "file") {
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }

      // Convert file to base64 Data URL
      try {
        urlToSave = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.error("FileReader failed", err);
        alert("Failed to read image file.");
        return;
      }
    }

    if (!urlToSave) {
      alert("Please provide either an image URL or upload an image file.");
      return;
    }

    try {
      await addGalleryItem({
        title: newGalleryTitle || "Work Showcase",
        imageUrl: urlToSave,
        category: newGalleryCategory
      });
      setNewGalleryTitle("");
      setNewGalleryUrl("");
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      await loadAllData();
      alert("Gallery image added successfully!");
    } catch (err) {
      console.error("Failed to add gallery item", err);
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

  // Reviews Creator / Editor Save Handler
  const handleSaveReviewForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormName || !reviewFormComment) {
      alert("Please fill out all fields.");
      return;
    }

    const reviewId = editingReview?.id || `R-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = editingReview?.createdAt || new Date().toISOString().split("T")[0];

    const reviewObj: Review = {
      id: reviewId,
      customerName: reviewFormName,
      rating: Number(reviewFormRating),
      comment: reviewFormComment,
      isApproved: reviewFormApproved,
      createdAt
    };

    try {
      await saveReview(reviewObj);
      setNewReviewModal(false);
      setEditingReview(null);
      setReviewFormName("");
      setReviewFormComment("");
      setReviewFormRating(5);
      setReviewFormApproved(true);
      await loadAllData();
      alert("Review saved successfully!");
    } catch (err) {
      console.error("Failed to save review", err);
      alert("Error saving review.");
    }
  };

  const handleOpenEditReview = (r: Review) => {
    setEditingReview(r);
    setReviewFormName(r.customerName);
    setReviewFormComment(r.comment);
    setReviewFormRating(r.rating);
    setReviewFormApproved(r.isApproved);
    setNewReviewModal(true);
  };

  const handleOpenAddReview = () => {
    setEditingReview(null);
    setReviewFormName("");
    setReviewFormComment("");
    setReviewFormRating(5);
    setReviewFormApproved(true);
    setNewReviewModal(true);
  };

  // Expand booking toggle
  const toggleBookingExpanded = (id: string) => {
    setExpandedBookings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Resolve standard package details to items checklist
  const getBookingItemsChecklist = (b: Booking): { name: string; quantity: number }[] => {
    if (b.selectedItems && b.selectedItems.length > 0) {
      return b.selectedItems.map((si) => ({ name: si.name, quantity: si.quantity }));
    }
    
    // Standard package items mapping
    if (b.packageType === "silver") {
      return [
        { name: "Chandni Pipe Set", quantity: 4 },
        { name: "Curtains (Parda)", quantity: 6 },
        { name: "Carpet", quantity: 3 },
        { name: "Lights Setup", quantity: 4 },
        { name: "Chairs", quantity: 20 },
        { name: "Dari", quantity: 4 },
        { name: "Welcome Gate", quantity: 1 }
      ];
    } else if (b.packageType === "gold") {
      return [
        { name: "Chandni Pipe Set", quantity: 6 },
        { name: "Curtains (Parda)", quantity: 10 },
        { name: "Carpet", quantity: 3 },
        { name: "Lights Setup", quantity: 4 },
        { name: "Chairs", quantity: 30 },
        { name: "Dari", quantity: 5 },
        { name: "Cooler", quantity: 1 },
        { name: "Mandap Set", quantity: 1 },
        { name: "Welcome Gate", quantity: 1 }
      ];
    } else if (b.packageType === "premium") {
      return [
        { name: "Chandni Pipe Set", quantity: 6 },
        { name: "Curtains (Parda)", quantity: 10 },
        { name: "Carpet", quantity: 3 },
        { name: "Lights Setup", quantity: 4 },
        { name: "Chairs", quantity: 50 },
        { name: "Dari", quantity: 5 },
        { name: "Cooler", quantity: 2 },
        { name: "Mandap Set", quantity: 1 },
        { name: "Welcome Gate", quantity: 1 },
        { name: "Stage (Decoration & Setup)", quantity: 1 },
        { name: "Balloon Decoration", quantity: 1 }
      ];
    }
    return [];
  };

  // Inventory Stock availability calculations
  const getInventoryStock = () => {
    // 1. Get all approved/completed/pending bookings on the selected inventoryCheckDate
    const bookingsOnDate = bookings.filter(
      (b) => b.eventDate === inventoryCheckDate && b.status !== "rejected"
    );

    // 2. Aggregate quantity of each item booked on that date
    const bookedCounts: { [itemId: string]: number } = {};
    
    // Helper mapper to associate custom/standard checklist items back to standard catalog item IDs
    const resolveCatalogId = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes("chair")) return "chairs";
      if (lower.includes("light")) return "lights";
      if (lower.includes("cooler")) return "coolers";
      if (lower.includes("stage")) return "stage";
      if (lower.includes("mandap")) return "mandap";
      if (lower.includes("gate") || lower.includes("welcome")) return "gate";
      if (lower.includes("pipe") || lower.includes("chandni")) return "pipe_set";
      if (lower.includes("parda") || lower.includes("curtain")) return "parda";
      if (lower.includes("carpet")) return "carpet";
      if (lower.includes("dari")) return "dari";
      if (lower.includes("balloon")) return "balloon";
      return name;
    };

    bookingsOnDate.forEach((b) => {
      const checklist = getBookingItemsChecklist(b);
      checklist.forEach((item) => {
        const catId = resolveCatalogId(item.name);
        bookedCounts[catId] = (bookedCounts[catId] || 0) + item.quantity;
      });
    });

    // 3. Map settings rental items
    const itemsList = settings?.rentalItems || [];
    
    return itemsList.map((item) => {
      const booked = bookedCounts[item.id] || 0;
      const capacity = inventoryCapacity[item.id] || 0;
      const available = capacity - booked;
      
      let statusColor = "text-green-600 dark:text-green-400";
      let statusText = "Safe / Available";
      
      if (available < 0) {
        statusColor = "text-rose-600 dark:text-rose-400 font-bold animate-pulse";
        statusText = `Shortage by ${Math.abs(available)} units!`;
      } else if (available <= 5) {
        statusColor = "text-amber-500 dark:text-amber-400 font-semibold";
        statusText = "Low Stock";
      }

      return {
        item,
        booked,
        capacity,
        available,
        statusText,
        statusColor
      };
    });
  };

  const handleSaveStockCapacity = (itemId: string) => {
    const updated = { ...inventoryCapacity, [itemId]: Number(editingCapacityVal) };
    setInventoryCapacity(updated);
    localStorage.setItem("pth_inventory_capacity", JSON.stringify(updated));
    setEditingCapacityId(null);
  };

  const startEditingCapacity = (itemId: string, currentVal: number) => {
    setEditingCapacityId(itemId);
    setEditingCapacityVal(currentVal);
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

  const upcomingEventsList = bookings
    .filter((b) => b.status === "approved" && new Date(b.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5);

  if (!authorized) {
    return <div className="text-center py-20 bg-cream dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">Authenticating access...</div>;
  }

  // Common Nav list
  const navigationItems = [
    { id: "overview", label: "Dashboard Overview", icon: TrendingUp },
    { id: "bookings", label: "Bookings Manager", icon: FileSpreadsheet },
    { id: "inventory", label: "Inventory Checklist", icon: CheckSquare },
    { id: "calendar", label: "Availability Calendar", icon: Calendar },
    { id: "muhurat", label: "Vivah Muhurats", icon: Heart },
    { id: "gallery", label: "Gallery Moderator", icon: ImageIcon },
    { id: "packages", label: "Standard Packages", icon: Layers },
    { id: "items", label: "Rental Items & Price", icon: DollarSign },
    { id: "reviews", label: "Reviews Approvals", icon: Star },
    { id: "settings", label: "Console Settings", icon: SettingsIcon },
  ];

  const primaryNumber = settings?.contactNumbers?.[0] || "9713661625";

  return (
    <div className="bg-cream dark:bg-neutral-950 min-h-screen text-neutral-800 dark:text-neutral-200 transition-colors duration-300 flex flex-col lg:flex-row">
      
      {/* 1. PERSISTENT SIDEBAR - DESKTOP VIEW */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 border-r border-gold/15 text-neutral-300 h-screen sticky top-0 flex-shrink-0 z-40">
        <div className="p-6 border-b border-gold/20 flex items-center space-x-3 royal-red-gradient">
          <div className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center border border-gold">
            <Lock className="h-4 w-4 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold text-white tracking-wide">PTH Management</h1>
            <span className="text-[9px] text-gold tracking-widest uppercase font-semibold block">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto text-xs font-semibold">
          {navigationItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gold/15 text-gold border-l-4 border-gold font-bold"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 flex flex-col space-y-2">
          <div className="flex justify-between items-center px-2 py-1 bg-neutral-950/40 rounded-lg text-[10px] text-neutral-400">
            <span>Primary Phone:</span>
            <span className="text-gold font-bold">{primaryNumber}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* 2. SLIDING SIDEBAR DRAWER - MOBILE VIEW */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-neutral-900 border-r border-gold/15 text-neutral-300 z-50 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-gold/20 flex justify-between items-center royal-red-gradient">
                <div className="flex items-center space-x-2.5">
                  <Lock className="h-4 w-4 text-gold" />
                  <span className="font-serif text-sm font-bold text-white">PTH Admin Console</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-neutral-950 text-neutral-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto text-xs font-semibold">
                {navigationItems.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-gold/15 text-gold border-l-4 border-gold font-bold"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-neutral-800 flex flex-col space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-neutral-900 text-white py-3 px-4 sm:px-6 border-b border-gold/30 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-white/20 text-neutral-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="hidden lg:block">
              <h2 className="font-serif text-sm font-bold text-gold uppercase tracking-widest">
                {navigationItems.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            <div className="lg:hidden">
              <h1 className="font-serif text-sm font-bold">Patel Tent House</h1>
              <span className="text-[9px] text-gold tracking-widest uppercase font-semibold">Console</span>
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

              {/* Dropdown Panel - Mobile Screen Aware Placement */}
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
                      className="fixed sm:absolute top-16 sm:top-auto right-4 sm:right-0 left-4 sm:left-auto w-auto sm:w-82 bg-white dark:bg-neutral-900 border border-gold/20 dark:border-gold/30 rounded-2xl shadow-xl z-50 p-4 text-xs max-h-96 overflow-y-auto text-neutral-800 dark:text-neutral-200"
                    >
                      <div className="flex justify-between items-center border-b pb-2 mb-3 dark:border-neutral-850">
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
                          <div className="py-6 text-center text-neutral-400 dark:text-neutral-555">
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
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-neutral-400 hover:text-white hover:bg-white/5 text-xs transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
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
                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gold/15 dark:border-gold/30 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Total Revenue</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-primary dark:text-gold block mt-1">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gold/15 dark:border-gold/30 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Total Requests</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-neutral-800 dark:text-neutral-200 block mt-1">
                      {totalBookings}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gold/15 dark:border-gold/30 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Pending Requests</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-amber-500 block mt-1">
                      {pendingRequests}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-gold/15 dark:border-gold/30 shadow-sm text-center">
                    <span className="text-xs text-neutral-400 block font-semibold">Popular Package</span>
                    <span className="text-sm font-serif font-extrabold text-gold block mt-2.5 uppercase">
                      {mostPopularPackage}
                    </span>
                  </div>
                </div>

                {/* Upcoming Events & Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                    <h3 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-200 border-b dark:border-neutral-800 pb-2">
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
                            <div className="flex justify-between font-semibold capitalize text-neutral-700 dark:text-neutral-300">
                              <span>{pType} Package</span>
                              <span>{count} Bookings ({Math.round(share)}%)</span>
                            </div>
                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
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

                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                    <h3 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-205 border-b dark:border-neutral-800 pb-2">
                      Upcoming Approved Events
                    </h3>
                    
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                      {upcomingEventsList.length === 0 ? (
                        <p className="text-center py-10 text-neutral-400 dark:text-neutral-550">No upcoming events scheduled.</p>
                      ) : (
                        upcomingEventsList.map((ue) => (
                          <div key={ue.id} className="py-2.5 flex justify-between items-center">
                            <div>
                              <strong className="text-neutral-800 dark:text-neutral-200">{ue.customerName}</strong>
                              <div className="text-[10px] text-neutral-500 dark:text-neutral-455">
                                {ue.eventType} • {ue.villageCity}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800/30">
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

            {/* BOOKINGS TAB - EXPANDABLE DETAILS */}
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
                      <tr className="bg-cream dark:bg-neutral-955 border-b border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-305">
                        <th className="py-2.5 px-2 text-center w-8"></th>
                        <th className="py-2.5 px-3 font-serif font-bold">Ref ID</th>
                        <th className="py-2.5 px-3 font-serif font-bold">Client Name</th>
                        <th className="py-2.5 px-3 font-serif font-bold">Date & Event</th>
                        <th className="py-2.5 px-3 font-serif font-bold">Package</th>
                        <th className="py-2.5 px-3 font-serif font-bold">Grand Total</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-center">Status</th>
                        <th className="py-2.5 px-3 font-serif font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {filteredBookings.map((b) => {
                        const isExpanded = !!expandedBookings[b.id];
                        const checklistItems = getBookingItemsChecklist(b);
                        
                        return (
                          <>
                            <tr key={b.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                              <td className="py-3 px-2 text-center">
                                <button
                                  onClick={() => toggleBookingExpanded(b.id)}
                                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                                  title="Toggle details"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                              <td className="py-3 px-3 font-bold">{b.id}</td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-neutral-850 dark:text-neutral-100">{b.customerName}</div>
                                <div className="text-[10px] text-neutral-400">{b.mobileNumber}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">{b.eventDate}</div>
                                <div className="text-[10px] text-neutral-505 text-neutral-450 capitalize">{b.eventType} • {b.villageCity}</div>
                              </td>
                              <td className="py-3 px-3 capitalize font-semibold">{b.packageType}</td>
                              <td className="py-3 px-3 font-bold text-primary dark:text-gold">₹{b.grandTotal.toLocaleString("en-IN")}</td>
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    b.status === "pending"
                                      ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-404 dark:border-amber-900/30"
                                      : b.status === "approved"
                                      ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-950/20 dark:text-green-404 dark:border-green-900/30"
                                      : b.status === "completed"
                                      ? "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-955/20 dark:text-blue-404 dark:border-blue-900/30"
                                      : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-955/20 dark:text-red-404 dark:border-red-900/30"
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
                                      className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-101 border border-green-202 dark:bg-green-950/30 dark:text-green-404 dark:border-green-800/30 cursor-pointer inline-flex items-center"
                                      title="Approve Booking"
                                    >
                                      <CheckCircle className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectBooking(b.id)}
                                      className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-101 border border-red-202 dark:bg-red-950/30 dark:text-red-404 dark:border-red-800/30 cursor-pointer inline-flex items-center"
                                      title="Reject Booking"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                )}
                                {b.status === "approved" && (
                                  <button
                                    onClick={() => handleCompleteBooking(b.id)}
                                    className="px-2 py-1 rounded bg-blue-55 text-blue-600 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-404 dark:border-blue-800/30 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                            
                            {/* Expandable subrow showing client requirements and checklists */}
                            {isExpanded && (
                              <tr key={`${b.id}-details`} className="bg-neutral-50/50 dark:bg-neutral-900/50">
                                <td colSpan={8} className="p-4 border-t border-b border-neutral-101 dark:border-neutral-800">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    {/* Left panel: event details */}
                                    <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-2">
                                      <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px] border-b pb-1 border-neutral-100 dark:border-neutral-800">
                                        Client & Event Setup Details
                                      </h4>
                                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-neutral-606 dark:text-neutral-400">
                                        <div><strong>Expected Guests:</strong></div>
                                        <div>{b.expectedGuests || "N/A"} guests</div>
                                        
                                        <div><strong>Event Time:</strong></div>
                                        <div>{b.eventTime || "N/A"}</div>
                                        
                                        <div><strong>Event Type:</strong></div>
                                        <div className="capitalize">{b.eventType || "N/A"}</div>
                                        
                                        <div><strong>Mobile Contact:</strong></div>
                                        <div>
                                          <a href={`tel:${b.mobileNumber}`} className="text-primary dark:text-gold hover:underline">
                                            {b.mobileNumber}
                                          </a>
                                        </div>

                                        <div><strong>WhatsApp Link:</strong></div>
                                        <div>
                                          <a
                                            href={`https://wa.me/${b.whatsappNumber.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:underline flex items-center space-x-1"
                                          >
                                            <MessageSquare className="h-3 w-3 inline mr-1" />
                                            Chat WhatsApp
                                          </a>
                                        </div>
                                        
                                        <div className="col-span-2">
                                          <strong>Detailed Venue Address:</strong>
                                          <p className="mt-0.5 text-neutral-700 dark:text-neutral-300 font-semibold bg-neutral-50 dark:bg-neutral-900 p-2 rounded border">
                                            {b.eventAddress || "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {b.additionalRequirements && (
                                        <div className="pt-2">
                                          <strong>Special Requirements / Notes:</strong>
                                          <p className="mt-1 bg-amber-50/50 dark:bg-amber-955/10 text-amber-800 dark:text-amber-400 p-2 rounded border border-amber-100 dark:border-amber-900/30">
                                            {b.additionalRequirements}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Right panel: itemized inventory checklist */}
                                    <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
                                      <div>
                                        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px] border-b pb-1 border-neutral-100 dark:border-neutral-800 mb-2">
                                          Material Inventory Checklist ({b.packageType === "custom" ? "Custom Quantities" : `${b.packageType} package`})
                                        </h4>
                                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-48 overflow-y-auto pr-1">
                                          {checklistItems.map((item, i) => (
                                            <div key={i} className="py-1.5 flex justify-between text-neutral-700 dark:text-neutral-300">
                                              <span>{item.name}</span>
                                              <strong className="text-neutral-850 dark:text-white">x {item.quantity}</strong>
                                            </div>
                                          ))}
                                          {checklistItems.length === 0 && (
                                            <p className="text-neutral-400 text-center py-4">No item details stored.</p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="border-t pt-3 mt-3 space-y-1 text-xs">
                                        <div className="flex justify-between text-neutral-500">
                                          <span>Subtotal Cost:</span>
                                          <span>Rs. {b.subtotal.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-505">
                                          <span>GST Tax:</span>
                                          <span>Rs. {b.gst.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-900 dark:text-white font-bold text-sm">
                                          <span>Grand Total:</span>
                                          <span className="text-primary dark:text-gold">Rs. {b.grandTotal.toLocaleString("en-IN")}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}

                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-10 text-neutral-400 dark:text-neutral-550">
                            No matching bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* INVENTORY CHECKLIST TAB */}
            {activeTab === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Check Date Selection Header */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-gold/10 gap-3">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Material Inventory stock checker
                      </h2>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Analyze item double-bookings and manage stock capacities on any specific date.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <label className="font-bold text-neutral-700 dark:text-neutral-350">Check Stock Date:</label>
                      <input
                        type="date"
                        required
                        value={inventoryCheckDate}
                        onChange={(e) => setInventoryCheckDate(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Stock items grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {getInventoryStock().map(({ item, booked, capacity, available, statusText, statusColor }) => {
                      const isEditing = editingCapacityId === item.id;
                      
                      return (
                        <div
                          key={item.id}
                          className="bg-neutral-50 dark:bg-neutral-905 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-3"
                        >
                          <div className="flex justify-between items-start border-b pb-1.5 dark:border-neutral-800">
                            <div>
                              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                                {item.name}
                              </h4>
                              <span className="text-[10px] text-neutral-400">{item.nameHi || "Hindi label N/A"} • {item.category}</span>
                            </div>
                            <span className={`text-[10px] font-bold ${statusColor}`}>{statusText}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                            <div className="p-2 bg-white dark:bg-neutral-950 rounded border dark:border-neutral-800">
                              <span className="text-neutral-400 block text-[9px] uppercase font-semibold">Booked</span>
                              <strong className="text-rose-505 text-sm">{booked}</strong>
                              <span className="text-[8px] text-neutral-500 block">{item.unit}s</span>
                            </div>

                            <div className="p-2 bg-white dark:bg-neutral-950 rounded border dark:border-neutral-800 relative group">
                              <span className="text-neutral-400 block text-[9px] uppercase font-semibold">Total Stock</span>
                              {isEditing ? (
                                <div className="flex items-center space-x-1 justify-center mt-1">
                                  <input
                                    type="number"
                                    value={editingCapacityVal}
                                    onChange={(e) => setEditingCapacityVal(Number(e.target.value))}
                                    className="w-12 border rounded px-1 text-center bg-white dark:bg-neutral-800"
                                  />
                                  <button
                                    onClick={() => handleSaveStockCapacity(item.id)}
                                    className="px-1 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <strong className="text-neutral-800 dark:text-neutral-200 text-sm block mt-0.5">{capacity}</strong>
                                  <button
                                    onClick={() => startEditingCapacity(item.id, capacity)}
                                    className="absolute inset-0 bg-neutral-900/80 text-white text-[9px] font-bold items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity flex cursor-pointer"
                                  >
                                    Edit Capacity
                                  </button>
                                </>
                              )}
                              <span className="text-[8px] text-neutral-500 block">{item.unit}s</span>
                            </div>

                            <div className="p-2 bg-white dark:bg-neutral-950 rounded border dark:border-neutral-800">
                              <span className="text-neutral-400 block text-[9px] uppercase font-semibold">Available</span>
                              <strong className={`text-sm ${available < 0 ? "text-red-500" : "text-green-500"}`}>
                                {available}
                              </strong>
                              <span className="text-[8px] text-neutral-500 block">{item.unit}s</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 border-b dark:border-neutral-800 pb-2">
                    Block Calendar Dates
                  </h2>

                  <form onSubmit={handleBlockDate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs sm:text-sm">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Target Date</label>
                      <input
                        type="date"
                        required
                        value={blockDateInput}
                        onChange={(e) => setBlockDateInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-350">Block Status</label>
                      <select
                        value={blockStatusInput}
                        onChange={(e) => setBlockStatusInput(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      >
                        <option value="blocked">Blocked (Manual)</option>
                        <option value="booked">Booked (Reservation)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300">Reason / Details</label>
                      <input
                        type="text"
                        value={blockReasonInput}
                        onChange={(e) => setBlockReasonInput(e.target.value)}
                        placeholder="Maintenance or Wedding details"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer hover:scale-[1.01] transition-transform"
                    >
                      Block Date
                    </button>
                  </form>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-805 dark:text-neutral-200 border-b dark:border-neutral-800 pb-2">
                    Blocked Date Configurations
                  </h3>

                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                    {availability.map((block) => (
                      <div key={block.id} className="py-3 flex justify-between items-center">
                        <div>
                          <strong className="text-neutral-855 dark:text-neutral-205">{block.date}</strong>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              block.status === "booked"
                                ? "bg-rose-100 dark:bg-rose-955/40 text-rose-800 dark:text-rose-400"
                                : "bg-neutral-100 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-405"
                            }`}
                          >
                            {block.status}
                          </span>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-450 mt-0.5">{block.reason || "No reason specified."}</div>
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
                      <p className="text-center py-10 text-neutral-405 dark:text-neutral-550">No dates are currently blocked.</p>
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
                        className="px-3 py-1.5 rounded-xl border border-neutral-205 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                      >
                        <option value="all">All Years</option>
                        <option value="2026">2026 Only</option>
                        <option value="2027">2027 Only</option>
                      </select>

                      <select
                        value={muhuratMonthFilter}
                        onChange={(e) => setMuhuratMonthFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-205 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
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
                              ? "border-neutral-200 dark:border-neutral-805 bg-neutral-50/30 dark:bg-neutral-900/30"
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
                            <p className="text-[10px] text-neutral-550 dark:text-neutral-400 mt-1">
                              {item.label}
                            </p>
                            {booking && (
                              <div className="mt-2 p-1.5 rounded bg-neutral-50 dark:bg-neutral-805 text-[10px] space-y-0.5 border border-neutral-100 dark:border-neutral-700">
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

            {/* DECORATION GALLERY TAB - URL & FILE MODES */}
            {activeTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 border-b dark:border-neutral-805 pb-2">
                    Add New Gallery Image
                  </h2>

                  <form onSubmit={handleAddGalleryItem} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
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

                      <div className="space-y-1">
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

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 dark:text-neutral-300">Upload Method</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setNewGalleryMode("url")}
                            className={`py-2 rounded-xl border font-bold text-center cursor-pointer transition-colors ${
                              newGalleryMode === "url"
                                ? "royal-red-gradient text-white border-gold"
                                : "bg-neutral-50 dark:bg-neutral-805 border-neutral-200 dark:border-neutral-700 text-neutral-606 dark:text-neutral-400"
                            }`}
                          >
                            Image URL
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewGalleryMode("file")}
                            className={`py-2 rounded-xl border font-bold text-center cursor-pointer transition-colors ${
                              newGalleryMode === "file"
                                ? "royal-red-gradient text-white border-gold"
                                : "bg-neutral-50 dark:bg-neutral-805 border-neutral-200 dark:border-neutral-700 text-neutral-606 dark:text-neutral-400"
                            }`}
                          >
                            Upload File
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {newGalleryMode === "url" ? (
                        <>
                          <label className="font-bold text-neutral-700 dark:text-neutral-300">Web Image URL</label>
                          <input
                            type="url"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </>
                      ) : (
                        <>
                          <label className="font-bold text-neutral-700 dark:text-neutral-300">Select Image File</label>
                          <input
                            type="file"
                            id="gallery-file-input"
                            accept="image/*"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-gold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer hover:scale-[1.01] transition-transform"
                      >
                        Upload to Decoration Gallery
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-neutral-805 dark:text-neutral-200 border-b dark:border-neutral-800 pb-2">
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
                            <h4 className="font-bold text-neutral-800 dark:text-neutral-205 text-xs truncate max-w-[150px]">
                              {item.title}
                            </h4>
                            <span className="text-[9px] text-neutral-405">ID: {item.id}</span>
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
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm space-y-4">
                  <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 border-b dark:border-neutral-800 pb-2">
                    Rental Package Deals
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="border border-neutral-202 dark:border-neutral-800 rounded-xl p-5 space-y-4 relative bg-cream/35 dark:bg-neutral-950/40">
                        <h3 className="font-serif text-md font-bold text-primary dark:text-gold">{pkg.name}</h3>
                        <div className="text-lg font-bold text-neutral-800 dark:text-neutral-250">₹{pkg.price.toLocaleString("en-IN")}</div>
                        
                        <ul className="text-xs text-neutral-500 dark:text-neutral-450 space-y-1 max-h-24 overflow-y-auto pr-1">
                          {pkg.includes.map((inc, i) => (
                            <li key={i}>• {inc}</li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t dark:border-neutral-800 flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingPkg(pkg)}
                            className="p-1.5 text-primary dark:text-gold hover:bg-primary/5 dark:hover:bg-gold/10 rounded border border-primary/20 dark:border-gold/30 cursor-pointer flex items-center"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {editingPkg && (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/30 shadow-md space-y-4">
                    <h3 className="font-serif text-md font-bold text-neutral-900 dark:text-neutral-100">
                      Edit package: {editingPkg.name}
                    </h3>

                    <form onSubmit={handleSavePackage} className="space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-350">Package Name</label>
                          <input
                            type="text"
                            required
                            value={editingPkg.name}
                            onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-350">Package Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={editingPkg.price}
                            onChange={(e) => setEditingPkg({ ...editingPkg, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 dark:text-neutral-350">Includes (Comma separated)</label>
                        <textarea
                          rows={3}
                          required
                          value={editingPkg.includes.join(", ")}
                          onChange={(e) => setEditingPkg({ ...editingPkg, includes: e.target.value.split(",").map(i => i.trim()) })}
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPkg(null)}
                          className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-805 hover:bg-neutral-202 dark:hover:bg-neutral-700 text-neutral-750 dark:text-neutral-300 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer"
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
                className="space-y-6 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm"
              >
                <div className="flex justify-between items-center border-b pb-4 border-gold/10 dark:border-neutral-800">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">Catalog Rental Items</h2>
                    <p className="text-xs text-neutral-505 dark:text-neutral-400">Modify rental parameters, unit formats, and standard charges.</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem({ id: `item_${Date.now()}`, name: "", nameHi: "", pricePerUnit: 0, unit: "piece", category: "Seating" });
                      setNewItemModal(true);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer gold-border"
                  >
                    <Plus className="h-4 w-4 text-gold" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {settings?.rentalItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-808 bg-neutral-50/50 dark:bg-neutral-950/20 flex justify-between items-center hover:shadow-xs transition-shadow"
                    >
                      <div>
                        <h4 className="font-bold text-neutral-805 dark:text-neutral-250">{item.name}</h4>
                        <span className="text-[10px] text-neutral-400 block">{item.nameHi || "Hindi label N/A"} • {item.category}</span>
                        <strong className="text-xs text-primary dark:text-gold block mt-1">
                          ₹{item.pricePerUnit} / {item.unit}
                        </strong>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewItemModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900/30 cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRentalItem(item.id)}
                          className="p-1 text-red-605 hover:bg-red-50 dark:hover:bg-red-950/20 rounded border border-red-200 dark:border-red-900/30 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {newItemModal && editingItem && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full border border-gold/30 shadow-2xl space-y-4">
                      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 border-b pb-2 dark:border-neutral-800">
                        {editingItem.name ? "Edit Rental Item" : "Add Rental Item"}
                      </h3>

                      <form onSubmit={handleSaveRentalItem} className="space-y-4 text-xs sm:text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700 dark:text-neutral-300">Item Name (English)</label>
                            <input
                              type="text"
                              required
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              placeholder="e.g. Chairs, Stage decoration"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700 dark:text-neutral-300">Item Name (Hindi)</label>
                            <input
                              type="text"
                              value={editingItem.nameHi || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, nameHi: e.target.value })}
                              placeholder="e.g. कुर्सियां, मंच"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700 dark:text-neutral-300">Rate (₹)</label>
                            <input
                              type="number"
                              required
                              value={editingItem.pricePerUnit}
                              onChange={(e) => setEditingItem({ ...editingItem, pricePerUnit: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-neutral-700 dark:text-neutral-300">Unit Label</label>
                            <input
                              type="text"
                              required
                              value={editingItem.unit}
                              onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                              placeholder="piece, set"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-300">Category</label>
                          <select
                            value={editingItem.category}
                            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-805 text-neutral-900 dark:text-neutral-100"
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
                              setEditingItem(null);
                              setNewItemModal(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-202 dark:hover:bg-neutral-700 text-neutral-750 dark:text-neutral-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer"
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

            {/* REVIEWS TAB - ADD & EDIT DIALOGS */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-gold/15 dark:border-gold/30 shadow-sm"
              >
                <div className="flex justify-between items-center border-b pb-4 border-gold/10 dark:border-neutral-800">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">Reviews & Testimonials</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Moderate and manage customer feedbacks shown in the slider catalog.</p>
                  </div>

                  <button
                    onClick={handleOpenAddReview}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl royal-red-gradient text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer gold-border"
                  >
                    <Plus className="h-4 w-4 text-gold" />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-neutral-202 dark:border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cream/20 dark:bg-neutral-950/20 gap-3 text-xs sm:text-sm"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <strong className="text-neutral-800 dark:text-neutral-205 text-sm">{rev.customerName}</strong>
                          <span
                            className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                              rev.isApproved ? "bg-green-101 text-green-800" : "bg-amber-101 text-amber-800"
                            }`}
                          >
                            {rev.isApproved ? "Approved" : "Pending"}
                          </span>
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-350 italic">"{rev.comment}"</p>
                        <span className="text-[10px] text-neutral-400 block">Submitted on: {rev.createdAt}</span>
                      </div>

                      <div className="flex space-x-2 sm:self-center">
                        {!rev.isApproved && (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditReview(rev)}
                          className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer flex items-center"
                          title="Edit review"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/30 hover:bg-red-55 dark:hover:bg-red-950/20 text-red-500 cursor-pointer flex items-center"
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <p className="text-center py-10 text-neutral-450 dark:text-neutral-500">No client reviews submitted yet.</p>
                  )}
                </div>

                {/* Add/Edit Review Modal Dialog */}
                {newReviewModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full border border-gold/30 shadow-2xl space-y-4 text-xs sm:text-sm">
                      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 border-b pb-2 dark:border-neutral-800">
                        {editingReview ? "Edit Customer Review" : "Add Customer Review"}
                      </h3>

                      <form onSubmit={handleSaveReviewForm} className="space-y-4">
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-300">Customer Name</label>
                          <input
                            type="text"
                            required
                            value={reviewFormName}
                            onChange={(e) => setReviewFormName(e.target.value)}
                            placeholder="e.g. Manish Sahu"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-350">Rating Stars (1 to 5)</label>
                          <select
                            value={reviewFormRating}
                            onChange={(e) => setReviewFormRating(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-202 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          >
                            <option value={5}>5 Stars ★★★★★</option>
                            <option value={4}>4 Stars ★★★★</option>
                            <option value={3}>3 Stars ★★★</option>
                            <option value={2}>2 Stars ★★</option>
                            <option value={1}>1 Star ★</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700 dark:text-neutral-300">Comment / Review Text</label>
                          <textarea
                            rows={3}
                            required
                            value={reviewFormComment}
                            onChange={(e) => setReviewFormComment(e.target.value)}
                            placeholder="Type review content here..."
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <input
                            type="checkbox"
                            id="review-approved-chk"
                            checked={reviewFormApproved}
                            onChange={(e) => setReviewFormApproved(e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded cursor-pointer"
                          />
                          <label htmlFor="review-approved-chk" className="font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                            Approve Immediately (Visible in homepage slider)
                          </label>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2 border-t dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={() => {
                              setNewReviewModal(false);
                              setEditingReview(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-750 dark:text-neutral-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl royal-red-gradient text-white font-bold uppercase tracking-wider text-xs gold-border cursor-pointer"
                          >
                            Save Review
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* CONSOLE SETTINGS TAB - GST ENABLE SWITCH */}
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

                    <div className="space-y-3">
                      <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">GST Tax Billing Settings</label>
                      <div className="flex items-center space-x-4 pt-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.gstRate > 0}
                            onChange={(e) => {
                              const enabled = e.target.checked;
                              setSettings({ ...settings, gstRate: enabled ? 18 : 0 });
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-neutral-600 peer-checked:bg-gold"></div>
                          <span className="ml-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                            {settings.gstRate > 0 ? "GST Taxes Enabled (18% rate)" : "GST Taxes Disabled (0% rate)"}
                          </span>
                        </label>
                      </div>
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
                    <label className="font-bold text-neutral-700 dark:text-neutral-300">Contact Phone Numbers (Comma separated, *First number is Primary*)</label>
                    <input
                      type="text"
                      required
                      value={settings.contactNumbers.join(", ")}
                      onChange={(e) => setSettings({ ...settings, contactNumbers: e.target.value.split(",").map(c => c.trim()) })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                    <span className="text-[10px] text-neutral-450 block pt-0.5">Note: The first number will be set as primary and automatically used site-wide for all Call and WhatsApp redirect CTAs.</span>
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
        </main>
      </div>
    </div>
  );
}
