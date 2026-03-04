import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import heroHotel from "@/assets/hero-hotel.jpg";
import logo from "@/assets/logo.jpg";

const Login: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = mode === "login"
      ? await login(form.email, form.password)
      : await signup(form.name, form.email, form.password, form.role);

    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }

    // Will auto-redirect via App routing; but manual redirect too
    const user = JSON.parse(localStorage.getItem("pus_user") || "{}");
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "hotelOwner") navigate("/owner");
    else navigate("/hotels");
  };

  const demoAccounts = [
    { label: "Customer", email: "priya@example.com", color: "bg-primary/10 text-primary" },
    { label: "Hotel Owner", email: "vijay@hotelowner.com", color: "bg-success/10 text-success" },
    { label: "Admin", email: "admin@pickurstay.com", color: "bg-gold/10 text-gold" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left - Hero Image */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-3/5">
        <img src={heroHotel} alt="Luxury hotel" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-lg text-center">
          <div className="flex items-center justify-center mb-6">
              <img src={logo} alt="PickUrStay Hotels & Travels" className="h-20 w-auto object-contain drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Stay • Travel • Manage</h1>
            <p className="text-white/80 text-lg mb-8">Discover premium hotels across India's most beautiful destinations.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🏨", label: "500+", sub: "Premium Hotels" },
                { icon: "🌟", label: "50K+", sub: "Happy Guests" },
                { icon: "📍", label: "100+", sub: "Destinations" },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-bold">{s.label}</div>
                  <div className="text-xs text-white/70">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src={logo} alt="PickUrStay Hotels & Travels" className="h-10 w-auto object-contain" />
          </div>

          <h2 className="text-2xl font-bold mb-1">{mode === "login" ? "Welcome back! 👋" : "Create your account 🚀"}</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {mode === "login" ? "Sign in to access your bookings and personalized deals." : "Join thousands of travelers booking smart."}
          </p>

          {/* Demo accounts */}
          <div className="mb-6 rounded-2xl border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">🎯 DEMO ACCOUNTS (any password, min 4 chars)</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.label} onClick={() => setForm(f => ({ ...f, email: acc.email }))}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${acc.color} transition-all hover:scale-105`}>
                  {acc.label}: {acc.email}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name" required className="input-field pl-9" />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" required className="input-field pl-9" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 4 characters" required minLength={4} className="input-field pl-9 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: "customer", label: "🧳 Traveler" }, { value: "hotelOwner", label: "🏨 Hotel Owner" }].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all ${form.role === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <input type="radio" name="role" value={opt.value} checked={form.role === opt.value}
                        onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="sr-only" />
                      <span className="text-sm font-medium">{opt.label}</span>
                      {form.role === opt.value && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="font-semibold text-primary hover:underline">
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
