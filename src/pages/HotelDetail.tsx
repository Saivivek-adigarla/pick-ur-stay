import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_HOTELS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star, MapPin, Wifi, Waves, Utensils, Wind, ChevronLeft, ChevronRight,
  Share2, MessageCircle, ArrowRight, Check, Users, BedDouble, Calendar
} from "lucide-react";

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => h.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(hotel?.rooms[0]?.id || "");

  if (!hotel) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h2 className="text-2xl font-bold mb-2">Hotel not found</h2>
        <button onClick={() => navigate("/hotels")} className="btn-primary">Browse Hotels</button>
      </div>
    </div>
  );

  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  const room = hotel.rooms.find(r => r.id === selectedRoom);
  const total = (room?.price || hotel.price) * Math.max(nights, 1);

  const handleBook = () => {
    if (!user) { navigate("/login"); return; }
    if (!checkIn || !checkOut) { alert("Please select check-in and check-out dates"); return; }
    navigate(`/booking/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&room=${selectedRoom}`);
  };

  const whatsappShare = () => {
    const msg = `Check out ${hotel.name} in ${hotel.city}! Starting from ₹${hotel.price}/night. Book now: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button onClick={() => navigate("/hotels")} className="hover:text-primary">Hotels</button>
          <span>/</span>
          <span>{hotel.city}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{hotel.name}</span>
        </nav>

        {/* Image Gallery */}
        <div className="relative mb-6 rounded-3xl overflow-hidden">
          <div className="h-72 md:h-96 relative">
            <img src={hotel.images[activeImg]} alt={hotel.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {/* Navigation */}
            <button onClick={() => setActiveImg((activeImg - 1 + hotel.images.length) % hotel.images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setActiveImg((activeImg + 1) % hotel.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white">
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {hotel.images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-2 w-2 rounded-full transition-all ${i === activeImg ? "bg-white w-6" : "bg-white/50"}`} />
              ))}
            </div>
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="badge-primary">{hotel.category}</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 p-3 bg-card">
            {hotel.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{hotel.name}</h1>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={whatsappShare} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                    <MessageCircle className="h-4 w-4 text-green-500" /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-xl bg-gold/10 px-3 py-1.5">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-bold text-gold">{hotel.rating}</span>
                  <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
                </div>
                <span className={`badge-${hotel.available ? "success" : "danger"}`}>
                  {hotel.available ? "✓ Available" : "✗ Sold Out"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-2">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-4">Available Rooms</h2>
              <div className="space-y-3">
                {hotel.rooms.map(room => (
                  <label key={room.id} className={`flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedRoom === room.id ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="room" value={room.id} checked={selectedRoom === room.id}
                        onChange={e => setSelectedRoom(e.target.value)} className="sr-only" />
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <BedDouble className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{room.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" /> Up to {room.capacity} guests
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.amenities.map(a => <span key={a} className="text-xs bg-muted rounded-full px-2 py-0.5">{a}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">₹{room.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-3">Location on Map</h2>
              <div className="rounded-xl bg-gradient-to-br from-sky/20 to-primary/10 border h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">{hotel.name}</p>
                  <p className="text-sm text-muted-foreground">{hotel.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">Lat: {hotel.lat}, Lng: {hotel.lng}</p>
                  <a href={`https://maps.google.com/?q=${hotel.lat},${hotel.lng}`} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    Open in Google Maps <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-3xl border bg-card p-6 shadow-brand-md">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">₹{(room?.price || hotel.price).toLocaleString()}</span>
                  <span className="text-muted-foreground">/night</span>
                </div>
                {hotel.originalPrice > hotel.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-muted-foreground">₹{hotel.originalPrice.toLocaleString()}</span>
                    <span className="badge-success text-xs">Save {Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Check-in
                  </label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field text-sm py-2.5" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Check-out
                  </label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="input-field text-sm py-2.5" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block flex items-center gap-1">
                    <Users className="h-3 w-3" /> Guests
                  </label>
                  <input type="number" value={guests} min={1} max={10} onChange={e => setGuests(+e.target.value)}
                    className="input-field text-sm py-2.5" />
                </div>
              </div>

              {checkIn && checkOut && nights > 0 && (
                <div className="mb-4 rounded-xl bg-muted p-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">₹{(room?.price || hotel.price).toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span>₹{Math.round(total * 0.12).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-1.5 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{Math.round(total * 1.12).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} className="btn-primary w-full justify-center mb-3">
                {user ? "Book Now" : "Sign In to Book"} <ArrowRight className="h-4 w-4" />
              </button>

              <button onClick={whatsappShare}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-green-50 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-100 transition-colors">
                <MessageCircle className="h-4 w-4" /> Share on WhatsApp
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">Free cancellation · No booking fee</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelDetail;
