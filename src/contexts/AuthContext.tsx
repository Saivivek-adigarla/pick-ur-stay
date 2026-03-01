import React, { createContext, useContext, useState, useEffect } from "react";
import { User, MOCK_USERS } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pus_user");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate network
    const found = MOCK_USERS.find(u => u.email === email);
    // Demo: any password works for mock users; admin@pickurstay.com → admin
    if (!found) {
      setIsLoading(false);
      return { success: false, error: "No account found with this email." };
    }
    if (password.length < 4) {
      setIsLoading(false);
      return { success: false, error: "Invalid password." };
    }
    setUser(found);
    localStorage.setItem("pus_user", JSON.stringify(found));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, _password: string, role = "customer") => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `u_${Date.now()}`, name, email,
      role: role as User["role"], avatar: name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      joinedDate: new Date().toISOString().split("T")[0],
    };
    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem("pus_user", JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pus_user");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>;
};
