import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import { MOCK_HOTELS, CITIES, AMENITIES_LIST } from "@/data/mockData";
import { Search, SlidersHorizontal, MapPin, X, Star } from "lucide-react";

const HotelsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  let filtered = MOCK_HOTELS.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "All Cities" || h.city === city;
    const matchPrice = h.price <= maxPrice;
    const matchRating = h.rating >= minRating;
    const matchAmenities = selectedAmenities.length === 0 || selectedAmenities.every(a => h.amenities.includes(a));
    return matchSearch && matchCity && matchPrice && matchRating && matchAmenities;
  });

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const activeFilters = (city !== "All Cities" ? 1 : 0) + (maxPrice < 20000 ? 1 : 0) + (minRating > 0 ? 1 : 0) + selectedAmenities.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Search Header */}
      <div className="cta-gradient py-10 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Stay</h1>
          <p className="text-white/80 mb-6">Search from 500+ verified hotels across India</p>
          <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-brand-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search city, hotel name or location..."
                className="w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none bg-muted/40 focus:bg-white border border-transparent focus:border-primary/30" />
            </div>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="rounded-xl border border-border px-3 py-2 text-sm outline-none bg-white hidden md:block">
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn-primary px-5 py-2 rounded-xl text-sm">Search</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span> hotels found
            </p>
            {search && <span className="badge-primary">"{search}" <button onClick={() => setSearch("")}><X className="h-3 w-3 inline" /></button></span>}
            {city !== "All Cities" && <span className="badge-primary"><MapPin className="h-3 w-3 inline" /> {city} <button onClick={() => setCity("All Cities")}><X className="h-3 w-3 inline" /></button></span>}
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm outline-none bg-card">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${showFilters || activeFilters > 0 ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilters > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-xs">{activeFilters}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 shrink-0 hidden md:block">
              <div className="sticky top-20 rounded-2xl border bg-card p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => { setCity("All Cities"); setMaxPrice(20000); setMinRating(0); setSelectedAmenities([]); }}
                    className="text-xs text-primary hover:underline">Clear All</button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">City</label>
                  <select value={city} onChange={e => setCity(e.target.value)} className="input-field text-sm py-2">
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block flex justify-between">
                    Max Price <span className="text-primary font-bold">₹{maxPrice.toLocaleString()}</span>
                  </label>
                  <input type="range" min={1000} max={20000} step={500} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹1,000</span><span>₹20,000</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Min Rating</label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${minRating === r ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                        {r === 0 ? "Any" : <><Star className="h-3 w-3 inline" /> {r}+</>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map(a => (
                      <button key={a} onClick={() => toggleAmenity(a)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${selectedAmenities.includes(a) ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Hotels Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No hotels found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((hotel, i) => (
                  <div key={hotel.id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                    <HotelCard hotel={hotel} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelsPage;
