import hotelBeach from "@/assets/hotel-beach.jpg";
import hotelCity from "@/assets/hotel-city.jpg";
import hotelMountain from "@/assets/hotel-mountain.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  location: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  amenities: string[];
  description: string;
  category: string;
  available: boolean;
  ownerId: string;
  lat: number;
  lng: number;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  userId: string;
  userName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentId: string;
  bookingDate: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "hotelOwner";
  avatar: string;
  phone?: string;
  joinedDate: string;
}

export const MOCK_HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "Azure Beachfront Resort",
    city: "Goa",
    location: "Calangute Beach, North Goa",
    price: 4500,
    originalPrice: 6000,
    rating: 4.8,
    reviewCount: 312,
    image: hotelBeach,
    images: [hotelBeach, heroHotel, hotelCity],
    amenities: ["Pool", "WiFi", "Spa", "Restaurant", "Beach Access", "Gym", "Bar", "Parking"],
    description: "Experience luxury on the pristine shores of Goa. Our beachfront resort offers world-class amenities with breathtaking ocean views. Wake up to the sound of waves and enjoy sunset dinners at our rooftop restaurant.",
    category: "Beach Resort",
    available: true,
    ownerId: "o1",
    lat: 15.5441,
    lng: 73.7522,
    rooms: [
      { id: "r1", name: "Deluxe Ocean View", price: 4500, capacity: 2, amenities: ["Ocean View", "King Bed", "AC", "Mini Bar"] },
      { id: "r2", name: "Premium Suite", price: 8500, capacity: 4, amenities: ["Ocean View", "Living Room", "Jacuzzi", "Butler Service"] },
    ]
  },
  {
    id: "h2",
    name: "The Metropolitan Grand",
    city: "Mumbai",
    location: "Bandra Kurla Complex, Mumbai",
    price: 7200,
    originalPrice: 9000,
    rating: 4.6,
    reviewCount: 487,
    image: hotelCity,
    images: [hotelCity, heroHotel, hotelBeach],
    amenities: ["WiFi", "Business Center", "Restaurant", "Gym", "Parking", "Pool", "Concierge"],
    description: "The ultimate business and leisure hotel in the heart of Mumbai's financial district. Featuring panoramic city views, world-class dining, and state-of-the-art conference facilities.",
    category: "Business Hotel",
    available: true,
    ownerId: "o2",
    lat: 19.0607,
    lng: 72.8656,
    rooms: [
      { id: "r3", name: "Superior City View", price: 7200, capacity: 2, amenities: ["City View", "King Bed", "AC", "Work Desk"] },
      { id: "r4", name: "Executive Floor", price: 12000, capacity: 2, amenities: ["Lounge Access", "Premium Wi-Fi", "Butler Service"] },
    ]
  },
  {
    id: "h3",
    name: "Alpine Serenity Lodge",
    city: "Manali",
    location: "Old Manali, Himachal Pradesh",
    price: 3200,
    originalPrice: 4500,
    rating: 4.7,
    reviewCount: 198,
    image: hotelMountain,
    images: [hotelMountain, heroHotel, hotelBeach],
    amenities: ["WiFi", "Fireplace", "Restaurant", "Trekking Tours", "Spa", "Parking", "Room Service"],
    description: "Nestled in the majestic Himalayan peaks, our mountain lodge offers an unforgettable escape. Cozy wooden interiors, roaring fireplaces, and stunning snow-capped views await you.",
    category: "Mountain Retreat",
    available: true,
    ownerId: "o1",
    lat: 32.2396,
    lng: 77.1887,
    rooms: [
      { id: "r5", name: "Mountain View Cottage", price: 3200, capacity: 2, amenities: ["Mountain View", "Fireplace", "Wooden Deck"] },
      { id: "r6", name: "Himalayan Suite", price: 5500, capacity: 4, amenities: ["360° Views", "Private Jacuzzi", "Fireplace"] },
    ]
  },
  {
    id: "h4",
    name: "Royal Palace Heritage",
    city: "Jaipur",
    location: "Old City, Jaipur, Rajasthan",
    price: 5800,
    originalPrice: 7500,
    rating: 4.9,
    reviewCount: 356,
    image: heroHotel,
    images: [heroHotel, hotelCity, hotelMountain],
    amenities: ["Pool", "WiFi", "Cultural Shows", "Restaurant", "Spa", "Heritage Tours", "Bar"],
    description: "Step into a fairy tale at our restored 18th-century palace. Experience true Rajasthani hospitality with ornate architecture, elephant rides, and authentic cuisine prepared by royal chefs.",
    category: "Heritage Hotel",
    available: true,
    ownerId: "o2",
    lat: 26.9124,
    lng: 75.7873,
    rooms: [
      { id: "r7", name: "Royal Courtyard Room", price: 5800, capacity: 2, amenities: ["Courtyard View", "Antique Décor", "AC"] },
      { id: "r8", name: "Maharaja Suite", price: 15000, capacity: 4, amenities: ["Royal Suite", "Private Pool", "Butler", "Heritage Tour"] },
    ]
  },
  {
    id: "h5",
    name: "Kerala Backwater Villas",
    city: "Alleppey",
    location: "Punnamada Lake, Alleppey, Kerala",
    price: 6500,
    originalPrice: 8200,
    rating: 4.8,
    reviewCount: 221,
    image: hotelBeach,
    images: [hotelBeach, hotelMountain, heroHotel],
    amenities: ["WiFi", "Houseboat Tours", "Ayurvedic Spa", "Restaurant", "Kayaking", "Bird Watching"],
    description: "Drift peacefully along Kerala's legendary backwaters from your private villa. Enjoy traditional Ayurvedic treatments, authentic Kerala cuisine, and stunning sunsets over tranquil lagoons.",
    category: "Villa Resort",
    available: true,
    ownerId: "o1",
    lat: 9.4981,
    lng: 76.3388,
    rooms: [
      { id: "r9", name: "Backwater View Villa", price: 6500, capacity: 2, amenities: ["Lake View", "Private Deck", "Ayurvedic Spa"] },
      { id: "r10", name: "Luxury Houseboat Suite", price: 12000, capacity: 4, amenities: ["Floating Villa", "Private Cook", "Kayak"] },
    ]
  },
  {
    id: "h6",
    name: "Delhi NCR Business Hub",
    city: "Delhi",
    location: "Aerocity, New Delhi",
    price: 4800,
    originalPrice: 6200,
    rating: 4.4,
    reviewCount: 543,
    image: hotelCity,
    images: [hotelCity, heroHotel, hotelBeach],
    amenities: ["WiFi", "Airport Shuttle", "Business Center", "Gym", "Restaurant", "Pool", "Lounge"],
    description: "Minutes from Indira Gandhi International Airport, our modern hotel is perfect for business and transit travelers. Featuring fast WiFi, meeting rooms, and a dedicated 24/7 concierge service.",
    category: "Airport Hotel",
    available: true,
    ownerId: "o2",
    lat: 28.5553,
    lng: 77.0945,
    rooms: [
      { id: "r11", name: "Standard Business Room", price: 4800, capacity: 2, amenities: ["Work Desk", "Fast WiFi", "AC"] },
      { id: "r12", name: "Club Floor Room", price: 8000, capacity: 2, amenities: ["Club Lounge", "Breakfast Included", "Airport Transfer"] },
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1", hotelId: "h1", hotelName: "Azure Beachfront Resort", hotelImage: hotelBeach,
    userId: "u1", userName: "Priya Sharma", checkIn: "2025-03-15", checkOut: "2025-03-18",
    guests: 2, rooms: 1, totalAmount: 13500, status: "confirmed",
    paymentId: "pay_abc123", bookingDate: "2025-03-01", city: "Goa"
  },
  {
    id: "b2", hotelId: "h2", hotelName: "The Metropolitan Grand", hotelImage: hotelCity,
    userId: "u1", userName: "Priya Sharma", checkIn: "2025-04-01", checkOut: "2025-04-03",
    guests: 1, rooms: 1, totalAmount: 14400, status: "pending",
    paymentId: "pay_def456", bookingDate: "2025-03-05", city: "Mumbai"
  },
  {
    id: "b3", hotelId: "h3", hotelName: "Alpine Serenity Lodge", hotelImage: hotelMountain,
    userId: "u2", userName: "Rahul Verma", checkIn: "2025-03-20", checkOut: "2025-03-25",
    guests: 4, rooms: 2, totalAmount: 32000, status: "confirmed",
    paymentId: "pay_ghi789", bookingDate: "2025-03-02", city: "Manali"
  },
  {
    id: "b4", hotelId: "h4", hotelName: "Royal Palace Heritage", hotelImage: heroHotel,
    userId: "u3", userName: "Anjali Singh", checkIn: "2025-03-10", checkOut: "2025-03-12",
    guests: 2, rooms: 1, totalAmount: 11600, status: "completed",
    paymentId: "pay_jkl012", bookingDate: "2025-02-28", city: "Jaipur"
  },
];

export const CITIES = ["All Cities", "Goa", "Mumbai", "Delhi", "Jaipur", "Manali", "Alleppey", "Bangalore", "Chennai"];
export const AMENITIES_LIST = ["Pool", "WiFi", "Spa", "Restaurant", "Gym", "Bar", "Parking", "Airport Shuttle", "Beach Access"];

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@example.com", role: "customer", avatar: "PS", phone: "+91 9876543210", joinedDate: "2024-12-01" },
  { id: "u2", name: "Rahul Verma", email: "rahul@example.com", role: "customer", avatar: "RV", phone: "+91 9812345678", joinedDate: "2025-01-15" },
  { id: "u3", name: "Anjali Singh", email: "anjali@example.com", role: "customer", avatar: "AS", phone: "+91 9988776655", joinedDate: "2025-02-01" },
  { id: "o1", name: "Vijay Patel", email: "vijay@hotelowner.com", role: "hotelOwner", avatar: "VP", phone: "+91 9001122334", joinedDate: "2024-11-10" },
  { id: "o2", name: "Meera Nair", email: "meera@hotelowner.com", role: "hotelOwner", avatar: "MN", phone: "+91 9445566778", joinedDate: "2024-10-20" },
  { id: "admin1", name: "Admin User", email: "admin@pickurstay.com", role: "admin", avatar: "AU", joinedDate: "2024-01-01" },
];
