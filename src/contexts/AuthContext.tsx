import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "hotelOwner";
  avatar: string;
  phone?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const ADMIN_EMAIL = "admin@pickurstay.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Fallback: build from Firebase user
            const initials = (fbUser.displayName || fbUser.email || "U")
              .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const appUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email || "User",
              email: fbUser.email || "",
              role: fbUser.email === ADMIN_EMAIL ? "admin" : "customer",
              avatar: initials,
              joinedDate: new Date().toISOString().split("T")[0],
            };
            setUser(appUser);
          }
        } catch {
          // Firestore offline / permission issue – use local cache
          const cached = localStorage.getItem("pus_user");
          if (cached) setUser(JSON.parse(cached));
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem("pus_user");
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (userDoc.exists()) {
        const appUser = userDoc.data() as User;
        setUser(appUser);
        localStorage.setItem("pus_user", JSON.stringify(appUser));
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const code = (err as { code?: string }).code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        return { success: false, error: "No account found with this email." };
      }
      if (code === "auth/wrong-password") {
        return { success: false, error: "Invalid password." };
      }
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const signup = async (name: string, email: string, password: string, role = "customer") => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
      const appUser: User = {
        id: cred.user.uid,
        name,
        email,
        role: email === ADMIN_EMAIL ? "admin" : (role as User["role"]),
        avatar: initials,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      await setDoc(doc(db, "users", cred.user.uid), {
        ...appUser,
        createdAt: serverTimestamp(),
      });
      setUser(appUser);
      localStorage.setItem("pus_user", JSON.stringify(appUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const code = (err as { code?: string }).code || "";
      if (code === "auth/email-already-in-use") {
        return { success: false, error: "An account with this email already exists." };
      }
      if (code === "auth/weak-password") {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      return { success: false, error: "Signup failed. Please try again." };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem("pus_user");
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
