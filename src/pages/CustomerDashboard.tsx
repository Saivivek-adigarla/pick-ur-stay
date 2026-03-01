import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_BOOKINGS, MOCK_HOTELS } from "@/data/mockData";
import { Calendar, MapPin, Users, ArrowRight, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myBookings = MOCK_BOOKINGS.filter(b => b.userId === user?.id || true).slice(0, 4); // show all for demo

  const stats = [
    { label: "Total Bookings", value: myBookings.length, icon: <Calendar className="h-5 w-5" />, color: "text-primary bg-primary/10" },
    { label: "Upcoming Stays", value: myBookings.filter(b => b.status === "confirmed").length, icon: <CheckCircle className="h-5 w-5" />, color: "text-success bg-success/10" },
    { label: "Pending Payment", value: myBookings.filter(b => b.status === "pending").length, icon: <Clock className="h-5 w-5" />, color: "text-gold bg-gold/10" },
    { label: "Total Spent", value: `₹${myBookings.reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}`, icon: <TrendingUp className="h-5 w-5" />, color: "text-ocean bg-ocean/10" },
  ];

  const statusConfig = {
    confirmed: { label: "Confirmed", class: "badge-success", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    pending: { label: "Pending", class: "badge-warning", icon: <Clock className="h-3.5 w-3.5" /> },
    cancelled: { label: "Cancelled", class: "badge-danger", icon: <XCircle className="h-3.5 w-3.5" /> },
    completed: { label: "Completed", class: "badge-primary", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl cta-gradient text-lg font-bold text-white">
              {user?.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground text-sm">Manage your bookings and discover new destinations</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">My Bookings</h2>
              <button onClick={() => navigate("/hotels")} className="text-sm text-primary hover:underline flex items-center gap-1">
                Book New Stay <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {myBookings.length === 0 ? (
                <div className="rounded-2xl border bg-card p-8 text-center">
                  <div className="text-5xl mb-3">🏨</div>
                  <h3 className="font-bold mb-1">No bookings yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start exploring amazing hotels</p>
                  <button onClick={() => navigate("/hotels")} className="btn-primary">Browse Hotels</button>
                </div>
              ) : myBookings.map(booking => {
                const st = statusConfig[booking.status];
                return (
                  <div key={booking.id} className="rounded-2xl border bg-card p-4 flex gap-4">
                    <img src={booking.hotelImage} alt={booking.hotelName} className="h-20 w-24 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-sm line-clamp-1">{booking.hotelName}</h3>
                        <span className={st.class}>{st.icon} {st.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" /> {booking.city}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.checkIn} → {booking.checkOut}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {booking.guests} guests</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary text-sm">₹{booking.totalAmount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">ID: {booking.id}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "🔍 Find Hotels", to: "/hotels" },
                  { label: "📋 Booking History", to: "/dashboard" },
                  { label: "⭐ Write a Review", to: "/hotels" },
                  { label: "💬 Contact Support", to: "#" },
                ].map(a => (
                  <button key={a.label} onClick={() => navigate(a.to)}
                    className="sidebar-item w-full text-left text-sm">
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="font-bold mb-3">✨ Recommended For You</h3>
              <div className="space-y-3">
                {MOCK_HOTELS.slice(0, 3).map(h => (
                  <button key={h.id} onClick={() => navigate(`/hotel/${h.id}`)}
                    className="flex gap-3 w-full hover:bg-muted rounded-xl p-2 transition-colors text-left">
                    <img src={h.image} alt={h.name} className="h-12 w-14 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold line-clamp-1">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.city}</p>
                      <p className="text-xs font-bold text-primary">₹{h.price.toLocaleString()}/night</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
