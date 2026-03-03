import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hotel, Search, Bell, Menu, X, LogOut, User, LayoutDashboard,
  Settings, ChevronDown, MapPin
} from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "hotelOwner") return "/owner";
    return "/dashboard";
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to={getDashboardLink()} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg cta-gradient">
            <Hotel className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">PickUrStay</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 md:flex">
          {user.role === "customer" && (
            <>
              <NavItem to="/hotels" icon={<Search className="h-4 w-4" />} label="Browse Hotels" active={location.pathname === "/hotels"} />
              <NavItem to="/packages" label="Packages & Trips" active={location.pathname === "/packages"} />
              <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="My Bookings" active={location.pathname === "/dashboard"} />
            </>
          )}
          {user.role === "admin" && (
            <>
              <NavItem to="/admin" label="Dashboard" active={location.pathname === "/admin"} />
              <NavItem to="/admin/hotels" label="Hotels" active={location.pathname === "/admin/hotels"} />
              <NavItem to="/admin/bookings" label="Bookings" active={location.pathname === "/admin/bookings"} />
              <NavItem to="/admin/users" label="Users" active={location.pathname === "/admin/users"} />
            </>
          )}
          {user.role === "hotelOwner" && (
            <>
              <NavItem to="/owner" label="Dashboard" active={location.pathname === "/owner"} />
              <NavItem to="/owner/hotels" label="My Hotels" active={location.pathname === "/owner/hotels"} />
              <NavItem to="/owner/bookings" label="Bookings" active={location.pathname === "/owner/bookings"} />
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
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
              <span className="hidden text-sm font-medium md:block">{user.name.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border bg-card p-2 shadow-lg animate-fade-in z-50">
                <div className="px-3 py-2 border-b mb-2">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span className="badge-primary mt-1">{user.role}</span>
                </div>
                <button onClick={() => { navigate(getDashboardLink()); setUserMenuOpen(false); }}
                  className="sidebar-item w-full text-left">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}
                  className="sidebar-item w-full text-left">
                  <User className="h-4 w-4" /> Profile
                </button>
                <button onClick={() => { navigate("/settings"); setUserMenuOpen(false); }}
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

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex md:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t bg-card px-4 py-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {user.role === "customer" && (
              <>
                <MobileNavItem to="/hotels" label="Browse Hotels" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/dashboard" label="My Bookings" onClick={() => setMenuOpen(false)} />
              </>
            )}
            {user.role === "admin" && (
              <>
                <MobileNavItem to="/admin" label="Admin Dashboard" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/admin/hotels" label="Manage Hotels" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/admin/bookings" label="All Bookings" onClick={() => setMenuOpen(false)} />
              </>
            )}
            {user.role === "hotelOwner" && (
              <>
                <MobileNavItem to="/owner" label="Owner Dashboard" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/owner/hotels" label="My Hotels" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/owner/bookings" label="Bookings" onClick={() => setMenuOpen(false)} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {(userMenuOpen || menuOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }} />
      )}
    </nav>
  );
};

const NavItem = ({ to, label, active, icon }: { to: string; label: string; active: boolean; icon?: React.ReactNode }) => (
  <Link to={to} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
    {icon}{label}
  </Link>
);

const MobileNavItem = ({ to, label, onClick }: { to: string; label: string; onClick: () => void }) => (
  <Link to={to} onClick={onClick} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted">
    {label}
  </Link>
);

export default Navbar;
