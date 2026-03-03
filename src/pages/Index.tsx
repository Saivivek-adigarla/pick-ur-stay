import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import { MOCK_HOTELS } from "@/data/mockData";
import { Search, Star, Shield, Headphones, MapPin, Instagram, ArrowRight, Hotel } from "lucide-react";
import heroHotel from "@/assets/hero-hotel.jpg";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "hotelOwner") navigate("/owner");
      else navigate("/hotels");
    }
  }, [user, navigate]);

  if (user) return null;

  const cities = [
    { name: "Goa", emoji: "🏖️", hotels: 48 },
    { name: "Mumbai", emoji: "🏙️", hotels: 124 },
    { name: "Delhi", emoji: "🕌", hotels: 89 },
    { name: "Jaipur", emoji: "🏰", hotels: 67 },
    { name: "Manali", emoji: "⛰️", hotels: 33 },
    { name: "Kerala", emoji: "🌴", hotels: 55 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img src={heroHotel} alt="Luxury hotel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/50" />
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              500+ verified hotels · Book with confidence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Book Smart<br /><span className="text-sky">Travel Easy</span>
            </h1>
            <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Discover India's finest hotels — from beachfront resorts to mountain retreats, heritage palaces to city towers.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full rounded-xl bg-white/15 py-3 pl-10 pr-3 text-white placeholder:text-white/60 outline-none border border-white/20 focus:border-white/50"
                />
              </div>
        <button onClick={() => navigate("/login")} className="btn-primary py-3 px-8 rounded-xl">
                <Search className="h-4 w-4" /> Search Hotels
              </button>
              <button onClick={() => navigate("/packages")} className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-sm hover:bg-white/25 transition-colors">
                ✈️ View Packages
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
          <p className="text-muted-foreground">Explore hotels across India's most loved travel spots</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city, i) => (
            <button key={city.name} onClick={() => navigate("/login")}
              className={`rounded-2xl border bg-card p-4 text-center hover:border-primary hover:-translate-y-1 hover:shadow-brand-md transition-all duration-300 animate-fade-up stagger-${Math.min(i + 1, 4)}`}>
              <div className="text-4xl mb-2">{city.emoji}</div>
              <p className="font-bold">{city.name}</p>
              <p className="text-xs text-muted-foreground">{city.hotels} hotels</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-1">Featured Hotels</h2>
              <p className="text-muted-foreground">Handpicked premium stays for unforgettable experiences</p>
            </div>
            <button onClick={() => navigate("/login")} className="btn-outline hidden md:flex">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_HOTELS.slice(0, 3).map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Why Choose PickUrStay?</h2>
          <p className="text-muted-foreground">Your trust is our top priority</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Shield className="h-7 w-7" />, title: "100% Verified Hotels", desc: "Every hotel is manually verified by our team. No fake listings, ever.", color: "text-primary bg-primary/10" },
            { icon: <Star className="h-7 w-7" />, title: "Best Price Guarantee", desc: "Find a lower price? We'll match it! Plus get exclusive member discounts.", color: "text-gold bg-gold/10" },
            { icon: <Headphones className="h-7 w-7" />, title: "24/7 Support", desc: "Round-the-clock WhatsApp and phone support for all your booking needs.", color: "text-success bg-success/10" },
          ].map(f => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 text-center hover:shadow-brand-md transition-shadow">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${f.color}`}>{f.icon}</div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Feed Preview */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Instagram className="h-6 w-6 text-pink-500" />
              <h2 className="text-3xl font-bold">@pickurstay</h2>
            </div>
            <p className="text-muted-foreground">Follow us for daily travel inspiration</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[MOCK_HOTELS[0].image, MOCK_HOTELS[1].image, MOCK_HOTELS[2].image, MOCK_HOTELS[3].image].map((img, i) => (
              <a key={i} href="https://instagram.com/pickurstay" target="_blank" rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden">
                <img src={img} alt="Travel inspiration" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                  <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="https://instagram.com/pickurstay" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-3 font-semibold text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
              <Instagram className="h-4 w-4" /> Follow @pickurstay
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-gradient py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center text-white">
          <Hotel className="h-12 w-12 mx-auto mb-4 animate-float" />
          <h2 className="text-3xl font-bold mb-3">Ready to Book Your Dream Stay?</h2>
          <p className="text-white/80 mb-6">Join 50,000+ happy travelers who trust PickUrStay</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary bg-white text-primary hover:bg-white/90 shadow-lg">
              Get Started — It's Free
            </Link>
            <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              List Your Hotel
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
