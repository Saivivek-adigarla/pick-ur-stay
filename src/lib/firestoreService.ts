import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Hotel, Booking, User } from "@/data/mockData";

// ─── Hotels ─────────────────────────────────────────────────────────────────

export const getHotels = async (): Promise<Hotel[]> => {
  const snap = await getDocs(collection(db, "hotels"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Hotel));
};

export const getHotel = async (id: string): Promise<Hotel | null> => {
  const snap = await getDoc(doc(db, "hotels", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Hotel) : null;
};

export const addHotel = async (hotel: Omit<Hotel, "id">) => {
  return addDoc(collection(db, "hotels"), { ...hotel, createdAt: serverTimestamp() });
};

export const updateHotel = async (id: string, data: Partial<Hotel>) => {
  return updateDoc(doc(db, "hotels", id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteHotel = async (id: string) => {
  return deleteDoc(doc(db, "hotels", id));
};

export const getHotelsByOwner = async (ownerId: string): Promise<Hotel[]> => {
  const q = query(collection(db, "hotels"), where("ownerId", "==", ownerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Hotel));
};

// ─── Bookings ────────────────────────────────────────────────────────────────

export const createBooking = async (booking: Omit<Booking, "id">) => {
  return addDoc(collection(db, "bookings"), { ...booking, createdAt: serverTimestamp() });
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId),
    orderBy("bookingDate", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

export const getBookingsByHotel = async (hotelId: string): Promise<Booking[]> => {
  const q = query(collection(db, "bookings"), where("hotelId", "==", hotelId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const q = query(collection(db, "bookings"), orderBy("bookingDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

export const updateBookingStatus = async (id: string, status: Booking["status"]) => {
  return updateDoc(doc(db, "bookings", id), { status, updatedAt: serverTimestamp() });
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAllUsers = async (): Promise<User[]> => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ ...d.data() } as User));
};

export const updateUserRole = async (userId: string, role: User["role"]) => {
  return updateDoc(doc(db, "users", userId), { role });
};

export const upsertUser = async (user: User) => {
  return setDoc(doc(db, "users", user.id), user, { merge: true });
};
