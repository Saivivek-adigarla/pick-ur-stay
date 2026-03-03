import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_BOOKINGS, MOCK_HOTELS, MOCK_USERS, Hotel, Room } from "@/data/mockData";
import {
  LayoutDashboard, Hotel as HotelIcon, BookOpen, Users, TrendingUp, DollarSign,
  CheckCircle, XCircle, Star, Plus, Edit, Trash2, Eye, ArrowUp, X, Upload,
  ImageIcon, Save, AlertTriangle, Wifi, Car, Utensils, Dumbbell, Waves
} from "lucide-react";

type AdminTab = "overview" | "hotels" | "bookings" | "users";

const AMENITIES_OPTIONS = [
  "WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking",
  "Beach Access", "Airport Shuttle", "Business Center", "Fireplace",
  "Room Service", "Concierge", "Jacuzzi", "Kayaking", "Heritage Tours",
  "Houseboat Tours", "Trekking Tours", "Cultural Shows", "Ayurvedic Spa",
  "Bird Watching"
];

const CATEGORY_OPTIONS = [
  "Beach Resort", "Business Hotel", "Mountain Retreat", "Heritage Hotel",
  "Villa Resort", "Airport Hotel", "Budget Hotel", "Boutique Hotel", "Luxury Hotel"
];

const CITY_OPTIONS = [
  "Goa", "Mumbai", "Delhi", "Jaipur", "Manali", "Alleppey", "Bangalore",
  "Chennai", "Hyderabad", "Tirupati", "Kolkata", "Pune"
];

type HotelFormData = {
  name: string;
  city: string;
  location: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  amenities: string[];
  description: string;
  category: string;
  available: boolean;
  ownerId: string;
  lat: number;
  lng: number;
  rooms: Room[];
};

const defaultForm: HotelFormData = {
  name: "", city: "", location: "", price: 2000, originalPrice: 3000,
  rating: 4.0, reviewCount: 0, image: "", images: ["", "", ""],
  amenities: [], description: "", category: "Budget Hotel",
  available: true, ownerId: "", lat: 0, lng: 0,
  rooms: [{ id: "r_new1", name: "Standard Room", price: 2000, capacity: 2, amenities: [] }]
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState<HotelFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imgPreviewIdx, setImgPreviewIdx] = useState(0);

  const totalRevenue = MOCK_BOOKINGS.reduce((s, b) => s + b.totalAmount, 0);
  const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === "confirmed").length;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, change: "+12.5%", color: "text-primary bg-primary/10" },
    { label: "Total Bookings", value: MOCK_BOOKINGS.length, icon: <BookOpen className="h-5 w-5" />, change: "+8.2%", color: "text-ocean bg-ocean/10" },
    { label: "Active Hotels", value: hotels.filter(h => h.available).length, icon: <HotelIcon className="h-5 w-5" />, change: `${hotels.length} total`, color: "text-success bg-success/10" },
    { label: "Total Users", value: MOCK_USERS.filter(u => u.role === "customer").length, icon: <Users className="h-5 w-5" />, change: "+24", color: "text-gold bg-gold/10" },
  ];

  const tabs = [
    { key: "overview" as AdminTab, label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "hotels" as AdminTab, label: "Hotels", icon: <HotelIcon className="h-4 w-4" /> },
    { key: "bookings" as AdminTab, label: "Bookings", icon: <BookOpen className="h-4 w-4" /> },
    { key: "users" as AdminTab, label: "Users", icon: <Users className="h-4 w-4" /> },
  ];

  const openAdd = () => {
    setEditingHotel(null);
    setForm(defaultForm);
    setImgPreviewIdx(0);
    setShowModal(true);
  };

  const openEdit = (h: Hotel) => {
    setEditingHotel(h);
    const imgs = [...(h.images || [])];
    while (imgs.length < 3) imgs.push("");
    setForm({ ...h, images: imgs });
    setImgPreviewIdx(0);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setHotels(prev => prev.filter(h => h.id !== id));
    setDeleteConfirm(null);
  };

  const handleSave = () => {
    const cleanImages = form.images.filter(i => i.trim() !== "");
    const mainImage = cleanImages[0] || form.image || "";
    if (editingHotel) {
      setHotels(prev => prev.map(h => h.id === editingHotel.id
        ? { ...h, ...form, image: mainImage, images: cleanImages }
        : h
      ));
    } else {
      const newHotel: Hotel = {
        ...form,
        id: `h${Date.now()}`,
        image: mainImage,
        images: cleanImages,
        rooms: form.rooms.map((r, i) => ({ ...r, id: `r_${Date.now()}_${i}` }))
      };
      setHotels(prev => [newHotel, ...prev]);
    }
    setShowModal(false);
  };

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }));
  };

  const updateRoom = (idx: number, field: keyof Room, val: string | number) => {
    setForm(f => {
      const rooms = [...f.rooms];
      rooms[idx] = { ...rooms[idx], [field]: val };
      return { ...f, rooms };
    });
  };

  const addRoom = () => {
    setForm(f => ({
      ...f,
      rooms: [...f.rooms, { id: `r_new_${Date.now()}`, name: "New Room", price: f.price, capacity: 2, amenities: [] }]
    }));
  };

  const removeRoom = (idx: number) => {
    setForm(f => ({ ...f, rooms: f.rooms.filter((_, i) => i !== idx) }));
  };

  const updateImage = (idx: number, val: string) => {
    setForm(f => {
      const imgs = [...f.images];
      imgs[idx] = val;
      return { ...f, images: imgs };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="page-header mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-white/80 mt-1">Manage hotels, bookings, users and platform analytics</p>
          <div className="absolute right-6 top-6">
            <span className="badge-primary bg-white/20 text-white border-white/30">Admin Panel</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
                    <span className="flex items-center gap-1 text-xs font-medium text-success">
                      <ArrowUp className="h-3 w-3" />{s.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Revenue Analytics</h3>
              <div className="h-48 flex items-end gap-2">
                {[65, 40, 78, 55, 90, 72, 85, 63, 95, 88, 70, 82].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm cta-gradient opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                    <span className="text-xs text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Monthly revenue trend (2025)</p>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-bold mb-4">Recent Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 text-muted-foreground font-medium">Booking ID</th>
                      <th className="pb-3 text-muted-foreground font-medium">Guest</th>
                      <th className="pb-3 text-muted-foreground font-medium">Hotel</th>
                      <th className="pb-3 text-muted-foreground font-medium">Amount</th>
                      <th className="pb-3 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {MOCK_BOOKINGS.map(b => (
                      <tr key={b.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 font-mono text-xs">{b.id}</td>
                        <td className="py-3">{b.userName}</td>
                        <td className="py-3 line-clamp-1 max-w-32">{b.hotelName}</td>
                        <td className="py-3 font-semibold">₹{b.totalAmount.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : b.status === "cancelled" ? "badge-danger" : "badge-primary"}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Tab */}
        {tab === "hotels" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">All Hotels ({hotels.length})</h2>
              <button onClick={openAdd} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Hotel
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hotels.map(h => (
                <div key={h.id} className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-44">
                    {h.image ? (
                      <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className={h.available ? "badge-success text-xs" : "badge-danger text-xs"}>
                        {h.available ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="text-white text-xs font-semibold bg-black/40 rounded px-2 py-0.5">{h.category}</span>
                    </div>
                    {/* Image count badge */}
                    {h.images && h.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 text-white text-xs bg-black/40 rounded px-2 py-0.5 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> {h.images.length} photos
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-1">{h.name}</h3>
                    <p className="text-xs text-muted-foreground">{h.city} · {h.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-xs font-medium">{h.rating}</span>
                      <span className="text-xs text-muted-foreground">({h.reviewCount} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {h.amenities.slice(0, 3).map(a => (
                        <span key={a} className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5">{a}</span>
                      ))}
                      {h.amenities.length > 3 && (
                        <span className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5">+{h.amenities.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="font-bold text-primary text-sm">₹{h.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">/night</span>
                        {h.originalPrice > h.price && (
                          <span className="text-xs text-muted-foreground line-through ml-1">₹{h.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => navigate(`/hotel/${h.id}`)} title="View" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => openEdit(h)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors">
                          <Edit className="h-4 w-4 text-primary" />
                        </button>
                        <button onClick={() => setDeleteConfirm(h.id)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-danger/10 transition-colors">
                          <Trash2 className="h-4 w-4 text-danger" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-bold mb-4">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    {["ID", "Guest", "Hotel", "Check-in", "Check-out", "Amount", "Status", "Actions"].map(h => (
                      <th key={h} className="pb-3 pr-4 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_BOOKINGS.map(b => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs">{b.id}</td>
                      <td className="py-3 pr-4">{b.userName}</td>
                      <td className="py-3 pr-4 line-clamp-1 max-w-36">{b.hotelName}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{b.checkIn}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{b.checkOut}</td>
                      <td className="py-3 pr-4 font-semibold">₹{b.totalAmount.toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <span className={b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : b.status === "cancelled" ? "badge-danger" : "badge-primary"}>{b.status}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-success/10"><CheckCircle className="h-3.5 w-3.5 text-success" /></button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-danger/10"><XCircle className="h-3.5 w-3.5 text-danger" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-bold mb-4">All Users ({MOCK_USERS.length})</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_USERS.map(u => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/50 transition-colors">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${u.role === "admin" ? "bg-gold" : u.role === "hotelOwner" ? "bg-success" : "cta-gradient"}`}>
                    {u.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <span className={u.role === "admin" ? "badge-warning" : u.role === "hotelOwner" ? "badge-success" : "badge-primary"}>
                    {u.role === "hotelOwner" ? "Owner" : u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Hotel Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl my-4 border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card rounded-t-2xl z-10">
              <div>
                <h2 className="font-bold text-lg">{editingHotel ? "Edit Hotel" : "Add New Hotel"}</h2>
                <p className="text-xs text-muted-foreground">{editingHotel ? `Editing: ${editingHotel.name}` : "Fill in details to add a new property"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Hotel Images */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-primary" /> Hotel Photos
                </label>

                {/* Preview tabs */}
                <div className="flex gap-2 mb-3">
                  {form.images.map((img, i) => (
                    <button key={i} onClick={() => setImgPreviewIdx(i)}
                      className={`relative h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${imgPreviewIdx === i ? "border-primary" : "border-border"}`}>
                      {img ? (
                        <img src={img} alt={`photo ${i+1}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute top-0.5 left-0.5 text-xs bg-black/50 text-white rounded px-1">{i + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Active image URL input */}
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className={`flex gap-2 items-center ${imgPreviewIdx !== i && "hidden"}`}>
                      <div className="flex-1">
                        <input
                          value={img}
                          onChange={e => updateImage(i, e.target.value)}
                          placeholder={`Photo ${i+1} URL (e.g. https://...)`}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Paste a direct image URL (JPG, PNG, WebP)</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* All image URLs */}
                <div className="mt-3 space-y-2">
                  {form.images.map((img, i) => (
                    imgPreviewIdx === i ? null :
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-muted-foreground w-16 shrink-0">Photo {i+1}:</span>
                      <input
                        value={img}
                        onChange={e => updateImage(i, e.target.value)}
                        placeholder={`https://example.com/photo${i+1}.jpg`}
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Hotel Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Grand Palace Resort" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">City *</label>
                  <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select City</option>
                    {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Full Address / Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Calangute Beach, North Goa" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-semibold mb-2">Pricing</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Price/Night (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: +e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Rating (0-5)</label>
                    <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Describe the hotel, its highlights and unique features..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_OPTIONS.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${form.amenities.includes(a) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">Rooms</label>
                  <button onClick={addRoom} type="button" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus className="h-3 w-3" /> Add Room
                  </button>
                </div>
                <div className="space-y-3">
                  {form.rooms.map((room, idx) => (
                    <div key={room.id} className="rounded-xl border p-3 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Room {idx + 1}</span>
                        {form.rooms.length > 1 && (
                          <button onClick={() => removeRoom(idx)} type="button" className="text-danger hover:opacity-80">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="md:col-span-3">
                          <input value={room.name} onChange={e => updateRoom(idx, "name", e.target.value)}
                            placeholder="Room name (e.g. Deluxe Suite)" className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Price/Night (₹)</label>
                          <input type="number" value={room.price} onChange={e => updateRoom(idx, "price", +e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Capacity (guests)</label>
                          <input type="number" value={room.capacity} onChange={e => updateRoom(idx, "capacity", +e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="text-sm font-semibold">Hotel Availability</p>
                  <p className="text-xs text-muted-foreground">Toggle to show/hide from public listings</p>
                </div>
                <button type="button" onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.available ? "bg-success" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.available ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t sticky bottom-0 bg-card rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!form.name || !form.city}
                className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Save className="h-4 w-4" />
                {editingHotel ? "Save Changes" : "Add Hotel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-danger" />
            </div>
            <h3 className="font-bold text-lg text-center mb-1">Delete Hotel?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              This will permanently remove <strong>{hotels.find(h => h.id === deleteConfirm)?.name}</strong> and all its data.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-xl bg-danger text-white px-4 py-2.5 text-sm font-medium hover:bg-danger/90 transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
