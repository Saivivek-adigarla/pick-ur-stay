import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// The homepage (/) now shows Welcome.tsx
// Index is kept for backward-compat but simply redirects logged-in users
const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else if (user.role === "hotelOwner") navigate("/owner", { replace: true });
      else navigate("/hotels", { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default Index;
