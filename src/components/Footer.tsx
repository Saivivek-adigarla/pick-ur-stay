import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, MessageCircle, Star, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer: React.FC = () => {
  const whatsappNumber = "+917036252018";
  const instagramUrl = "https://www.instagram.com/pickurstayhotels";

  return (
    <footer className="border-t bg-card mt-16">
      {/* Instagram Section */}
      <div className="border-b bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-lg font-bold">Follow Our Journey 📸</h3>
              <p className="text-sm text-muted-foreground">Get inspired by beautiful stays & travel stories</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
              <Instagram className="h-4 w-4" />
                @pickurstayhotels
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="PickUrStay Hotels & Travels" className="h-12 w-auto object-contain" />
          </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's premium hotel booking platform. Find your perfect stay from thousands of verified properties.
            </p>
            <div className="mt-4 flex gap-3">
              <SocialBtn href="https://www.instagram.com/pickurstayhotels" icon={<Instagram className="h-4 w-4" />} />
              <SocialBtn href="https://facebook.com/pickurstay" icon={<Facebook className="h-4 w-4" />} />
              <SocialBtn href="https://twitter.com/pickurstay" icon={<Twitter className="h-4 w-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Explore</h4>
            <ul className="space-y-2">
              {["Hotels in Goa", "Hotels in Mumbai", "Hotels in Delhi", "Hotels in Jaipur", "Hotels in Manali", "Hotels in Kerala"].map(l => (
                <li key={l}>
                  <Link to="/hotels" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Partner With Us", "List Your Hotel", "Travel Blog", "Press"].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4 text-green-500" />
                {whatsappNumber}
              </a>
              <a href="mailto:support@pickurstay.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                support@pickurstay.com
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                7036252018
              </div>
              <div className="mt-4 flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}
                <span className="ml-1 text-xs font-medium">4.9 · 12K+ Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">© 2025 PickUrStay. All rights reserved. Made with ❤️ in India</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"].map(l => (
              <a key={l} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialBtn = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
    {icon}
  </a>
);

export default Footer;
