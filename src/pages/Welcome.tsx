import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Shield, Phone, ArrowRight, Instagram, MessageCircle, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
import hotelBeach from "@/assets/hotel-beach.jpg";
import hotelCity from "@/assets/hotel-city.jpg";
import hotelMountain from "@/assets/hotel-mountain.jpg";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { img: heroHotel, title: "Luxury Beach Resorts", subtitle: "Goa · Vizag · Pondicherry" },
    { img: hotelBeach, title: "Mountain Retreats", subtitle: "Manali · Ooty · Munnar" },
    { img: hotelCity, title: "Heritage Palaces", subtitle: "Jaipur · Udaipur · Mysore" },
    { img: hotelMountain, title: "City Business Hotels", subtitle: "Mumbai · Delhi · Bangalore" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const destinations = [
    { name: "Tirupati", emoji: "🛕", desc: "Darshan Packages" },
    { name: "Araku Valley", emoji: "🏔️", desc: "Nature Retreats" },
    { name: "Vanajangi", emoji: "🌅", desc: "Sunrise Treks" },
    { name: "Goa", emoji: "🏖️", desc: "Beach Resorts" },
    { name: "Manali", emoji: "⛰️", desc: "Snow Adventures" },
    { name: "Kerala", emoji: "🌴", desc: "Backwaters" },
  ];

  const features = [
    { icon: <Shield className="h-6 w-6" />, title: "100% Verified", desc: "Every hotel & package manually verified by our team", color: "text-primary" },
    { icon: <Star className="h-6 w-6" />, title: "Best Price", desc: "Price match guarantee with exclusive member discounts", color: "text-gold" },
    { icon: <Phone className="h-6 w-6" />, title: "24/7 Support", desc: "WhatsApp & phone support round the clock", color: "text-success" },
    { icon: <MapPin className="h-6 w-6" />, title: "100+ Destinations", desc: "Curated travel experiences across India", color: "text-ocean" },
  ];

  const stats = [
    { value: "500+", label: "Hotels" },
    { value: "50K+", label: "Travelers" },
    { value: "4.9★", label: "Rating" },
    { value: "100+", label: "Cities" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.img} alt={slide.title} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
          <img src={logo} alt="PickUrStay Hotels & Travels" className="h-12 w-auto object-contain" />
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/pickurstayhotels"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Instagram className="h-4 w-4 text-pink-400" />
              @pickurstayhotels
            </a>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/25 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white cta-gradient shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
          <div className="max-w-4xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm mb-6 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              India's Trusted Travel Partner
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              Stay.<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #34d399)" }}>
                Travel.
              </span><br />
              Explore.
            </h1>

            <p className="text-white/75 text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
              Hotels, tour packages & darshan assistance — Tirupati, Araku, Vanajangi & beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white text-gray-900 px-8 py-4 text-base font-bold hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-0.5"
              >
                Book Your Stay <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="https://wa.me/917036252018"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 text-white px-8 py-4 text-base font-bold hover:bg-green-600 transition-all shadow-xl hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                Book on WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-16 right-8 z-20 hidden md:flex flex-col items-center gap-1 text-white/50 text-xs">
          <span className="rotate-90">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Explore India</p>
            <h2 className="text-4xl font-bold">Popular Destinations</h2>
            <p className="text-muted-foreground mt-3 text-lg">Handpicked experiences for every kind of traveler</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((d, i) => (
              <button
                key={d.name}
                onClick={() => navigate("/login")}
                className={`group rounded-2xl border bg-card p-5 text-center hover:border-primary hover:-translate-y-2 hover:shadow-lg transition-all duration-300 animate-fade-up stagger-${Math.min(i + 1, 4)}`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{d.emoji}</div>
                <p className="font-bold text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Why PickUrStay</p>
            <h2 className="text-4xl font-bold">Your Trust Is Our Priority</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-current/10 ${f.color}`}
                  style={{ background: `color-mix(in srgb, currentColor 10%, transparent)` }}>
                  <span className={f.color}>{f.icon}</span>
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Preview */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Our Packages</p>
            <h2 className="text-4xl font-bold">Curated Tour Packages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Tirupati Darshan", desc: "One Day & Two Day packages with transport & darshan assistance", img: heroHotel, badge: "Most Popular", from: "₹1,999" },
              { title: "Araku Valley", desc: "1 Day & 2 Day packages with waterfalls, tribal museum & coffee plantation", img: hotelMountain, badge: "Nature", from: "₹2,499" },
              { title: "Vanajangi Hills", desc: "Sunrise special & weekend packages with scenic trekking", img: hotelBeach, badge: "Adventure", from: "₹1,499" },
            ].map(pkg => (
              <div key={pkg.title} className="group rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{pkg.badge}</span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg">{pkg.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{pkg.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-xl font-bold text-primary">{pkg.from}<span className="text-sm font-normal text-muted-foreground">/person</span></p>
                    </div>
                    <button onClick={() => navigate("/login")} className="rounded-xl border-2 border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #fdf2f8, #fff7ed)" }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="h-6 w-6 text-pink-500" />
            <h2 className="text-3xl font-bold">@pickurstayhotels</h2>
          </div>
          <p className="text-muted-foreground mb-8">Follow us for daily travel inspiration & exclusive deals</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[heroHotel, hotelBeach, hotelCity, hotelMountain].map((img, i) => (
              <a key={i} href="https://www.instagram.com/pickurstayhotels" target="_blank" rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden">
                <img src={img} alt="Travel inspiration" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          <a href="https://www.instagram.com/pickurstayhotels" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white hover:-translate-y-0.5 transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #ec4899, #f97316)" }}>
            <Instagram className="h-4 w-4" /> Follow @pickurstayhotels
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 cta-gradient">
        <div className="max-w-2xl mx-auto text-center text-white">
          <img src={logo} alt="PickUrStay" className="h-16 w-auto object-contain mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Dream Stay?</h2>
          <p className="text-white/75 mb-8 text-lg">Join 50,000+ happy travelers who trust PickUrStay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/login")}
              className="rounded-2xl bg-white text-gray-900 px-8 py-4 font-bold hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-0.5">
              Get Started — It's Free
            </button>
            <a href="https://wa.me/917036252018" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 text-white px-8 py-4 font-bold hover:bg-green-600 transition-all shadow-xl hover:-translate-y-0.5">
              <MessageCircle className="h-5 w-5" /> WhatsApp Booking
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="PickUrStay Hotels & Travels" className="h-10 w-auto object-contain" />
          <p className="text-sm text-muted-foreground text-center">© 2025 PickUrStay Hotels & Travels. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/pickurstayhotels" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-pink-500 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://wa.me/917036252018" target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-green-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
