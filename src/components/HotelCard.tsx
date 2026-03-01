import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Wifi, Wind, Utensils, Waves, Heart } from "lucide-react";
import { Hotel } from "@/data/mockData";
import { useState } from "react";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Pool: <Waves className="h-3 w-3" />,
  Gym: <Wind className="h-3 w-3" />,
  Restaurant: <Utensils className="h-3 w-3" />,
};

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100);

  return (
    <div className="hotel-card group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={`${hotel.name} - hotel in ${hotel.city}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 card-gradient" />

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
        </button>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {hotel.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground leading-tight line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="text-sm font-semibold">{hotel.rating}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="text-sm truncate">{hotel.location}</span>
        </div>

        {/* Amenities */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 4).map(a => (
            <span key={a} className="amenity-pill">
              {AMENITY_ICONS[a]} {a}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="amenity-pill text-muted-foreground">+{hotel.amenities.length - 4}</span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-foreground">₹{hotel.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <Link
            to={`/hotel/${hotel.id}`}
            className="btn-primary text-sm px-4 py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
