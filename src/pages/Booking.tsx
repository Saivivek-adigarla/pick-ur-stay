import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MOCK_HOTELS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Smartphone, Building, CheckCircle, ArrowLeft, Lock, MessageCircle } from "lucide-react";

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hotel = MOCK_HOTELS.find(h => h.id === id);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "2");
  const roomId = searchParams.get("room") || hotel?.rooms[0]?.id || "";

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("upi");
  const [cardNum, setCardNum] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");

  if (!hotel || !user) { navigate("/hotels"); return null; }

  const room = hotel.rooms.find(r => r.id === roomId) || hotel.rooms[0];
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  const subtotal = room.price * Math.max(nights, 1);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    const id_ = `BK${Date.now().toString().slice(-8)}`;
    setBookingId(id_);
    setBooked(true);
    setProcessing(false);
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <div className="animate-fade-up">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-success/15 mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
            <p className="text-muted-foreground mb-6">Your stay at <strong>{hotel.name}</strong> is confirmed.</p>
            <div className="rounded-2xl border bg-card p-6 text-left mb-6">
              <div className="space-y-3">
                <Row label="Booking ID" value={bookingId} highlight />
                <Row label="Hotel" value={hotel.name} />
                <Row label="Room" value={room.name} />
                <Row label="Check-in" value={new Date(checkIn).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                <Row label="Check-out" value={new Date(checkOut).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                <Row label="Guests" value={`${guests} guests · ${nights} nights`} />
                <div className="border-t pt-3">
                  <Row label="Total Paid" value={`₹${total.toLocaleString()}`} highlight />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                ✅ WhatsApp confirmation sent to your number<br />
                ✅ Email receipt sent to {user.email}
              </div>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`My booking at ${hotel.name} is confirmed! Booking ID: ${bookingId}. Check-in: ${checkIn}`)}`)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-500 py-3 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors">
                <MessageCircle className="h-4 w-4" /> Share Booking on WhatsApp
              </button>
              <button onClick={() => navigate("/dashboard")} className="btn-primary w-full justify-center">
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to hotel
        </button>

        <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Payment Form */}
          <div className="md:col-span-3 space-y-6">
            {/* Guest Info */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-4">Guest Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input defaultValue={user.name} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" defaultValue={user.email} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <input type="tel" placeholder="+91 9999999999" defaultValue={user.phone} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Guests</label>
                  <input type="number" value={guests} min={1} max={10} readOnly className="input-field" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-success" /> Secure Payment</h2>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {([
                  { key: "upi", label: "UPI", icon: <Smartphone className="h-5 w-5" />, sub: "GPay, PhonePe, Paytm" },
                  { key: "card", label: "Card", icon: <CreditCard className="h-5 w-5" />, sub: "Visa, Mastercard, RuPay" },
                  { key: "netbanking", label: "Net Banking", icon: <Building className="h-5 w-5" />, sub: "All major banks" },
                ] as const).map(m => (
                  <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                    className={`rounded-xl border-2 p-3 text-center transition-all ${paymentMethod === m.key ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                    <div className={`mx-auto mb-1 ${paymentMethod === m.key ? "text-primary" : "text-muted-foreground"}`}>{m.icon}</div>
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.sub}</div>
                  </button>
                ))}
              </div>

              <form onSubmit={handlePayment} className="space-y-3">
                {paymentMethod === "upi" && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi" required className="input-field" />
                    <p className="text-xs text-muted-foreground mt-1">Or scan QR code via any UPI app</p>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Card Number</label>
                      <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="1234 5678 9012 3456" required className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Expiry</label>
                        <input placeholder="MM/YY" required className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">CVV</label>
                        <input type="password" placeholder="***" maxLength={3} required className="input-field" />
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethod === "netbanking" && (
                  <select required className="input-field">
                    <option value="">Select Your Bank</option>
                    {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "Punjab National Bank", "Bank of Baroda"].map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                )}

                <button type="submit" disabled={processing} className="btn-primary w-full justify-center mt-2">
                  {processing ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing Payment...</>
                  ) : (
                    `Pay ₹${total.toLocaleString()} Securely`
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" /> Powered by Razorpay · SSL Secured
                </p>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-2">
            <div className="sticky top-20 rounded-2xl border bg-card overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="h-40 w-full object-cover" />
              <div className="p-5 space-y-3">
                <h3 className="font-bold">{hotel.name}</h3>
                <p className="text-sm text-muted-foreground">{hotel.location}</p>
                <div className="border-t pt-3 space-y-2 text-sm">
                  <Row label="Room" value={room.name} />
                  <Row label="Check-in" value={checkIn} />
                  <Row label="Check-out" value={checkOut} />
                  <Row label="Duration" value={`${nights} night${nights > 1 ? "s" : ""}`} />
                  <Row label="Guests" value={`${guests} guests`} />
                  <div className="border-t pt-2 space-y-1">
                    <Row label={`₹${room.price.toLocaleString()} × ${nights} nights`} value={`₹${subtotal.toLocaleString()}`} />
                    <Row label="Taxes (12%)" value={`₹${taxes.toLocaleString()}`} />
                    <div className="border-t pt-1">
                      <Row label="Total" value={`₹${total.toLocaleString()}`} highlight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{label}</span>
    <span className={highlight ? "font-bold text-primary" : "font-medium"}>{value}</span>
  </div>
);

export default BookingPage;
