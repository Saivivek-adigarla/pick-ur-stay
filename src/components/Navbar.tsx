import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, Bell, Menu, X, LogOut, User, LayoutDashboard,
  ChevronDown, Instagram, Hotel as HotelIcon, BookOpen, Users, Settings
} from "lucide-react";
import logo from "@/assets/logo.jpg";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "hotelOwner") return "/owner";
    return "/hotels";
  };

  if (!user) return null;

  type NavItem = { to: string; label: string; icon?: React.ReactNode };

  const customerNav: NavItem[] = [
    { to: "/hotels", label: "Browse Hotels", icon: <Search className="h-4 w-4" /> },
    { to: "/packages", label: "Packages", icon: <HotelIcon className="h-4 w-4" /> },
    { to: "/dashboard", label: "My Bookings", icon: <BookOpen className="h-4 w-4" /> },
  ];

  const adminNav: NavItem[] = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/hotels", label: "Hotels" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/users", label: "Users" },
  ];

  const ownerNav: NavItem[] = [
    { to: "/owner", label: "Dashboard" },
    { to: "/owner/hotels", label: "My Hotels" },
    { to: "/owner/bookings", label: "Bookings" },
  ];

  const navItems: NavItem[] = user.role === "admin" ? adminNav : user.role === "hotelOwner" ? ownerNav : customerNav;

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to={getDashboardLink()} className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="PickUrStay" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(item => (
            <Link
              key={item.to} to={item.to}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {"icon" in item && item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/pickurstayhotels"
            target="_blank" rel="noopener noreferrer"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
            title="Instagram"
          >
            <Instagram className="h-4 w-4 text-pink-500" />
          </a>

          <button className="relative hidden md:flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full cta-gradient text-xs font-bold text-white">
                {user.avatar}
              </div>
              <span className="hidden text-sm font-medium md:block max-w-20 truncate">{user.name.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl border bg-card p-2 shadow-xl animate-fade-in z-50">
                <div className="px-3 py-2.5 border-b mb-2">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <span className="badge-primary mt-1.5 capitalize">{user.role === "hotelOwner" ? "Hotel Owner" : user.role}</span>
                </div>
                <button onClick={() => { navigate(getDashboardLink()); setUserMenuOpen(false); }}
                  className="sidebar-item w-full text-left">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button onClick={() => { setUserMenuOpen(false); }}
                  className="sidebar-item w-full text-left">
                  <User className="h-4 w-4" /> Profile
                </button>
                <button onClick={() => { setUserMenuOpen(false); }}
                  className="sidebar-item w-full text-left">
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <div className="my-1 border-t" />
                <button onClick={handleLogout} className="sidebar-item w-full text-left text-danger">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex md:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t bg-card px-4 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <Link
                key={item.to} to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.to ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                {"icon" in item && item.icon}
                {item.label}
              </Link>
            ))}
            <div className="border-t my-2" />
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {(userMenuOpen || menuOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }} />
      )}
    </nav>
  );
};

export default Navbar;
