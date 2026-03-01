import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_BOOKINGS, MOCK_HOTELS, MOCK_USERS } from "@/data/mockData";
import {
  LayoutDashboard, Hotel, BookOpen, Users, TrendingUp, DollarSign,
  CheckCircle, XCircle, Clock, Star, Plus, Edit, Trash2, Eye, ArrowUp
} from "lucide-react";

type AdminTab = "overview" | "hotels" | "bookings" | "users";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");

  const totalRevenue = MOCK_BOOKINGS.reduce((s, b) => s + b.totalAmount, 0);
  const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === "confirmed").length;
  const totalHotels = MOCK_HOTELS.length;
  const totalUsers = MOCK_USERS.filter(u => u.role === "customer").length;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, change: "+12.5%", color: "text-primary bg-primary/10" },
    { label: "Total Bookings", value: MOCK_BOOKINGS.length, icon: <BookOpen className="h-5 w-5" />, change: "+8.2%", color: "text-ocean bg-ocean/10" },
    { label: "Active Hotels", value: totalHotels, icon: <Hotel className="h-5 w-5" />, change: "+3", color: "text-success bg-success/10" },
    { label: "Total Users", value: totalUsers, icon: <Users className="h-5 w-5" />, change: "+24", color: "text-gold bg-gold/10" },
  ];

  const tabs = [
    { key: "overview" as AdminTab, label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "hotels" as AdminTab, label: "Hotels", icon: <Hotel className="h-4 w-4" /> },
    { key: "bookings" as AdminTab, label: "Bookings", icon: <BookOpen className="h-4 w-4" /> },
    { key: "users" as AdminTab, label: "Users", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="page-header mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-white/80 mt-1">Manage hotels, bookings, users and platform analytics</p>
          <div className="absolute right-6 top-6 flex items-center gap-2">
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

            {/* Revenue Chart Placeholder */}
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

            {/* Recent Bookings */}
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
                          <span className={b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : b.status === "cancelled" ? "badge-danger" : "badge-primary"}>
                            {b.status}
                          </span>
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
              <h2 className="text-lg font-bold">All Hotels ({MOCK_HOTELS.length})</h2>
              <button className="btn-primary text-sm px-4 py-2.5"><Plus className="h-4 w-4" /> Add Hotel</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_HOTELS.map(h => (
                <div key={h.id} className="rounded-2xl border bg-card overflow-hidden">
                  <div className="relative h-40">
                    <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <span className="badge-success text-xs">{h.available ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-1">{h.name}</h3>
                    <p className="text-xs text-muted-foreground">{h.city} · {h.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-gold text-gold" /><span className="text-xs font-medium">{h.rating}</span>
                      <span className="text-xs text-muted-foreground">({h.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary text-sm">₹{h.price.toLocaleString()}/night</span>
                      <div className="flex gap-1">
                        <button onClick={() => navigate(`/hotel/${h.id}`)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted"><Edit className="h-3.5 w-3.5 text-primary" /></button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-danger/10"><Trash2 className="h-3.5 w-3.5 text-danger" /></button>
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
                        <span className={b.status === "confirmed" ? "badge-success" : b.status === "pending" ? "badge-warning" : b.status === "cancelled" ? "badge-danger" : "badge-primary"}>
                          {b.status}
                        </span>
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
    </div>
  );
};

export default AdminDashboard;
