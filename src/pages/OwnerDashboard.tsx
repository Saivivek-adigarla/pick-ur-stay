import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_HOTELS, MOCK_BOOKINGS } from "@/data/mockData";
import {
  Hotel, BookOpen, DollarSign, TrendingUp, Plus, Edit, Eye, Star,
  Calendar, CheckCircle, Clock, ArrowUp, Camera, MapPin
} from "lucide-react";

type OwnerTab = "overview" | "hotels" | "bookings" | "add";

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<OwnerTab>("overview");
  const [addForm, setAddForm] = useState({ name: "", city: "", price: "", category: "", description: "" });
  const [addSuccess, setAddSuccess] = useState(false);

  // Demo: show hotels that would belong to this owner
  const myHotels = MOCK_HOTELS.slice(0, 3);
  const myBookings = MOCK_BOOKINGS.slice(0, 3);
  const totalEarnings = myBookings.reduce((s, b) => s + b.totalAmount, 0);

  const stats = [
    { label: "My Hotels", value: myHotels.length, icon: <Hotel className="h-5 w-5" />, color: "text-primary bg-primary/10" },
    { label: "Total Bookings", value: myBookings.length, icon: <BookOpen className="h-5 w-5" />, color: "text-ocean bg-ocean/10" },
    { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, color: "text-success bg-success/10" },
    { label: "Avg. Rating", value: "4.7★", icon: <Star className="h-5 w-5" />, color: "text-gold bg-gold/10" },
  ];

  const tabs: { key: OwnerTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
    { key: "hotels", label: "My Hotels", icon: <Hotel className="h-4 w-4" /> },
    { key: "bookings", label: "Bookings", icon: <BookOpen className="h-4 w-4" /> },
    { key: "add", label: "Add Hotel", icon: <Plus className="h-4 w-4" /> },
  ];

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    setAddSuccess(true);
    setTimeout(() => { setAddSuccess(false); setAddForm({ name: "", city: "", price: "", category: "", description: "" }); setTab("hotels"); }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="page-header mb-8">
          <h1 className="text-2xl font-bold">Hotel Owner Panel</h1>
          <p className="text-white/80 mt-1">Manage your properties, bookings and earnings</p>
          <div className="absolute right-6 top-6">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">Owner Panel</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
                    <span className="flex items-center gap-1 text-xs font-medium text-success"><ArrowUp className="h-3 w-3" />+5%</span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Earnings chart */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-bold mb-4">Monthly Earnings</h3>
              <div className="h-40 flex items-end gap-2">
                {[40, 60, 45, 75, 55, 85, 70, 90, 65, 80, 72, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm bg-primary/70 hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                    <span className="text-xs text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Hotels Preview */}
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">My Properties</h3>
                <button onClick={() => setTab("add")} className="btn-primary text-xs px-3 py-2"><Plus className="h-3 w-3" /> Add</button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {myHotels.map(h => (
                  <div key={h.id} className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                    <img src={h.image} alt={h.name} className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-1">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.city}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-primary">₹{h.price.toLocaleString()}/night</span>
                        <span className="badge-success text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hotels Tab */}
        {tab === "hotels" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">My Hotels</h2>
              <button onClick={() => setTab("add")} className="btn-primary text-sm px-4 py-2.5"><Plus className="h-4 w-4" /> Add Hotel</button>
            </div>
            {myHotels.map(h => (
              <div key={h.id} className="rounded-2xl border bg-card p-4 flex gap-4">
                <img src={h.image} alt={h.name} className="h-24 w-32 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold">{h.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {h.location}
                      </div>
                    </div>
                    <span className="badge-success">Active</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span>₹{h.price.toLocaleString()}/night</span>
                    <span>{h.rooms.length} room types</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{h.rating} ({h.reviewCount})</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => navigate(`/hotel/${h.id}`)} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      <Edit className="h-3.5 w-3.5" /> Edit Details
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      <Camera className="h-3.5 w-3.5" /> Upload Photos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-bold mb-4">Bookings for My Hotels</h2>
            <div className="space-y-3">
              {myBookings.map(b => (
                <div key={b.id} className="flex gap-4 rounded-xl border p-4 hover:bg-muted/30 transition-colors">
                  <img src={b.hotelImage} alt={b.hotelName} className="h-16 w-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <p className="font-semibold text-sm">{b.userName}</p>
                      <span className={b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : "badge-danger"}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.hotelName}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{b.checkIn} → {b.checkOut}</span>
                      <span className="font-bold text-success">₹{b.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Hotel Tab */}
        {tab === "add" && (
          <div className="max-w-2xl mx-auto rounded-2xl border bg-card p-6">
            <h2 className="font-bold text-lg mb-5">Add New Hotel</h2>
            {addSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-1">Hotel Added Successfully!</h3>
                <p className="text-muted-foreground">Your property is now under review.</p>
              </div>
            ) : (
              <form onSubmit={handleAddHotel} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hotel Name *</label>
                    <input required value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Grand Palace Hotel" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">City *</label>
                    <input required value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="e.g. Mumbai" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price per Night (₹) *</label>
                    <input required type="number" min={500} value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="e.g. 3500" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category *</label>
                    <select required value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                      <option value="">Select type</option>
                      {["Beach Resort", "Business Hotel", "Mountain Retreat", "Heritage Hotel", "Villa Resort", "Airport Hotel", "Boutique Hotel"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description *</label>
                  <textarea required value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe your property, highlights, unique features..." rows={4} className="input-field resize-none" />
                </div>
                <div className="rounded-xl border-2 border-dashed p-6 text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload Hotel Photos</p>
                  <p className="text-xs text-muted-foreground">Drag & drop or click to upload (JPG, PNG · Max 10MB each)</p>
                  <button type="button" className="mt-3 btn-outline text-sm px-4 py-2">Choose Files</button>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Submit Hotel for Review
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
