import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AIChatbot from "@/components/AIChatbot";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Packages from "./pages/Packages";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "hotelOwner") return <Navigate to="/owner" replace />;
  return <Navigate to="/hotels" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public welcome page */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/packages" element={<Packages />} />

            {/* Role-based redirect */}
            <Route path="/redirect" element={<DashboardRedirect />} />

            {/* Customer */}
            <Route path="/hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
            <Route path="/hotel/:id" element={<ProtectedRoute><HotelDetail /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute roles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/hotels" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

            {/* Hotel Owner */}
            <Route path="/owner" element={<ProtectedRoute roles={["hotelOwner"]}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/hotels" element={<ProtectedRoute roles={["hotelOwner"]}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/bookings" element={<ProtectedRoute roles={["hotelOwner"]}><OwnerDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
