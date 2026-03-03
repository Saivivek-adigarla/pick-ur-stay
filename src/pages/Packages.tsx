import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin, Calendar, Users, Star, Phone, MessageCircle,
  Clock, CheckCircle, ArrowRight, Sparkles, Camera, Music,
  Heart, Plane, Mountain, Palmtree, Building2, PartyPopper
} from "lucide-react";

/* ─────────── DATA ─────────── */
const PHONE = "7036252018";
const WA_LINK = `https://wa.me/91${PHONE}`;
const INSTA_URL = "https://www.instagram.com/pickurstayhotels";

const TIRUPATHI_PACKAGES = [
  {
    id: "tiru-1",
    title: "Tirupathi Darshan Express",
    duration: "2 Days / 1 Night",
    price: 3499,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 214,
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80",
    highlights: ["VIP Darshan Pass", "A/C Hotel Stay", "Prasadam", "Temple Guide"],
    inclusions: ["Pick-up & Drop", "Breakfast", "Kalyanakatta Visit", "Sri Venkateswara Museum"],
    badge: "🔥 Most Popular",
    category: "tirupathi",
  },
  {
    id: "tiru-2",
    title: "Tirupathi Devotional Weekend",
    duration: "3 Days / 2 Nights",
    price: 5999,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=600&q=80",
    highlights: ["Seeghra Darshan", "Premium Hotel", "Padmavathi Temple", "Full Board Meals"],
    inclusions: ["A/C Transport", "3 Meals/Day", "Local Sightseeing", "Travel Insurance"],
    badge: "⭐ Premium",
    category: "tirupathi",
  },
  {
    id: "tiru-3",
    title: "Tirupathi Family Package",
    duration: "2 Days / 1 Night",
    price: 7999,
    originalPrice: 10999,
    rating: 4.7,
    reviews: 97,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
    highlights: ["Family Suite", "Kids Meals", "Group Darshan", "Tirumala Hills Trek"],
    inclusions: ["Family A/C Vehicle", "All Meals", "Guide", "Souvenir"],
    badge: "👨‍👩‍👧‍👦 Family Special",
    category: "tirupathi",
  },
];

const TRIP_PACKAGES = [
  {
    id: "trip-1",
    title: "Goa Beach Getaway",
    duration: "4 Days / 3 Nights",
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80",
    highlights: ["Beachfront Resort", "Water Sports", "Sunset Cruise", "North & South Goa"],
    inclusions: ["Flights", "Hotel", "Breakfast", "Airport Transfer"],
    badge: "🏖️ Beach Bliss",
    category: "trips",
  },
  {
    id: "trip-2",
    title: "Manali Snow Adventure",
    duration: "5 Days / 4 Nights",
    price: 11999,
    originalPrice: 16999,
    rating: 4.9,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    highlights: ["Snow Activities", "Rohtang Pass", "Solang Valley", "Bonfire Nights"],
    inclusions: ["Volvo Bus", "Hotel", "All Meals", "Activity Gear"],
    badge: "❄️ Winter Special",
    category: "trips",
  },
  {
    id: "trip-3",
    title: "Kerala Backwaters Escape",
    duration: "5 Days / 4 Nights",
    price: 13999,
    originalPrice: 18999,
    rating: 4.9,
    reviews: 195,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&q=80",
    highlights: ["Houseboat Stay", "Ayurvedic Spa", "Munnar Hills", "Alleppey Backwaters"],
    inclusions: ["Flights", "Hotels + Houseboat", "Breakfast & Dinner", "Sightseeing"],
    badge: "🌴 Nature Retreat",
    category: "trips",
  },
  {
    id: "trip-4",
    title: "Rajasthan Heritage Tour",
    duration: "7 Days / 6 Nights",
    price: 18999,
    originalPrice: 24999,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80",
    highlights: ["Palace Hotels", "Camel Safari", "Jaipur + Jodhpur + Udaipur", "Cultural Shows"],
    inclusions: ["A/C Car", "Heritage Hotels", "Breakfast", "Guide"],
    badge: "🏰 Royal Experience",
    category: "trips",
  },
];

const EVENT_PACKAGES = [
  {
    id: "event-1",
    title: "Wedding Destination Package",
    duration: "3 Days / 2 Nights",
    price: 99999,
    originalPrice: 149999,
    rating: 5.0,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    highlights: ["Venue Decoration", "Catering 200 Pax", "Photography", "DJ & Music"],
    inclusions: ["Bridal Suite", "Valet Parking", "Live Music", "Full Event Management"],
    badge: "💍 Wedding Special",
    category: "events",
  },
  {
    id: "event-2",
    title: "Birthday Celebration Package",
    duration: "1 Day Event",
    price: 14999,
    originalPrice: 19999,
    rating: 4.8,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    highlights: ["Themed Decoration", "Cake & Snacks", "DJ Night", "Photography"],
    inclusions: ["Venue (4 hrs)", "Balloon Decor", "Cake Cutting", "Return Gifts"],
    badge: "🎂 Birthday Bash",
    category: "events",
  },
  {
    id: "event-3",
    title: "Corporate Team Outing",
    duration: "2 Days / 1 Night",
    price: 24999,
    originalPrice: 34999,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    highlights: ["Team Activities", "Conference Hall", "Gala Dinner", "Award Ceremony"],
    inclusions: ["AC Bus", "Resort Stay", "All Meals", "Team Building Games"],
    badge: "🏢 Corporate",
    category: "events",
  },
  {
    id: "event-4",
    title: "Engagement Ceremony Package",
    duration: "1 Day Event",
    price: 29999,
    originalPrice: 44999,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    highlights: ["Floral Decoration", "Catering 50 Pax", "Photographer", "Ring Ceremony Setup"],
    inclusions: ["Venue (6 hrs)", "Bridal Makeup Artist", "Live Music", "Candlelight Dinner"],
    badge: "💕 Romance Special",
    category: "events",
  },
];

/* ─────────── SUB COMPONENTS ─────────── */
const PackageCard: React.FC<{ pkg: (typeof TIRUPATHI_PACKAGES)[0] }> = ({ pkg }) => {
  const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  return (
    <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-brand-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative">
        <img src={pkg.image} alt={pkg.title} className="h-52 w-full object-cover" />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {pkg.badge}
        </span>
        <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
          {discount}% OFF
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pkg.duration}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />{pkg.rating} ({pkg.reviews})
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pkg.highlights.map(h => (
            <span key={h} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{h}</span>
          ))}
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/ person</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`${WA_LINK}?text=Hi! I'm interested in ${pkg.title} package. Please share details.`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`tel:${PHONE}`}
              className="flex items-center justify-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color: string }> = ({ icon, title, subtitle, color }) => (
  <div className="text-center mb-10">
    <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${color} mx-auto mb-4`}>{icon}</div>
    <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
    <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
  </div>
);

/* ─────────── PAGE ─────────── */
const Packages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tirupathi" | "trips" | "events">("tirupathi");
  const navigate = useNavigate();

  const tabs = [
    { key: "tirupathi", label: "🛕 Tirupathi", icon: <Sparkles className="h-4 w-4" /> },
    { key: "trips", label: "✈️ Trips", icon: <Plane className="h-4 w-4" /> },
    { key: "events", label: "🎉 Events", icon: <PartyPopper className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="cta-gradient py-16 px-4 text-white text-center">
        <div className="container mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-4 backdrop-blur-sm">
            <span className="h-2 w-2 bg-success rounded-full animate-pulse" /> Book directly • Best price guaranteed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Packages & Tours</h1>
          <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
            Tirupathi pilgrimages, holiday trips & memorable events — all curated by PickUrStay Hotels & Travels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <MessageCircle className="h-4 w-4" /> WhatsApp: {PHONE}
            </a>
            <a href={`tel:${PHONE}`}
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/25">
              <Phone className="h-4 w-4" /> Call: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tirupathi Packages */}
      {activeTab === "tirupathi" && (
        <section className="container mx-auto px-4 py-14">
          <SectionHeader
            icon={<Sparkles className="h-7 w-7 text-primary" />}
            title="Tirupathi Packages"
            subtitle="Blessed pilgrimages to Sri Venkateswara Temple with VIP darshan passes, comfortable stays & complete tour management"
            color="bg-primary/10"
          />
          {/* Inclusions Banner */}
          <div className="bg-secondary rounded-2xl p-5 mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🎟️", text: "VIP Darshan Included" },
              { icon: "🏨", text: "Hotel Stay Included" },
              { icon: "🚌", text: "A/C Transport" },
              { icon: "📞", text: "24/7 Support" },
            ].map(i => (
              <div key={i.text} className="flex items-center gap-2 text-sm font-medium">
                <span className="text-xl">{i.icon}</span>{i.text}
              </div>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TIRUPATHI_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
          {/* Custom Package CTA */}
          <div className="mt-10 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Need a Custom Tirupathi Package? 🛕</h3>
            <p className="text-muted-foreground mb-4">Tell us your group size, dates & budget — we'll create a personalized pilgrimage plan for you.</p>
            <a href={`${WA_LINK}?text=Hi! I need a custom Tirupathi package. Please help me plan.`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5">
              <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Trips Packages */}
      {activeTab === "trips" && (
        <section className="container mx-auto px-4 py-14">
          <SectionHeader
            icon={<Plane className="h-7 w-7 text-accent" />}
            title="Holiday Trips"
            subtitle="Explore India's most beautiful destinations — beaches, mountains, backwaters & heritage towns with all-inclusive packages"
            color="bg-accent/10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {TRIP_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
          <div className="mt-10 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Plan Your Dream Trip ✈️</h3>
            <p className="text-muted-foreground mb-4">Honeymoon, solo, group or family — we design trips that match your style & budget.</p>
            <a href={`${WA_LINK}?text=Hi! I want to plan a trip. Please help me with options.`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5">
              <MessageCircle className="h-4 w-4" /> Chat with Us
            </a>
          </div>
        </section>
      )}

      {/* Event Packages */}
      {activeTab === "events" && (
        <section className="container mx-auto px-4 py-14">
          <SectionHeader
            icon={<PartyPopper className="h-7 w-7 text-pink-500" />}
            title="Event Booking Packages"
            subtitle="Weddings, birthdays, corporate events & engagements — we handle every detail so you can celebrate in style"
            color="bg-pink-50"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {EVENT_PACKAGES.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
          <div className="mt-10 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Planning an Event? 🎉</h3>
            <p className="text-muted-foreground mb-4">Whether it's an intimate gathering or a grand celebration, we make it unforgettable. Get a free quote today!</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`${WA_LINK}?text=Hi! I want to book an event package. Please share details.`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
              <a href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all">
                <Phone className="h-4 w-4" /> Call {PHONE}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Contact Strip */}
      <section className="bg-secondary/60 border-t border-b py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">PickUrStay Hotels & Travels</h3>
            <p className="text-muted-foreground text-sm">Your trusted travel partner across India</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <a href={`tel:${PHONE}`}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={INSTA_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @pickurstayhotels
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
