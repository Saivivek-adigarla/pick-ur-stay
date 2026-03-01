import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { MOCK_HOTELS } from "@/data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  "hello|hi|hey": "👋 Hi there! Welcome to PickUrStay! I'm your AI travel assistant. How can I help you find the perfect stay today?",
  "goa|beach|resort": "🌊 Goa is beautiful! We have amazing beachfront resorts starting from ₹4,500/night. The **Azure Beachfront Resort** at Calangute Beach is our top pick with a 4.8 rating! Want me to check availability?",
  "mumbai|city|business": "🏙️ Mumbai has excellent business hotels! **The Metropolitan Grand** in BKC is a fantastic choice at ₹7,200/night, perfect for both business and leisure.",
  "manali|mountain|hill": "⛰️ Manali is breathtaking! Our **Alpine Serenity Lodge** offers cozy mountain stays from ₹3,200/night with stunning Himalayan views and trekking tours.",
  "jaipur|rajasthan|heritage|palace": "👑 Jaipur's royal hospitality awaits! The **Royal Palace Heritage** is a stunning restored palace from the 18th century, rated 4.9 stars!",
  "payment|pay|razorpay|stripe|upi": "💳 We support multiple payment methods:\n• UPI (GPay, PhonePe, Paytm)\n• Credit/Debit Cards (Visa, Mastercard)\n• Net Banking\n• Razorpay & Stripe\n\nAll payments are 100% secure!",
  "cancel|cancellation|refund": "🔄 Our cancellation policy:\n• Free cancellation up to 48 hours before check-in\n• 50% refund between 24-48 hours\n• No refund within 24 hours\n\nRefunds are processed in 5-7 business days.",
  "whatsapp|confirm|confirmation": "📱 After booking, you'll receive:\n• WhatsApp confirmation with hotel details\n• Email receipt with booking ID\n• SMS with check-in instructions\n\nYou can also contact the hotel directly via WhatsApp!",
  "cheapest|budget|affordable|cheap": "💰 Our most affordable options start from just ₹3,200/night at Alpine Serenity Lodge in Manali! Want me to filter hotels by price range?",
  "best|top|popular|recommended": "⭐ Our top-rated hotels:\n1. Royal Palace Heritage, Jaipur - 4.9★\n2. Azure Beachfront Resort, Goa - 4.8★\n3. Kerala Backwater Villas - 4.8★\n\nAll are highly recommended by guests!",
  "check|availability": "📅 To check availability, please visit the hotel's detail page and select your dates. I can also help narrow down which properties are currently available!",
  "pool|gym|spa|amenities": "🏊 We have properties with all premium amenities! Filter by Pool, Spa, Gym, Restaurant, Beach Access, and more on our Hotels page.",
  "wifi|internet": "📶 All our listed hotels provide WiFi. Business hotels offer high-speed fiber connections perfect for remote work!",
  "food|restaurant|dining": "🍽️ Most of our partner hotels have in-house restaurants. Heritage hotels in Jaipur serve authentic Rajasthani cuisine, while beach resorts offer seafood delicacies!",
};

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase();
  for (const [pattern, response] of Object.entries(FAQ_RESPONSES)) {
    if (pattern.split("|").some(p => lower.includes(p))) return response;
  }
  // Hotel count info
  if (lower.includes("how many") || lower.includes("hotels")) {
    return `🏨 We currently have **${MOCK_HOTELS.length} premium hotels** listed across ${[...new Set(MOCK_HOTELS.map(h => h.city))].join(", ")}. More destinations are added daily!`;
  }
  return "🤔 I'm not sure about that specific query. You can:\n• Browse hotels at /hotels\n• Call us: 1800-PUR-STAY\n• Email: support@pickurstay.com\n• Chat with human support via WhatsApp\n\nIs there anything else I can help you with? 😊";
};

const AIChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "👋 Hello! I'm **PickBot**, your AI travel assistant!\n\nI can help you:\n• Find the perfect hotel\n• Check prices & availability\n• Answer booking questions\n• Travel tips & suggestions\n\nWhat can I help you with today? 🌟",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    const response = getAIResponse(input);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() }]);
    setTyping(false);
  };

  const QUICK_REPLIES = ["Best hotels in Goa", "Cheapest options", "Cancel booking", "Payment methods"];

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full cta-gradient shadow-brand-lg transition-all hover:scale-110 animate-pulse-glow md:bottom-6"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">1</span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`fixed bottom-20 right-4 z-50 flex flex-col rounded-2xl border bg-card shadow-brand-lg transition-all duration-300 md:bottom-6 ${minimized ? "h-16 w-72" : "h-[500px] w-80"}`}>
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl p-4 cta-gradient">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">PickBot AI</p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-white/80">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(!minimized)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 text-white">
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${msg.role === "assistant" ? "cta-gradient text-white" : "bg-muted text-muted-foreground"}`}>
                      {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${msg.role === "assistant" ? "bg-muted text-foreground rounded-tl-none" : "cta-gradient text-white rounded-tr-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full cta-gradient">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-muted px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 scrollbar-hide">
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => { setInput(q); }} className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="border-t p-3 flex gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask me anything..."
                  className="input-field flex-1 py-2 text-xs"
                />
                <button onClick={sendMessage} className="btn-primary px-3 py-2 rounded-xl">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot;
