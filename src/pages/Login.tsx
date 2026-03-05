import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup, GoogleAuthProvider,
  signInWithPhoneNumber, RecaptchaVerifier,
  ConfirmationResult
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  Phone, MessageSquare, Chrome, ArrowLeft, CheckCircle
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

type AuthMode = "choose" | "email" | "phone" | "otp";

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("choose");
  const [loginOrSignup, setLoginOrSignup] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", otp: "", role: "customer" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const redirectAfterLogin = (role: string) => {
    if (role === "admin") navigate("/admin");
    else if (role === "hotelOwner") navigate("/owner");
    else navigate("/hotels");
  };

  // --- Google Sign In ---
  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);
      let role = "customer";
      if (!snap.exists()) {
        const initials = (cred.user.displayName || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
        const appUser = {
          id: cred.user.uid,
          name: cred.user.displayName || "User",
          email: cred.user.email || "",
          role,
          avatar: initials,
          joinedDate: new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, appUser);
      } else {
        role = snap.data().role || "customer";
      }
      redirectAfterLogin(role);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message || "";
      if (msg.includes("popup-closed")) setError("Sign-in cancelled.");
      else setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // --- Phone OTP ---
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const phone = form.phone.trim();
    if (!phone.match(/^\+?[0-9]{10,13}$/)) {
      setError("Enter a valid phone number (e.g. +919876543210)");
      return;
    }
    try {
      setupRecaptcha();
      const fullPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier!);
      window.confirmationResult = confirmation;
      setMode("otp");
      setInfo(`OTP sent to ${fullPhone}`);
    } catch (err: unknown) {
      setError("Failed to send OTP. Check the number and try again.");
      window.recaptchaVerifier = undefined;
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!window.confirmationResult) { setError("Session expired. Please try again."); return; }
    try {
      const cred = await window.confirmationResult.confirm(form.otp);
      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);
      let role = "customer";
      if (!snap.exists()) {
        const appUser = {
          id: cred.user.uid,
          name: cred.user.displayName || `User_${cred.user.uid.slice(0, 6)}`,
          email: cred.user.email || "",
          role,
          avatar: "US",
          joinedDate: new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, appUser);
      } else {
        role = snap.data().role || "customer";
      }
      redirectAfterLogin(role);
    } catch {
      setError("Invalid OTP. Please check and try again.");
    }
  };

  // --- Email ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = loginOrSignup === "login"
      ? await login(form.email, form.password)
      : await signup(form.name, form.email, form.password, form.role);
    if (!result.success) { setError(result.error || "Something went wrong"); return; }
    const cached = JSON.parse(localStorage.getItem("pus_user") || "{}");
    redirectAfterLogin(cached.role || "customer");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Hero */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col overflow-hidden">
        <img src={heroHotel} alt="PickUrStay" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/75 to-cyan-600/60" />
        <div className="relative z-10 flex flex-col h-full justify-between p-12">
          <img src={logo} alt="PickUrStay Hotels & Travels" className="h-14 w-auto object-contain" />
          <div>
            <h1 className="text-5xl font-black text-white mb-4 leading-tight">
              Your Perfect<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #34d399)" }}>
                Stay Awaits.
              </span>
            </h1>
            <p className="text-white/70 text-lg mb-10">Hotels, Tirupati darshan packages, Araku & Vanajangi tours — all in one place.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🏨", val: "500+", lbl: "Hotels" },
                { icon: "⭐", val: "4.9", lbl: "Rating" },
                { icon: "🧳", val: "50K+", lbl: "Travelers" },
              ].map(s => (
                <div key={s.lbl} className="rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-4 text-center text-white">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-black">{s.val}</div>
                  <div className="text-xs text-white/60">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs">© 2025 PickUrStay Hotels & Travels</p>
        </div>
      </div>

      {/* Right panel - Auth */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo} alt="PickUrStay" className="h-12 w-auto object-contain" />
          </div>

          <div id="recaptcha-container" />

          {/* CHOOSE MODE */}
          {mode === "choose" && (
            <div className="animate-fade-up">
              <h2 className="text-3xl font-black mb-2">Welcome! 👋</h2>
              <p className="text-muted-foreground mb-8">Sign in to access exclusive deals & manage your bookings.</p>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 bg-card px-6 py-4 font-semibold hover:bg-muted transition-all mb-4 disabled:opacity-50"
              >
                {googleLoading ? (
                  <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-foreground animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Phone */}
              <button
                onClick={() => setMode("phone")}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 bg-card px-6 py-4 font-semibold hover:bg-muted transition-all mb-4"
              >
                <Phone className="h-5 w-5 text-green-500" />
                Continue with Phone (OTP)
              </button>

              {/* Email */}
              <button
                onClick={() => setMode("email")}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 bg-card px-6 py-4 font-semibold hover:bg-muted transition-all mb-6"
              >
                <Mail className="h-5 w-5 text-primary" />
                Continue with Email & Password
              </button>

              <div className="relative flex items-center mb-6">
                <div className="flex-1 border-t" />
                <span className="px-4 text-xs text-muted-foreground">Secure login powered by Firebase</span>
                <div className="flex-1 border-t" />
              </div>

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">Terms</a> and{" "}
                <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
              </p>
            </div>
          )}

          {/* PHONE MODE */}
          {mode === "phone" && (
            <div className="animate-fade-up">
              <button onClick={() => { setMode("choose"); setError(""); setInfo(""); }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h2 className="text-3xl font-black mb-2">Phone Sign In 📱</h2>
              <p className="text-muted-foreground mb-8">We'll send a one-time OTP to verify your number.</p>
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      required className="input-field pl-11 text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">Include country code, e.g. +91 for India</p>
                </div>
                {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base">
                  {isLoading ? <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Send OTP <MessageSquare className="h-4 w-4" /></>}
                </button>
              </form>
            </div>
          )}

          {/* OTP MODE */}
          {mode === "otp" && (
            <div className="animate-fade-up">
              <button onClick={() => { setMode("phone"); setError(""); setInfo(""); }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h2 className="text-3xl font-black mb-2">Enter OTP 🔐</h2>
              {info && <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700 mb-6 flex items-center gap-2"><CheckCircle className="h-4 w-4 shrink-0" />{info}</div>}
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">6-digit OTP</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6}
                    value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, "") }))}
                    placeholder="• • • • • •"
                    className="input-field text-center text-3xl tracking-[1rem] font-bold py-5"
                  />
                </div>
                {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                <button type="submit" disabled={isLoading || form.otp.length < 6} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                  {isLoading ? <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Verify & Sign In <ArrowRight className="h-4 w-4" /></>}
                </button>
                <button type="button" onClick={() => { setMode("phone"); setError(""); setInfo(""); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors">
                  Didn't receive OTP? Resend
                </button>
              </form>
            </div>
          )}

          {/* EMAIL MODE */}
          {mode === "email" && (
            <div className="animate-fade-up">
              <button onClick={() => { setMode("choose"); setError(""); }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h2 className="text-3xl font-black mb-1">
                {loginOrSignup === "login" ? "Welcome back! 👋" : "Create account 🚀"}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {loginOrSignup === "login" ? "Sign in to your PickUrStay account." : "Join thousands of smart travelers."}
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {loginOrSignup === "signup" && (
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name" required className="input-field pl-9" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com" required className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input type={showPass ? "text" : "password"} value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Min. 6 characters" required minLength={6} className="input-field pl-9 pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {loginOrSignup === "signup" && (
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">I am a</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ v: "customer", l: "🧳 Traveler" }, { v: "hotelOwner", l: "🏨 Hotel Owner" }].map(opt => (
                        <label key={opt.v} className={`flex items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all ${form.role === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                          <input type="radio" name="role" value={opt.v} checked={form.role === opt.v}
                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="sr-only" />
                          <span className="text-sm font-semibold">{opt.l}</span>
                          {form.role === opt.v && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base">
                  {isLoading ? (
                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>{loginOrSignup === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {loginOrSignup === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setLoginOrSignup(loginOrSignup === "login" ? "signup" : "login"); setError(""); }}
                  className="font-bold text-primary hover:underline">
                  {loginOrSignup === "login" ? "Sign up free" : "Sign in"}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
