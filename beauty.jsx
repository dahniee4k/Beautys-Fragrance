import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search, Heart, User, ShoppingBag, Menu, X, ChevronLeft, ChevronRight,
  Star, Plus, Minus, Check, Truck, ShieldCheck, Sparkles, MessageCircle,
  MapPin, Package, ChevronDown, Trash2, Edit3, LayoutDashboard, Users,
  Settings, BarChart3, Image as ImageIcon, Tag, ArrowRight, Eye,
} from "lucide-react";

/* ============================================================
   BEAUTY'S FRAGRANCE — front-end demo build.
   Everything here (products, orders, reviews, delivery prices)
   lives in React state to simulate a real store + admin panel.
   In production this state would be replaced by real API calls
   to an authenticated backend (see comments marked BACKEND:).
   ============================================================ */

const NGN = (n) => "₦" + n.toLocaleString("en-NG");
const WHATSAPP_NUMBER = "2348144711396";

const COLORS = {
  black: "#080808",
  gold: "#D9A441",
  metallicGold: "#B8862D",
  champagne: "#E8C98A",
  cream: "#F3E3CC",
  ivory: "#FAF6EF",
  brown: "#3A2415",
};

/* ---------------------------- Demo data ---------------------------- */

const CATEGORIES = [
  { id: "perfumes", name: "Luxury Perfumes", tag: "Elegant everyday & signature fragrances", span: "large" },
  { id: "sprays", name: "Body Sprays", tag: "Fresh scents for everyday confidence", span: "small" },
  { id: "oils", name: "Perfume Oils", tag: "Concentrated fragrances designed to last", span: "small" },
  { id: "mist", name: "Body Mist", tag: "Light, refreshing scents", span: "small" },
  { id: "humidifiers", name: "Humidifiers", tag: "Create a beautifully scented environment", span: "small" },
  { id: "atomizers", name: "Atomizers", tag: "Portable fragrance for life on the go", span: "large" },
];

const INITIAL_PRODUCTS = [
  { id: "p1", name: "Beauty's Signature Gold", category: "perfumes", price: 45000, discountPrice: null, rating: 4.8, reviews: 34, stock: 12, badge: "Best Seller", featured: true, gradient: "linear-gradient(160deg,#B8862D,#F3D58A)", top: ["Bergamot", "Pink Pepper", "Saffron"], heart: ["Rose", "Oud", "Jasmine"], base: ["Amber", "Musk", "Sandalwood"], desc: "A radiant signature scent built around Nigerian warmth and old-world elegance — bright on the first breath, resinous and golden by evening.", size: ["30ml", "50ml", "100ml"] },
  { id: "p2", name: "Velvet Noir Eau de Parfum", category: "perfumes", price: 52000, discountPrice: 46000, rating: 4.9, reviews: 51, stock: 8, badge: "Best Seller", featured: true, gradient: "linear-gradient(160deg,#3A2415,#080808)", top: ["Black Pepper", "Cardamom"], heart: ["Leather", "Iris"], base: ["Vanilla", "Tonka Bean", "Vetiver"], desc: "Deep, smoky and unforgettable. Velvet Noir is built for evenings that matter.", size: ["30ml", "50ml", "100ml"] },
  { id: "p3", name: "Champagne Bloom", category: "perfumes", price: 38000, discountPrice: null, rating: 4.6, reviews: 22, stock: 15, badge: "New", featured: false, gradient: "linear-gradient(160deg,#E8C98A,#FAF6EF)", top: ["Green Apple", "Mandarin"], heart: ["Peony", "Freesia"], base: ["White Musk", "Cedarwood"], desc: "A sparkling floral that opens like champagne and settles into soft, clean musk.", size: ["30ml", "50ml"] },
  { id: "p4", name: "Golden Hour Body Spray", category: "sprays", price: 8500, discountPrice: null, rating: 4.5, reviews: 61, stock: 40, badge: "Best Seller", featured: true, gradient: "linear-gradient(160deg,#D9A441,#F3E3CC)", top: ["Coconut", "Citrus"], heart: ["Vanilla Orchid"], base: ["Warm Sugar"], desc: "A sun-kissed everyday spray — light enough to layer, warm enough to linger.", size: ["150ml", "250ml"] },
  { id: "p5", name: "Rose Oud Perfume Oil", category: "oils", price: 15000, discountPrice: 12500, rating: 4.7, reviews: 29, stock: 18, badge: null, featured: true, gradient: "linear-gradient(160deg,#3A2415,#B8862D)", top: ["Rose Water"], heart: ["Turkish Rose", "Oud"], base: ["Amber Resin"], desc: "Concentrated, alcohol-free and long-lasting — a few drops carry all day.", size: ["6ml", "12ml"] },
  { id: "p6", name: "Ivory Musk Body Mist", category: "mist", price: 6500, discountPrice: null, rating: 4.4, reviews: 18, stock: 33, badge: null, featured: false, gradient: "linear-gradient(160deg,#FAF6EF,#E8C98A)", top: ["Pear"], heart: ["Cotton Flower"], base: ["White Musk"], desc: "Freshly-laundered softness in a bottle — subtle and clean.", size: ["200ml"] },
  { id: "p7", name: "Bergamot Nights Perfume Oil", category: "oils", price: 14000, discountPrice: null, rating: 4.6, reviews: 12, stock: 20, badge: "New", featured: false, gradient: "linear-gradient(160deg,#080808,#3A2415)", top: ["Bergamot"], heart: ["Neroli"], base: ["Sandalwood"], desc: "A citrus-woody oil that feels crisp by day and grounded by night.", size: ["6ml", "12ml"] },
  { id: "p8", name: "Amber Room Diffuser Humidifier", category: "humidifiers", price: 22000, discountPrice: null, rating: 4.3, reviews: 9, stock: 6, badge: null, featured: false, gradient: "linear-gradient(160deg,#F3E3CC,#B8862D)", top: [], heart: [], base: [], desc: "Ultrasonic humidifier with an amber-glass reservoir. Diffuse your favourite fragrance oil through any room.", size: ["Standard"] },
  { id: "p9", name: "Beauty's Pocket Atomizer", category: "atomizers", price: 4500, discountPrice: null, rating: 4.2, reviews: 14, stock: 50, badge: "Best Seller", featured: true, gradient: "linear-gradient(160deg,#D9A441,#3A2415)", top: [], heart: [], base: [], desc: "Refillable travel atomizer in brushed gold — carry your signature scent anywhere.", size: ["8ml"] },
  { id: "p10", name: "Blush Silk Eau de Parfum", category: "perfumes", price: 41000, discountPrice: null, rating: 4.7, reviews: 27, stock: 10, badge: null, featured: false, gradient: "linear-gradient(160deg,#F3D58A,#D9A441)", top: ["Litchi", "Pink Grapefruit"], heart: ["Peony", "Rose"], base: ["Musk", "Cashmere Wood"], desc: "Soft, feminine and effortlessly elegant — for the days you want to feel like silk.", size: ["30ml", "50ml", "100ml"] },
  { id: "p11", name: "Citrus Glow Body Spray", category: "sprays", price: 7800, discountPrice: null, rating: 4.3, reviews: 20, stock: 28, badge: null, featured: false, gradient: "linear-gradient(160deg,#E8C98A,#D9A441)", top: ["Orange Blossom"], heart: ["Mango"], base: ["Coconut Milk"], desc: "A bright, juicy layer scent that keeps you feeling fresh all day.", size: ["150ml"] },
  { id: "p12", name: "Midnight Oud Perfume Oil", category: "oils", price: 16500, discountPrice: null, rating: 4.9, reviews: 33, stock: 5, badge: "Best Seller", featured: true, gradient: "linear-gradient(160deg,#080808,#B8862D)", top: ["Saffron"], heart: ["Oud", "Rose"], base: ["Amber", "Musk"], desc: "Rich, smoky oud balanced with rose and warm amber — intensely long-lasting.", size: ["6ml", "12ml"] },
];

const INITIAL_SLIDES = [
  { id: "s1", enabled: true, eyebrow: "The Signature Line", title: "More than a scent.\nA feeling.", body: "Discover fragrances that express your personality and leave a lasting impression.", cta: "Shop Fragrances", dest: "perfumes", gradient: "linear-gradient(135deg,#080808,#24170D,#080808)" },
  { id: "s2", enabled: true, eyebrow: "Made For You", title: "Find your\nsignature scent.", body: "Luxury fragrances made for every mood, moment and personality.", cta: "Explore Perfumes", dest: "perfumes", gradient: "linear-gradient(135deg,#3A2415,#B8862D,#3A2415)" },
  { id: "s3", enabled: true, eyebrow: "Everyday Ritual", title: "Smell good.\nFeel good.", body: "Discover body mists, sprays and oils designed to keep you feeling fresh and confident.", cta: "Shop Body Collection", dest: "mist", gradient: "linear-gradient(135deg,#F3E3CC,#E8C98A,#D9A441)" },
  { id: "s4", enabled: true, eyebrow: "Beauty, Within Reach", title: "Luxury within\nreach.", body: "Premium scents. Beautiful experiences. Affordable prices.", cta: "Shop Now", dest: "all", gradient: "linear-gradient(135deg,#080808,#3A2415,#080808)" },
];

const INITIAL_REVIEWS = [
  { id: "r1", name: "Chiamaka O.", rating: 5, text: "The scent lasted all day and the delivery was surprisingly fast. Already ordered my second bottle." },
  { id: "r2", name: "Tobenna A.", rating: 5, text: "Velvet Noir gets me compliments every single time I wear it. Packaging feels genuinely premium." },
  { id: "r3", name: "Fareedah M.", rating: 4, text: "Lovely fragrance oil, very concentrated. Wish the bottle was a little bigger but the scent is worth it." },
  { id: "r4", name: "Ugochi N.", rating: 5, text: "Ordered via WhatsApp and it was so easy. My Golden Hour spray arrived in two days." },
];

const NIGERIAN_STATES = ["Lagos", "Abuja (FCT)", "Anambra", "Rivers", "Oyo", "Kano", "Enugu", "Delta", "Ogun", "Kaduna"];

const INITIAL_DELIVERY = {
  Lagos: 2500, "Abuja (FCT)": 4000, Anambra: 3500, Rivers: 3500, Oyo: 3000,
  Kano: 4500, Enugu: 3500, Delta: 3500, Ogun: 2800, Kaduna: 4500,
};

const INITIAL_ORDERS = [
  { id: "BF-10231", customer: "Chiamaka Obi", phone: "0803 220 1145", items: [{ name: "Beauty's Signature Gold", qty: 1, price: 45000 }], total: 47500, state: "Lagos", address: "12 Admiralty Way, Lekki Phase 1", payment: "Paid", status: "Shipped", date: "2026-09-01" },
  { id: "BF-10232", customer: "Tobenna Ade", phone: "0812 664 9021", items: [{ name: "Velvet Noir Eau de Parfum", qty: 1, price: 46000 }], total: 50000, state: "Abuja (FCT)", address: "9 Aso Drive, Maitama", payment: "Paid", status: "Processing", date: "2026-09-02" },
  { id: "BF-10233", customer: "Fareedah Musa", phone: "0705 512 3390", items: [{ name: "Rose Oud Perfume Oil", qty: 2, price: 12500 }], total: 28500, state: "Kano", payment: "Pending", address: "5 Zoo Road", status: "Pending", date: "2026-09-03" },
  { id: "BF-10234", customer: "Ugochi Nwosu", phone: "0909 118 4432", items: [{ name: "Golden Hour Body Spray", qty: 2, price: 8500 }], total: 19500, state: "Rivers", address: "22 Aba Road, Port Harcourt", payment: "Paid", status: "Delivered", date: "2026-08-29" },
];

const STATUS_STEPS = ["Order Received", "Payment Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
const statusIndex = (s) => Math.max(0, STATUS_STEPS.findIndex((x) => x.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(x.toLowerCase().split(" ")[0])));

/* ---------------------------- Global styles ---------------------------- */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');
    .bf-root { font-family:'DM Sans',sans-serif; background:${COLORS.ivory}; color:${COLORS.black}; -webkit-font-smoothing:antialiased; }
    .bf-root * { box-sizing:border-box; }
    .bf-h { font-family:'Playfair Display',serif; }
    .bf-eyebrow { font-size:11px; letter-spacing:0.18em; font-weight:600; color:${COLORS.metallicGold}; }
    .bf-btn-gold { background:${COLORS.black}; color:${COLORS.champagne}; border:1px solid ${COLORS.gold}; padding:14px 30px; font-size:13px; letter-spacing:0.08em; cursor:pointer; transition:all .25s ease; font-family:'DM Sans',sans-serif; font-weight:600; }
    .bf-btn-gold:hover { background:${COLORS.gold}; color:${COLORS.black}; }
    .bf-btn-outline { background:transparent; color:${COLORS.black}; border:1px solid ${COLORS.black}; padding:13px 28px; font-size:13px; letter-spacing:0.06em; cursor:pointer; transition:all .25s ease; font-weight:600; }
    .bf-btn-outline:hover { border-color:${COLORS.gold}; color:${COLORS.metallicGold}; }
    .bf-line { height:1px; background:linear-gradient(90deg,transparent,${COLORS.gold},transparent); }
    .bf-scrollbar-none::-webkit-scrollbar{display:none;}
    .bf-scrollbar-none{ -ms-overflow-style:none; scrollbar-width:none; }
    .bf-fadein { animation: bfFade .5s ease both; }
    @keyframes bfFade { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);} }
    .bf-kenburns { animation: bfKen 9s ease-in-out infinite alternate; }
    @keyframes bfKen { from{ transform:scale(1);} to{ transform:scale(1.08);} }
    input:focus, select:focus, textarea:focus, button:focus-visible { outline:2px solid ${COLORS.gold}; outline-offset:2px; }
  `}</style>
);

/* ---------------------------- Small building blocks ---------------------------- */

const Stars = ({ rating, size = 13 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size} fill={i <= Math.round(rating) ? COLORS.gold : "none"} color={COLORS.gold} strokeWidth={1.5} />
    ))}
  </div>
);

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: COLORS.black, color: COLORS.ivory, padding: "12px 22px", borderRadius: 2, border: `1px solid ${COLORS.gold}`, fontSize: 13, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }} className="bf-fadein">
      <Check size={14} color={COLORS.gold} /> {toast}
    </div>
  );
};

const whatsappLink = (product, variant, qty, price) => {
  const msg = `Hello Beauty's Fragrance, I'd like to order ${product}${variant ? " (" + variant + ")" : ""}, quantity ${qty}. Price: ${NGN(price)}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

/* ============================================================
   NAVBAR + MOBILE MENU
   ============================================================ */

const NAV_LINKS = [
  { label: "Home", dest: "home" }, { label: "Shop", dest: "all" }, { label: "Perfumes", dest: "perfumes" },
  { label: "Body Collection", dest: "mist" }, { label: "Oils", dest: "oils" }, { label: "Accessories", dest: "atomizers" },
  { label: "About", dest: "about" }, { label: "Contact", dest: "contact" },
];

function Navbar({ cartCount, wishCount, onNav, onOpenCart, onOpenSearch, onGoAdmin, onGoAccount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,246,239,0.94)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${COLORS.champagne}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button onClick={() => setMenuOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }} className="bf-mobile-only" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div onClick={() => onNav("home")} style={{ cursor: "pointer", textAlign: "left" }}>
            <div className="bf-h" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.02em" }}>Beauty's Fragrance</div>
            <div style={{ fontSize: 9.5, letterSpacing: "0.16em", color: COLORS.metallicGold, marginTop: -2 }}>MORE THAN A SCENT. A FEELING.</div>
          </div>
          <nav className="bf-desktop-nav" style={{ display: "flex", gap: 26 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => onNav(l.dest)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: COLORS.brown, fontFamily: "DM Sans", padding: "4px 0", borderBottom: "1px solid transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.gold)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                {l.label}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button onClick={onOpenSearch} aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer" }}><Search size={19} /></button>
            <button onClick={() => onNav("wishlist")} aria-label="Wishlist" style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <Heart size={19} />
              {wishCount > 0 && <Badge n={wishCount} />}
            </button>
            <button onClick={onGoAccount} aria-label="Account" style={{ background: "none", border: "none", cursor: "pointer" }} className="bf-desktop-only"><User size={19} /></button>
            <button onClick={onOpenCart} aria-label="Cart" style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <ShoppingBag size={19} />
              {cartCount > 0 && <Badge n={cartCount} />}
            </button>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: COLORS.black, color: COLORS.ivory, padding: 24 }} className="bf-fadein">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <div className="bf-h" style={{ fontSize: 20 }}>Beauty's Fragrance</div>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }}><X size={24} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => { onNav(l.dest); setMenuOpen(false); }} className="bf-h" style={{ background: "none", border: "none", color: COLORS.ivory, textAlign: "left", fontSize: 24, cursor: "pointer" }}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="bf-line" style={{ margin: "32px 0" }} />
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: COLORS.champagne }}>
            <button onClick={() => { onGoAccount(); setMenuOpen(false); }} style={{ background: "none", border: "none", color: COLORS.champagne, cursor: "pointer" }}>Account</button>
            <button onClick={() => { onNav("wishlist"); setMenuOpen(false); }} style={{ background: "none", border: "none", color: COLORS.champagne, cursor: "pointer" }}>Wishlist</button>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) { .bf-desktop-nav{ display:none !important; } .bf-mobile-only{ display:block !important; } .bf-desktop-only{ display:none !important; } }
      `}</style>
    </>
  );
}

const Badge = ({ n }) => (
  <span style={{ position: "absolute", top: -7, right: -8, background: COLORS.gold, color: COLORS.black, fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
);

/* ============================================================
   HERO CAROUSEL
   ============================================================ */

function HeroCarousel({ slides, onCta }) {
  const active = slides.filter((s) => s.enabled);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    if (paused || active.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % active.length), 5500);
    return () => clearInterval(t);
  }, [paused, active.length]);

  if (active.length === 0) return null;
  const slide = active[i % active.length];
  const go = (n) => { setI((n + active.length) % active.length); setPaused(true); };

  return (
    <div
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50) go(i - 1); else if (dx < -50) go(i + 1);
        touchX.current = null; setPaused(true);
      }}
      style={{ position: "relative", height: "min(86vh,720px)", minHeight: 480, overflow: "hidden", background: slide.gradient }}
    >
      <div key={slide.id} className="bf-kenburns" style={{ position: "absolute", inset: 0, background: slide.gradient, opacity: 0.96 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(217,164,65,0.16), transparent 60%)" }} />
      <div key={slide.id + "-content"} className="bf-fadein" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1280, margin: "0 auto", padding: "0 28px", color: COLORS.ivory }}>
        <div className="bf-eyebrow" style={{ color: COLORS.champagne, marginBottom: 18 }}>{slide.eyebrow}</div>
        <h1 className="bf-h" style={{ fontSize: "clamp(34px,6vw,68px)", lineHeight: 1.06, fontWeight: 600, whiteSpace: "pre-line", maxWidth: 640, margin: 0 }}>{slide.title}</h1>
        <p style={{ fontSize: 16, maxWidth: 420, marginTop: 22, color: "rgba(250,246,239,0.85)", lineHeight: 1.6 }}>{slide.body}</p>
        <div style={{ marginTop: 32 }}>
          <button className="bf-btn-gold" style={{ background: COLORS.gold, color: COLORS.black, border: "none" }} onClick={() => onCta(slide.dest)}>{slide.cta.toUpperCase()}</button>
        </div>
      </div>

      <button onClick={() => go(i - 1)} aria-label="Previous slide" style={navArrowStyle("left")}><ChevronLeft size={20} /></button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" style={navArrowStyle("right")}><ChevronRight size={20} /></button>

      <div style={{ position: "absolute", bottom: 26, left: 28, right: 28, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ color: COLORS.champagne, fontSize: 12, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>
          {String(i + 1).padStart(2, "0")} / {String(active.length).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, height: 2, background: "rgba(250,246,239,0.25)", maxWidth: 220, position: "relative", overflow: "hidden" }}>
          <div key={slide.id + "-bar"} style={{ position: "absolute", inset: 0, background: COLORS.gold, animation: paused ? "none" : "bfProgress 5.5s linear" }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {active.map((s, idx) => (
            <button key={s.id} onClick={() => go(idx)} aria-label={`Go to slide ${idx + 1}`} style={{ width: idx === i ? 20 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer", background: idx === i ? COLORS.gold : "rgba(250,246,239,0.4)", transition: "all .3s" }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes bfProgress { from{width:0%;} to{width:100%;} }`}</style>
    </div>
  );
}
const navArrowStyle = (side) => ({
  position: "absolute", top: "50%", transform: "translateY(-50%)", [side]: 20, background: "rgba(8,8,8,0.35)", border: `1px solid rgba(232,201,138,0.4)`, color: COLORS.ivory, width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
});

/* ============================================================
   CATEGORY SECTION
   ============================================================ */

function CategorySection({ onSelect }) {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 24px 40px" }}>
      <SectionHeading eyebrow="Shop By Category" title="Find your perfect scent" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginTop: 44 }} className="bf-cat-grid">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => onSelect(c.id)}
            style={{
              gridColumn: c.span === "large" ? "span 3" : "span 2",
              minHeight: c.span === "large" ? 280 : 220,
              position: "relative", border: "none", cursor: "pointer", overflow: "hidden",
              background: "linear-gradient(160deg,#3A2415,#080808)", textAlign: "left", padding: 0,
            }}>
            <div style={{ position: "absolute", inset: 0, background: catGradient(c.id), opacity: 0.9 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,8,8,0.75), transparent 55%)" }} />
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, color: COLORS.ivory }}>
              <div className="bf-h" style={{ fontSize: c.span === "large" ? 26 : 20, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: "rgba(250,246,239,0.85)", marginTop: 4, maxWidth: 240 }}>{c.tag}</div>
            </div>
          </button>
        ))}
      </div>
      <style>{`@media (max-width:760px){ .bf-cat-grid{ grid-template-columns:repeat(2,1fr) !important;} .bf-cat-grid > button { grid-column: span 1 !important; min-height:170px !important; } }`}</style>
    </section>
  );
}
function catGradient(id) {
  const map = {
    perfumes: "linear-gradient(160deg,#3A2415,#080808)", sprays: "linear-gradient(160deg,#B8862D,#3A2415)",
    oils: "linear-gradient(160deg,#080808,#B8862D)", mist: "linear-gradient(160deg,#E8C98A,#3A2415)",
    humidifiers: "linear-gradient(160deg,#D9A441,#080808)", atomizers: "linear-gradient(160deg,#3A2415,#D9A441)",
  };
  return map[id] || map.perfumes;
}

function SectionHeading({ eyebrow, title, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
      <div>
        <div className="bf-eyebrow">{eyebrow}</div>
        <h2 className="bf-h" style={{ fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 600, marginTop: 8 }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

/* ============================================================
   PRODUCT CARD + GRID / BEST SELLERS
   ============================================================ */

function ProductCard({ p, onQuickView, onAdd, onWishlist, wished }) {
  return (
    <div style={{ background: COLORS.ivory, border: `1px solid ${COLORS.champagne}`, minWidth: 240, position: "relative" }} className="bf-fadein">
      <div style={{ position: "relative", height: 250, background: p.gradient, overflow: "hidden", cursor: "pointer" }} onClick={() => onQuickView(p)}>
        {p.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, background: COLORS.black, color: COLORS.champagne, fontSize: 10, letterSpacing: "0.08em", padding: "5px 10px" }}>{p.badge.toUpperCase()}</span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onWishlist(p.id); }} aria-label="Wishlist"
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(250,246,239,0.85)", border: "none", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={14} fill={wished ? COLORS.gold : "none"} color={wished ? COLORS.gold : COLORS.brown} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onQuickView(p); }}
          style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", opacity: 0, transition: "opacity .2s" }} className="bf-quickview">
          <span style={{ background: COLORS.black, color: COLORS.ivory, fontSize: 11, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}><Eye size={12} /> Quick View</span>
        </button>
        {p.stock === 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.55)", color: COLORS.ivory, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, letterSpacing: "0.08em" }}>OUT OF STOCK</div>}
      </div>
      <div style={{ padding: "16px 16px 18px" }}>
        <div style={{ fontSize: 10.5, letterSpacing: "0.08em", color: COLORS.metallicGold, textTransform: "uppercase" }}>{CATEGORIES.find((c) => c.id === p.category)?.name}</div>
        <div className="bf-h" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 4 }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Stars rating={p.rating} /> <span style={{ fontSize: 11, color: "#8a7a68" }}>({p.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{NGN(p.discountPrice || p.price)}</span>
          {p.discountPrice && <span style={{ fontSize: 12.5, color: "#a8998a", textDecoration: "line-through" }}>{NGN(p.price)}</span>}
        </div>
        <div style={{ fontSize: 11, color: p.stock < 6 && p.stock > 0 ? "#B8862D" : "#8a7a68", marginTop: 4 }}>
          {p.stock === 0 ? "Currently unavailable" : p.stock < 6 ? `Only ${p.stock} left` : "In stock"}
        </div>
        <button disabled={p.stock === 0} onClick={() => onAdd(p)} className="bf-btn-gold" style={{ width: "100%", marginTop: 12, opacity: p.stock === 0 ? 0.4 : 1, cursor: p.stock === 0 ? "not-allowed" : "pointer" }}>
          {p.stock === 0 ? "UNAVAILABLE" : "ADD TO CART"}
        </button>
      </div>
      <style>{`div:hover > .bf-quickview, .bf-quickview:hover { opacity:1 !important; }`}</style>
    </div>
  );
}

function BestSellers({ products, ...handlers }) {
  const best = products.filter((p) => p.badge === "Best Seller");
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
      <SectionHeading eyebrow="Fan Favourites" title="Our best sellers" />
      <div style={{ display: "flex", gap: 16, overflowX: "auto", marginTop: 36, paddingBottom: 8 }} className="bf-scrollbar-none">
        {best.map((p) => <ProductCard key={p.id} p={p} {...handlers} />)}
      </div>
    </section>
  );
}

/* ============================================================
   SHOP / SEARCH & FILTER GRID
   ============================================================ */

function ShopSection({ products, initialCategory, onQuickView, onAdd, onWishlist, wishlist, searchQuery, setSearchQuery }) {
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => setCategory(initialCategory || "all"), [initialCategory]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (category === "all" || p.category === category) &&
      (p.discountPrice || p.price) <= maxPrice &&
      (!onlyAvailable || p.stock > 0) &&
      (searchQuery.trim() === "" || (p.name + p.category + p.top.join(" ") + p.heart.join(" ") + p.base.join(" ")).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list = [...list].filter(() => true).sort((a, b) => (b.badge === "New") - (a.badge === "New"));
    return list;
  }, [products, category, sort, maxPrice, onlyAvailable, searchQuery]);

  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 90px" }}>
      <SectionHeading eyebrow="The Full Collection" title={category === "all" ? "Shop all products" : CATEGORIES.find((c) => c.id === category)?.name || "Shop"}
        right={<input placeholder="Search fragrances, notes, categories…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px 14px", border: `1px solid ${COLORS.champagne}`, background: COLORS.ivory, fontSize: 13, minWidth: 240 }} />} />
      <div style={{ display: "flex", gap: 28, marginTop: 32, alignItems: "flex-start" }} className="bf-shop-layout">
        <aside style={{ width: 220, flexShrink: 0 }}>
          <FilterGroup label="Category">
            {["all", ...CATEGORIES.map((c) => c.id)].map((c) => (
              <FilterOption key={c} active={category === c} label={c === "all" ? "All Products" : CATEGORIES.find((x) => x.id === c)?.name} onClick={() => setCategory(c)} />
            ))}
          </FilterGroup>
          <FilterGroup label="Price">
            <input type="range" min={4000} max={60000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.gold }} />
            <div style={{ fontSize: 12, color: "#8a7a68", marginTop: 4 }}>Up to {NGN(maxPrice)}</div>
          </FilterGroup>
          <FilterGroup label="Availability">
            <label style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} style={{ accentColor: COLORS.gold }} /> In stock only
            </label>
          </FilterGroup>
        </aside>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 12.5, color: "#8a7a68" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: `1px solid ${COLORS.champagne}`, padding: "8px 10px", fontSize: 12.5, background: COLORS.ivory }}>
              <option value="popular">Sort: Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Sort: Price Low → High</option>
              <option value="price-desc">Sort: Price High → Low</option>
              <option value="rating">Sort: Highest Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <EmptyState title="No products match your search" body="Try clearing a filter or searching a different fragrance note." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
              {filtered.map((p) => <ProductCard key={p.id} p={p} onQuickView={onQuickView} onAdd={onAdd} onWishlist={onWishlist} wished={wishlist.includes(p.id)} />)}
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width:760px){ .bf-shop-layout{ flex-direction:column; } .bf-shop-layout aside{ width:100% !important; } }`}</style>
    </section>
  );
}
const FilterGroup = ({ label, children }) => (
  <div style={{ marginBottom: 26 }}>
    <div style={{ fontSize: 11.5, letterSpacing: "0.06em", fontWeight: 700, color: COLORS.brown, marginBottom: 10 }}>{label}</div>
    {children}
  </div>
);
const FilterOption = ({ active, label, onClick }) => (
  <button onClick={onClick} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontSize: 13, color: active ? COLORS.metallicGold : COLORS.brown, fontWeight: active ? 700 : 400 }}>
    {label}
  </button>
);
const EmptyState = ({ title, body, icon }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", border: `1px dashed ${COLORS.champagne}` }}>
    {icon || <Sparkles size={26} color={COLORS.gold} style={{ marginBottom: 10 }} />}
    <div className="bf-h" style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
    <div style={{ fontSize: 13, color: "#8a7a68", marginTop: 6 }}>{body}</div>
  </div>
);

/* ============================================================
   QUICK VIEW / PRODUCT DETAIL MODAL
   ============================================================ */

function ProductModal({ product, onClose, onAdd, onWishlist, wished }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.size[0]);
  const [tab, setTab] = useState("desc");
  useEffect(() => { setQty(1); setSize(product.size[0]); setTab("desc"); }, [product]);

  const price = product.discountPrice || product.price;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,8,0.72)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bf-fadein" style={{ background: COLORS.ivory, width: "100%", maxWidth: 980, maxHeight: "92vh", overflowY: "auto", display: "flex", flexWrap: "wrap" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "sticky", top: 12, marginLeft: "auto", marginRight: 12, background: COLORS.black, color: COLORS.ivory, border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", zIndex: 2 }}>
          <X size={15} style={{ margin: "auto" }} />
        </button>
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap", marginTop: -30 }}>
          <div style={{ flex: "1 1 380px", height: 420, background: product.gradient, position: "relative" }}>
            {product.badge && <span style={{ position: "absolute", top: 16, left: 16, background: COLORS.black, color: COLORS.champagne, fontSize: 10, letterSpacing: "0.08em", padding: "6px 10px" }}>{product.badge.toUpperCase()}</span>}
          </div>
          <div style={{ flex: "1 1 380px", padding: "36px 34px" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", color: COLORS.metallicGold, textTransform: "uppercase" }}>{CATEGORIES.find((c) => c.id === product.category)?.name}</div>
            <h2 className="bf-h" style={{ fontSize: 30, fontWeight: 600, margin: "8px 0" }}>{product.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Stars rating={product.rating} size={15} /> <span style={{ fontSize: 12.5, color: "#8a7a68" }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
              <span className="bf-h" style={{ fontSize: 26, fontWeight: 700 }}>{NGN(price)}</span>
              {product.discountPrice && <span style={{ fontSize: 15, color: "#a8998a", textDecoration: "line-through" }}>{NGN(product.price)}</span>}
            </div>
            <div style={{ fontSize: 12.5, color: product.stock > 0 ? "#3f7a4d" : "#b23b3b", marginBottom: 20 }}>{product.stock > 0 ? `In stock — ${product.stock} available` : "Out of stock"}</div>

            {product.size.length > 1 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>SIZE / VARIATION</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {product.size.map((s) => (
                    <button key={s} onClick={() => setSize(s)} style={{ padding: "8px 14px", border: `1px solid ${size === s ? COLORS.gold : COLORS.champagne}`, background: size === s ? COLORS.black : "transparent", color: size === s ? COLORS.champagne : COLORS.brown, fontSize: 12.5, cursor: "pointer" }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.champagne}` }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 34, height: 38, background: "none", border: "none", cursor: "pointer" }}><Minus size={13} /></button>
                <span style={{ width: 32, textAlign: "center", fontSize: 13 }}>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} style={{ width: 34, height: 38, background: "none", border: "none", cursor: "pointer" }}><Plus size={13} /></button>
              </div>
              <button onClick={() => onWishlist(product.id)} aria-label="Wishlist" style={{ width: 38, height: 38, border: `1px solid ${COLORS.champagne}`, background: "none", cursor: "pointer" }}>
                <Heart size={15} style={{ margin: "auto" }} fill={wished ? COLORS.gold : "none"} color={wished ? COLORS.gold : COLORS.brown} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button disabled={product.stock === 0} className="bf-btn-gold" style={{ flex: "1 1 160px" }} onClick={() => onAdd(product, size, qty)}>ADD TO CART</button>
              <button disabled={product.stock === 0} className="bf-btn-outline" style={{ flex: "1 1 160px" }} onClick={() => { onAdd(product, size, qty); }}>BUY NOW</button>
            </div>
            <a href={whatsappLink(product.name, size, qty, price * qty)} target="_blank" rel="noopener noreferrer"
              style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", color: "#fff", padding: "12px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <MessageCircle size={16} /> ORDER VIA WHATSAPP
            </a>

            <div style={{ display: "flex", gap: 18, marginTop: 22, fontSize: 11.5, color: "#8a7a68", flexWrap: "wrap" }}>
              <span style={{ display: "flex", gap: 5, alignItems: "center" }}><ShieldCheck size={13} color={COLORS.gold} /> Original Products</span>
              <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Truck size={13} color={COLORS.gold} /> Fast & Safe Delivery</span>
              <span style={{ display: "flex", gap: 5, alignItems: "center" }}><Package size={13} color={COLORS.gold} /> Secure Checkout</span>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", padding: "0 34px 40px" }}>
          <div className="bf-line" style={{ margin: "10px 0 24px" }} />
          <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${COLORS.champagne}`, marginBottom: 20, flexWrap: "wrap" }}>
            {[["desc", "Description"], ["notes", "Fragrance Profile"], ["use", "How To Use"], ["reviews", "Reviews"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", fontSize: 13, fontWeight: tab === k ? 700 : 400, color: tab === k ? COLORS.black : "#8a7a68", borderBottom: tab === k ? `2px solid ${COLORS.gold}` : "2px solid transparent" }}>{l}</button>
            ))}
          </div>
          {tab === "desc" && (
            <div style={{ maxWidth: 640, fontSize: 14, lineHeight: 1.8, color: COLORS.brown }}>
              <p>{product.desc}</p>
              <p style={{ marginTop: 12 }}><strong>Why you'll love it:</strong> A composition built to perform in Nigerian weather — it survives the heat, doesn't fade by afternoon, and travels well from morning to evening.</p>
            </div>
          )}
          {tab === "notes" && (
            <div style={{ display: "flex", gap: 30, flexWrap: "wrap", fontSize: 13.5 }}>
              {["top", "heart", "base"].map((k) => (
                (product[k] && product[k].length > 0) && (
                  <div key={k}>
                    <div style={{ fontWeight: 700, marginBottom: 6, textTransform: "capitalize" }}>{k === "top" ? "Top Notes" : k === "heart" ? "Heart Notes" : "Base Notes"}</div>
                    <div style={{ color: "#6b5c4e" }}>{product[k].join(", ")}</div>
                  </div>
                )
              ))}
              {(!product.top || product.top.length === 0) && <div style={{ color: "#8a7a68" }}>Fragrance-neutral accessory item.</div>}
            </div>
          )}
          {tab === "use" && (
            <div style={{ fontSize: 14, color: COLORS.brown, lineHeight: 1.8, maxWidth: 560 }}>
              Apply to pulse points — wrists, neck and behind the ears — after showering for the longest wear. Reapply lightly in the afternoon if needed. Store away from direct sunlight.
            </div>
          )}
          {tab === "reviews" && (
            <div style={{ display: "grid", gap: 14, maxWidth: 640 }}>
              {INITIAL_REVIEWS.slice(0, 3).map((r) => (
                <div key={r.id} style={{ border: `1px solid ${COLORS.champagne}`, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: 13 }}>{r.name}</strong><Stars rating={r.rating} /></div>
                  <p style={{ fontSize: 13, color: "#6b5c4e", marginTop: 6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CART DRAWER
   ============================================================ */

function CartDrawer({ open, onClose, cart, updateQty, removeItem, subtotal, onCheckout, addedToast }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 350, pointerEvents: open ? "auto" : "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.5)", opacity: open ? 1 : 0, transition: "opacity .3s" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(420px,100%)", background: COLORS.ivory, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .35s ease", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 22px 16px", borderBottom: `1px solid ${COLORS.champagne}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="bf-h" style={{ fontSize: 19, fontWeight: 600 }}>Your Cart ({cart.length})</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        {addedToast && (
          <div style={{ margin: "14px 22px 0", padding: 12, border: `1px solid ${COLORS.gold}`, background: COLORS.cream, fontSize: 12.5, display: "flex", gap: 8, alignItems: "center" }}>
            <Check size={14} color={COLORS.metallicGold} /> Added to cart
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {cart.length === 0 ? (
            <EmptyState title="Your cart is empty" body="Explore the collection and add a fragrance you love." />
          ) : cart.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: `1px solid ${COLORS.champagne}` }}>
              <div style={{ width: 64, height: 64, background: item.gradient, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 11.5, color: "#8a7a68" }}>{item.size}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.champagne}` }}>
                    <button onClick={() => updateQty(idx, item.qty - 1)} style={{ width: 26, height: 26, background: "none", border: "none", cursor: "pointer" }}><Minus size={11} /></button>
                    <span style={{ width: 24, textAlign: "center", fontSize: 12 }}>{item.qty}</span>
                    <button onClick={() => updateQty(idx, item.qty + 1)} style={{ width: 26, height: 26, background: "none", border: "none", cursor: "pointer" }}><Plus size={11} /></button>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{NGN(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(idx)} aria-label="Remove" style={{ background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}><Trash2 size={15} color="#b23b3b" /></button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: 22, borderTop: `1px solid ${COLORS.champagne}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}><span>Subtotal</span><span style={{ fontWeight: 700 }}>{NGN(subtotal)}</span></div>
            <div style={{ fontSize: 11.5, color: "#8a7a68", marginBottom: 16 }}>Delivery fee calculated at checkout</div>
            <button className="bf-btn-gold" style={{ width: "100%" }} onClick={onCheckout}>CHECKOUT</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CHECKOUT FLOW
   ============================================================ */

function Checkout({ cart, subtotal, deliveryPrices, onPlaceOrder, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", state: "Lagos", city: "", address: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const deliveryFee = deliveryPrices[form.state] ?? 3000;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^0\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Nigerian phone number";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 100px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: COLORS.metallicGold, marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Back to shop</button>
      <SectionHeading eyebrow="Secure Checkout" title="Complete your order" />
      <div style={{ display: "flex", gap: 8, margin: "26px 0 34px" }}>
        {["Details", "Payment", "Review"].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ width: "100%", height: 3, background: step > i ? COLORS.gold : COLORS.champagne, marginBottom: 8 }} />
            <span style={{ fontSize: 11.5, color: step === i + 1 ? COLORS.black : "#a8998a", fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bf-fadein" style={{ display: "grid", gap: 16 }}>
          <Field label="Full Name" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Phone Number" value={form.phone} error={errors.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="080..." />
            <Field label="Email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <FieldLabel>State</FieldLabel>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} style={inputStyle()}>
                {Object.keys(deliveryPrices).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Field label="City" value={form.city} error={errors.city} onChange={(v) => setForm({ ...form, city: v })} />
          </div>
          <Field label="Delivery Address" value={form.address} error={errors.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
          <button className="bf-btn-gold" onClick={() => validate() && setStep(2)}>CONTINUE TO PAYMENT</button>
        </div>
      )}

      {step === 2 && (
        <div className="bf-fadein" style={{ display: "grid", gap: 12 }}>
          {[["card", "Debit / Credit Card"], ["transfer", "Bank Transfer"], ["gateway", "Pay with Paystack / Flutterwave"]].map(([k, l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 12, border: `1px solid ${payMethod === k ? COLORS.gold : COLORS.champagne}`, padding: 16, cursor: "pointer", background: payMethod === k ? COLORS.cream : "transparent" }}>
              <input type="radio" checked={payMethod === k} onChange={() => setPayMethod(k)} style={{ accentColor: COLORS.gold }} />
              <span style={{ fontSize: 14 }}>{l}</span>
            </label>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button className="bf-btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>BACK</button>
            <button className="bf-btn-gold" style={{ flex: 2 }} onClick={() => setStep(3)}>REVIEW ORDER</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bf-fadein">
          <div style={{ border: `1px solid ${COLORS.champagne}`, padding: 20, marginBottom: 20 }}>
            {cart.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0" }}>
                <span>{it.name} ({it.size}) × {it.qty}</span><span>{NGN(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="bf-line" style={{ margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span>Subtotal</span><span>{NGN(subtotal)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span>Delivery ({form.state})</span><span>{NGN(deliveryFee)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, marginTop: 8 }}><span>Total</span><span>{NGN(total)}</span></div>
          </div>
          <div style={{ fontSize: 12.5, color: "#8a7a68", marginBottom: 20 }}>
            Delivering to <strong>{form.name}</strong>, {form.address}, {form.city}, {form.state} · {form.phone}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="bf-btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>BACK</button>
            <button className="bf-btn-gold" style={{ flex: 2 }} onClick={() => onPlaceOrder({ form, payMethod, deliveryFee, total })}>PLACE ORDER — {NGN(total)}</button>
          </div>
        </div>
      )}
    </section>
  );
}
const inputStyle = () => ({ width: "100%", padding: "12px 14px", border: `1px solid ${COLORS.champagne}`, background: COLORS.ivory, fontSize: 13.5, fontFamily: "DM Sans" });
const FieldLabel = ({ children }) => <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 6, color: COLORS.brown }}>{children}</div>;
const Field = ({ label, value, onChange, error, placeholder, textarea }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {textarea
      ? <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle(), resize: "vertical" }} />
      : <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle(), borderColor: error ? "#b23b3b" : COLORS.champagne }} />}
    {error && <div style={{ fontSize: 11, color: "#b23b3b", marginTop: 4 }}>{error}</div>}
  </div>
);

/* ============================================================
   ORDER CONFIRMATION + TRACKING
   ============================================================ */

function OrderConfirmation({ order, onTrack, onContinue }) {
  return (
    <section style={{ maxWidth: 620, margin: "0 auto", padding: "80px 24px 100px", textAlign: "center" }} className="bf-fadein">
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${COLORS.gold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Check size={24} color={COLORS.gold} />
      </div>
      <div className="bf-eyebrow">Thank You</div>
      <h2 className="bf-h" style={{ fontSize: 32, fontWeight: 600, margin: "10px 0" }}>Order Confirmed</h2>
      <p style={{ color: "#8a7a68", fontSize: 14 }}>We've received your order and it's being prepared with care.</p>
      <div style={{ textAlign: "left", border: `1px solid ${COLORS.champagne}`, padding: 22, marginTop: 28 }}>
        <Row k="Order Number" v={order.id} /><Row k="Payment Status" v={order.payment} />
        {order.items.map((it, i) => <Row key={i} k={it.name} v={`× ${it.qty} — ${NGN(it.price * it.qty)}`} />)}
        <div className="bf-line" style={{ margin: "10px 0" }} />
        <Row k="Total Paid" v={NGN(order.total)} bold />
        <Row k="Delivery Address" v={order.address} />
        <Row k="Estimated Delivery" v="2–4 business days" />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 26, justifyContent: "center" }}>
        <button className="bf-btn-outline" onClick={onContinue}>CONTINUE SHOPPING</button>
        <button className="bf-btn-gold" onClick={onTrack}>TRACK MY ORDER</button>
      </div>
    </section>
  );
}
const Row = ({ k, v, bold }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0", fontWeight: bold ? 700 : 400 }}><span style={{ color: "#8a7a68" }}>{k}</span><span style={{ textAlign: "right", maxWidth: 280 }}>{v}</span></div>
);

function OrderTracking({ orders }) {
  const [id, setId] = useState(""); const [contact, setContact] = useState(""); const [result, setResult] = useState(null); const [searched, setSearched] = useState(false);
  const find = () => {
    setSearched(true);
    const o = orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
    setResult(o || null);
  };
  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "70px 24px 110px" }}>
      <SectionHeading eyebrow="Order Status" title="Track your order" />
      <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
        <input placeholder="Order Number (e.g. BF-10231)" value={id} onChange={(e) => setId(e.target.value)} style={{ ...inputStyle(), flex: "1 1 220px" }} />
        <input placeholder="Phone or Email" value={contact} onChange={(e) => setContact(e.target.value)} style={{ ...inputStyle(), flex: "1 1 220px" }} />
        <button className="bf-btn-gold" onClick={find}>TRACK</button>
      </div>
      {searched && !result && <div style={{ marginTop: 30 }}><EmptyState title="Order not found" body="Double-check your order number and try again, or contact us on WhatsApp for help." /></div>}
      {result && (
        <div className="bf-fadein" style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, color: "#8a7a68", marginBottom: 22 }}>Order <strong style={{ color: COLORS.black }}>{result.id}</strong> — current status:
            <span style={{ color: COLORS.metallicGold, fontWeight: 700 }}> {result.status}</span>
          </div>
          <Timeline current={statusIndex(result.status)} />
        </div>
      )}
    </section>
  );
}
function Timeline({ current }) {
  return (
    <div>
      {STATUS_STEPS.map((s, i) => (
        <div key={s} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: i <= current ? COLORS.gold : COLORS.ivory, border: `2px solid ${i <= current ? COLORS.gold : COLORS.champagne}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i <= current && <Check size={11} color={COLORS.black} />}
            </div>
            {i < STATUS_STEPS.length - 1 && <div style={{ width: 2, height: 40, background: i < current ? COLORS.gold : COLORS.champagne }} />}
          </div>
          <div style={{ paddingBottom: 26 }}>
            <div style={{ fontSize: 14, fontWeight: i === current ? 700 : 400, color: i <= current ? COLORS.black : "#a8998a" }}>{s}</div>
            {i === current && <div style={{ fontSize: 11.5, color: COLORS.metallicGold, marginTop: 2 }}>Current status</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ACCOUNT / WISHLIST
   ============================================================ */

function AccountPage({ orders, wishlistProducts, onNav }) {
  const [tab, setTab] = useState("orders");
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 100px" }}>
      <SectionHeading eyebrow="My Account" title="Welcome back" />
      <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${COLORS.champagne}`, margin: "26px 0" }}>
        {[["orders", "Orders"], ["wishlist", "Wishlist"], ["addresses", "Addresses"], ["profile", "Profile"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", fontSize: 13, fontWeight: tab === k ? 700 : 400, borderBottom: tab === k ? `2px solid ${COLORS.gold}` : "2px solid transparent" }}>{l}</button>
        ))}
      </div>
      {tab === "orders" && (orders.length === 0 ? <EmptyState title="No orders yet" body="Your order history will appear here." /> :
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ border: `1px solid ${COLORS.champagne}`, padding: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{o.id}</div><div style={{ fontSize: 12, color: "#8a7a68" }}>{o.date} · {o.items.length} item(s)</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{NGN(o.total)}</div><div style={{ fontSize: 11.5, color: COLORS.metallicGold }}>{o.status}</div></div>
            </div>
          ))}
        </div>)}
      {tab === "wishlist" && (wishlistProducts.length === 0 ? <EmptyState title="Your wishlist is empty" body="Tap the heart on any product to save it here." /> :
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
          {wishlistProducts.map((p) => (<div key={p.id} onClick={() => onNav("all")} style={{ cursor: "pointer" }}><div style={{ height: 140, background: p.gradient }} /><div style={{ fontSize: 12.5, marginTop: 6, fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12 }}>{NGN(p.discountPrice || p.price)}</div></div>))}
        </div>)}
      {tab === "addresses" && <EmptyState title="No saved addresses" body="Addresses you use at checkout can be saved here for next time." />}
      {tab === "profile" && (
        <div style={{ display: "grid", gap: 14, maxWidth: 380 }}>
          <Field label="Full Name" value="" onChange={() => {}} placeholder="Add your name" />
          <Field label="Email" value="" onChange={() => {}} placeholder="Add your email" />
          <button className="bf-btn-outline" style={{ width: "fit-content" }}>Change Password</button>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   MARKETING SECTIONS: Why Us, Brand Story, Featured, Reviews, Newsletter, Footer
   ============================================================ */

function WhyUs() {
  const items = [
    { icon: ShieldCheck, title: "Original Products", body: "Authentic fragrance products you can trust." },
    { icon: Sparkles, title: "Affordable Luxury", body: "Luxury scents without unreasonable prices." },
    { icon: Truck, title: "Fast & Safe Delivery", body: "Reliable delivery to customers nationwide." },
    { icon: Package, title: "Shop With Trust", body: "A smooth and secure shopping experience." },
  ];
  return (
    <section style={{ background: COLORS.cream, padding: "70px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 30 }}>
        {items.map((it) => (
          <div key={it.title}>
            <it.icon size={22} color={COLORS.metallicGold} strokeWidth={1.4} />
            <div className="bf-h" style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>{it.title}</div>
            <div style={{ fontSize: 13, color: "#6b5c4e", marginTop: 6 }}>{it.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BrandStory({ onNav }) {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "90px 24px", display: "flex", gap: 50, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ flex: "1 1 380px", height: 420, background: "linear-gradient(160deg,#3A2415,#080808)" }} />
      <div style={{ flex: "1 1 380px" }}>
        <div className="bf-eyebrow">Our Story</div>
        <h2 className="bf-h" style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 600, margin: "12px 0 18px", maxWidth: 420 }}>Luxury that speaks your story</h2>
        <p style={{ fontSize: 14.5, lineHeight: 1.9, color: "#6b5c4e", maxWidth: 440 }}>
          Beauty's Fragrance began with a simple belief — that quality fragrance shouldn't be out of reach. We source and craft scents that hold up to the Nigerian climate and carry real personality, then price them so confidence isn't a luxury item. Every bottle is chosen to help you show up as exactly who you are.
        </p>
        <button className="bf-btn-outline" style={{ marginTop: 24 }} onClick={() => onNav("about")}>LEARN ABOUT US</button>
      </div>
    </section>
  );
}

function FeaturedCollection({ onNav }) {
  return (
    <section style={{ position: "relative", minHeight: 420, display: "flex", alignItems: "center", background: "linear-gradient(135deg,#080808,#24170D,#080808)", color: COLORS.ivory, padding: "70px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 30 }}>
        <div style={{ maxWidth: 460 }}>
          <div className="bf-eyebrow" style={{ color: COLORS.champagne }}>The Beauty's Collection</div>
          <h2 className="bf-h" style={{ fontSize: "clamp(26px,3.6vw,42px)", fontWeight: 600, margin: "12px 0 16px" }}>A fragrance for every mood.<br />A scent for every story.</h2>
          <button className="bf-btn-gold" style={{ background: COLORS.gold, color: COLORS.black, border: "none" }} onClick={() => onNav("all")}>EXPLORE COLLECTION</button>
        </div>
        <div style={{ width: 320, height: 320, background: "linear-gradient(160deg,#B8862D,#F3D58A)", flexShrink: 0 }} className="bf-desktop-only" />
      </div>
    </section>
  );
}

function Reviews({ reviews }) {
  const [i, setI] = useState(0);
  return (
    <section style={{ maxWidth: 700, margin: "0 auto", padding: "90px 24px", textAlign: "center" }}>
      <SectionHeading eyebrow="Testimonials" title="What our customers say" />
      <div key={reviews[i].id} className="bf-fadein" style={{ marginTop: 34 }}>
        <Stars rating={reviews[i].rating} size={16} />
        <p className="bf-h" style={{ fontSize: 21, lineHeight: 1.6, fontStyle: "italic", margin: "18px auto", maxWidth: 560 }}>"{reviews[i].text}"</p>
        <div style={{ fontSize: 13, color: "#8a7a68" }}>— {reviews[i].name}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
        {reviews.map((r, idx) => <button key={r.id} onClick={() => setI(idx)} aria-label={`Review ${idx + 1}`} style={{ width: idx === i ? 18 : 6, height: 6, borderRadius: 3, border: "none", background: idx === i ? COLORS.gold : COLORS.champagne, cursor: "pointer" }} />)}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState(""); const [done, setDone] = useState(false);
  return (
    <section style={{ background: "linear-gradient(135deg,#080808,#24170D,#080808)", color: COLORS.ivory, padding: "80px 24px", textAlign: "center" }}>
      <div className="bf-eyebrow" style={{ color: COLORS.champagne }}>Stay In The Scent</div>
      <h2 className="bf-h" style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 600, margin: "12px 0 10px" }}>Be the first to discover new arrivals, exclusive offers and fragrance drops.</h2>
      {done ? <div style={{ marginTop: 20, color: COLORS.gold, fontSize: 14 }}>You're subscribed — welcome to the family ✓</div> : (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={{ padding: "13px 16px", border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.ivory, minWidth: 260, fontSize: 13.5 }} />
          <button className="bf-btn-gold" style={{ background: COLORS.gold, color: COLORS.black, border: "none" }} onClick={() => email.includes("@") && setDone(true)}>SUBSCRIBE</button>
        </div>
      )}
    </section>
  );
}

function Footer({ onNav }) {
  return (
    <footer style={{ background: COLORS.brown, color: COLORS.cream, padding: "60px 24px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 30 }}>
        <div>
          <div className="bf-h" style={{ fontSize: 19, fontWeight: 600, color: COLORS.champagne }}>Beauty's Fragrance</div>
          <div style={{ fontSize: 12, marginTop: 6, color: "rgba(243,227,204,0.7)" }}>More Than a Scent. A Feeling.</div>
        </div>
        <FooterCol title="Shop" items={["Shop", "Perfumes", "Body Collection"]} onNav={onNav} dests={["all", "perfumes", "mist"]} />
        <FooterCol title="Company" items={["About", "Contact", "FAQs"]} onNav={onNav} dests={["about", "contact", "about"]} />
        <FooterCol title="Support" items={["Shipping", "Returns", "Privacy Policy", "Terms"]} onNav={onNav} dests={["contact", "contact", "contact", "contact"]} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>CONTACT</div>
          <div style={{ fontSize: 12.5, color: "rgba(243,227,204,0.75)", lineHeight: 2 }}>
            0814 471 1396<br />TikTok: @Beauty0164
            <br /><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.champagne }}>Chat on WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="bf-line" style={{ margin: "36px 0 20px", opacity: 0.4 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", fontSize: 11.5, color: "rgba(243,227,204,0.55)" }}>© 2026 Beauty's Fragrance. All Rights Reserved.</div>
    </footer>
  );
}
const FooterCol = ({ title, items, onNav, dests }) => (
  <div>
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12 }}>{title.toUpperCase()}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((it, i) => <button key={it} onClick={() => onNav(dests[i])} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 12.5, color: "rgba(243,227,204,0.75)", padding: 0 }}>{it}</button>)}
    </div>
  </div>
);

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

function AdminApp({ products, setProducts, slides, setSlides, orders, setOrders, deliveryPrices, setDeliveryPrices, onExit }) {
  const [tab, setTab] = useState("overview");
  const tabs = [
    ["overview", "Overview", LayoutDashboard], ["products", "Products", Tag], ["carousel", "Homepage Carousel", ImageIcon],
    ["orders", "Orders", Package], ["delivery", "Delivery", Truck], ["customers", "Customers", Users], ["promotions", "Promotions", Sparkles],
  ];
  return (
    <div className="bf-root" style={{ minHeight: "100vh", display: "flex" }}>
      <GlobalStyle />
      <aside style={{ width: 230, background: COLORS.black, color: COLORS.ivory, padding: "26px 16px", flexShrink: 0 }}>
        <div className="bf-h" style={{ fontSize: 17, fontWeight: 600, color: COLORS.champagne, padding: "0 8px 26px" }}>Beauty's Admin</div>
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: tab === k ? "rgba(217,164,65,0.14)" : "none", border: "none", color: tab === k ? COLORS.gold : "rgba(250,246,239,0.75)", padding: "11px 10px", fontSize: 13, cursor: "pointer", borderLeft: tab === k ? `2px solid ${COLORS.gold}` : "2px solid transparent", textAlign: "left" }}>
            <Icon size={15} /> {l}
          </button>
        ))}
        <div style={{ marginTop: 30, borderTop: "1px solid rgba(250,246,239,0.15)", paddingTop: 16 }}>
          <button onClick={onExit} style={{ background: "none", border: "none", color: "rgba(250,246,239,0.6)", fontSize: 12.5, cursor: "pointer", display: "flex", gap: 8, alignItems: "center" }}><ArrowRight size={13} style={{ transform: "rotate(180deg)" }} /> Exit to storefront</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "34px 34px 80px", overflowY: "auto", maxHeight: "100vh" }}>
        {tab === "overview" && <AdminOverview products={products} orders={orders} />}
        {tab === "products" && <AdminProducts products={products} setProducts={setProducts} />}
        {tab === "carousel" && <AdminCarousel slides={slides} setSlides={setSlides} />}
        {tab === "orders" && <AdminOrders orders={orders} setOrders={setOrders} />}
        {tab === "delivery" && <AdminDelivery deliveryPrices={deliveryPrices} setDeliveryPrices={setDeliveryPrices} />}
        {tab === "customers" && <AdminCustomers orders={orders} />}
        {tab === "promotions" && <AdminPromotions />}
      </main>
    </div>
  );
}

const AdminHeading = ({ title, body }) => (
  <div style={{ marginBottom: 28 }}>
    <h1 className="bf-h" style={{ fontSize: 26, fontWeight: 600 }}>{title}</h1>
    {body && <p style={{ fontSize: 13, color: "#8a7a68", marginTop: 4 }}>{body}</p>}
  </div>
);
const StatCard = ({ label, value, sub }) => (
  <div style={{ background: COLORS.ivory, border: `1px solid ${COLORS.champagne}`, padding: 20 }}>
    <div style={{ fontSize: 11, letterSpacing: "0.06em", color: "#8a7a68", fontWeight: 700 }}>{label.toUpperCase()}</div>
    <div className="bf-h" style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: COLORS.metallicGold, marginTop: 4 }}>{sub}</div>}
  </div>
);
const MiniBar = ({ label, value, max }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span>{label}</span><span style={{ fontWeight: 700 }}>{value}</span></div>
    <div style={{ height: 7, background: COLORS.cream }}><div style={{ height: "100%", width: `${(value / max) * 100}%`, background: COLORS.gold }} /></div>
  </div>
);

function AdminOverview({ products, orders }) {
  const revenue = orders.filter((o) => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 6);
  const pending = orders.filter((o) => o.status === "Pending" || o.status === "Processing");
  const byCategory = CATEGORIES.map((c) => ({ name: c.name, n: products.filter((p) => p.category === c.id).length }));
  const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  return (
    <div>
      <AdminHeading title="Dashboard Overview" body="Live snapshot of store performance. Demo figures — connect a backend to populate with real transactions." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 34 }}>
        <StatCard label="Sales (Revenue)" value={NGN(revenue)} />
        <StatCard label="Orders" value={orders.length} sub={`${pending.length} pending action`} />
        <StatCard label="Customers" value={new Set(orders.map((o) => o.customer)).size} />
        <StatCard label="Products" value={products.length} />
        <StatCard label="Low Stock" value={lowStock.length} sub={lowStock.length ? "Needs attention" : "All good"} />
        <StatCard label="Pending Orders" value={pending.length} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }} className="bf-admin-grid">
        <div style={{ background: COLORS.ivory, border: `1px solid ${COLORS.champagne}`, padding: 22 }}>
          <div className="bf-h" style={{ fontWeight: 600, marginBottom: 16 }}>Best-Selling Products</div>
          {bestSellers.map((p) => <MiniBar key={p.id} label={p.name} value={p.reviews} max={bestSellers[0].reviews} />)}
        </div>
        <div style={{ background: COLORS.ivory, border: `1px solid ${COLORS.champagne}`, padding: 22 }}>
          <div className="bf-h" style={{ fontWeight: 600, marginBottom: 16 }}>Sales by Category</div>
          {byCategory.map((c) => <MiniBar key={c.name} label={c.name} value={c.n} max={Math.max(...byCategory.map((x) => x.n), 1)} />)}
        </div>
      </div>
      <style>{`@media (max-width:800px){ .bf-admin-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function AdminProducts({ products, setProducts }) {
  const [editing, setEditing] = useState(null);
  const blank = { id: "", name: "", category: "perfumes", price: 0, discountPrice: "", rating: 4.5, reviews: 0, stock: 10, badge: "", featured: false, gradient: "linear-gradient(160deg,#D9A441,#3A2415)", top: [], heart: [], base: [], desc: "", size: ["30ml"] };
  const save = (prod) => {
    if (products.find((p) => p.id === prod.id)) setProducts(products.map((p) => (p.id === prod.id ? prod : p)));
    else setProducts([...products, { ...prod, id: "p" + Date.now() }]);
    setEditing(null);
  };
  return (
    <div>
      <AdminHeading title="Product Management" body="Add products, edit pricing and inventory, mark best sellers or new arrivals." />
      <button className="bf-btn-gold" style={{ marginBottom: 18 }} onClick={() => setEditing({ ...blank })}>+ ADD PRODUCT</button>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead><tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.champagne}` }}>{["Product", "Category", "Price", "Stock", "Badge", "Enabled", ""].map((h) => <th key={h} style={{ padding: "10px 8px" }}>{h}</th>)}</tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.champagne}` }}>
                <td style={{ padding: "10px 8px", display: "flex", gap: 8, alignItems: "center" }}><div style={{ width: 30, height: 30, background: p.gradient }} />{p.name}</td>
                <td style={{ padding: "10px 8px" }}>{CATEGORIES.find((c) => c.id === p.category)?.name}</td>
                <td style={{ padding: "10px 8px" }}>{NGN(p.discountPrice || p.price)}</td>
                <td style={{ padding: "10px 8px", color: p.stock < 6 ? "#b23b3b" : "inherit" }}>{p.stock}</td>
                <td style={{ padding: "10px 8px" }}>{p.badge || "—"}</td>
                <td style={{ padding: "10px 8px" }}>
                  <input type="checkbox" checked={p.stock > 0} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, stock: e.target.checked ? (x.stock || 5) : 0 } : x))} style={{ accentColor: COLORS.gold }} />
                </td>
                <td style={{ padding: "10px 8px", display: "flex", gap: 10 }}>
                  <button onClick={() => setEditing(p)} style={{ background: "none", border: "none", cursor: "pointer" }}><Edit3 size={14} /></button>
                  <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} color="#b23b3b" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <ProductEditModal product={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}
function ProductEditModal({ product, onClose, onSave }) {
  const [f, setF] = useState(product);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,8,0.6)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.ivory, padding: 28, width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto" }}>
        <div className="bf-h" style={{ fontSize: 19, fontWeight: 600, marginBottom: 18 }}>{product.id ? "Edit Product" : "Add Product"}</div>
        <div style={{ display: "grid", gap: 12 }}>
          <Field label="Product Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <div>
            <FieldLabel>Category</FieldLabel>
            <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} style={inputStyle()}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Price (₦)" value={f.price} onChange={(v) => setF({ ...f, price: Number(v) || 0 })} />
            <Field label="Discount Price (₦)" value={f.discountPrice || ""} onChange={(v) => setF({ ...f, discountPrice: v ? Number(v) : null })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Stock" value={f.stock} onChange={(v) => setF({ ...f, stock: Number(v) || 0 })} />
            <div>
              <FieldLabel>Badge</FieldLabel>
              <select value={f.badge || ""} onChange={(e) => setF({ ...f, badge: e.target.value || null })} style={inputStyle()}>
                <option value="">None</option><option value="Best Seller">Best Seller</option><option value="New">New</option>
              </select>
            </div>
          </div>
          <Field label="Description" value={f.desc} onChange={(v) => setF({ ...f, desc: v })} textarea />
          <Field label="Sizes (comma separated)" value={f.size.join(", ")} onChange={(v) => setF({ ...f, size: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <label style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "center" }}><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} style={{ accentColor: COLORS.gold }} /> Mark as Featured</label>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button className="bf-btn-outline" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
          <button className="bf-btn-gold" style={{ flex: 1 }} onClick={() => onSave(f)}>SAVE PRODUCT</button>
        </div>
      </div>
    </div>
  );
}

function AdminCarousel({ slides, setSlides }) {
  const update = (id, patch) => setSlides(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const move = (id, dir) => {
    const idx = slides.findIndex((s) => s.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= slides.length) return;
    const arr = [...slides]; [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]; setSlides(arr);
  };
  const addSlide = () => setSlides([...slides, { id: "s" + Date.now(), enabled: true, eyebrow: "New Promotion", title: "Christmas Sale\n20% Off", body: "Limited time offer across the collection.", cta: "Shop Now", dest: "all", gradient: "linear-gradient(135deg,#080808,#B8862D,#080808)" }]);
  return (
    <div>
      <AdminHeading title="Homepage Carousel" body="Control what customers see first — no code changes needed." />
      <button className="bf-btn-gold" style={{ marginBottom: 18 }} onClick={addSlide}>+ ADD SLIDE</button>
      <div style={{ display: "grid", gap: 14 }}>
        {slides.map((s, i) => (
          <div key={s.id} style={{ border: `1px solid ${COLORS.champagne}`, padding: 18, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 120, height: 80, background: s.gradient, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 240, display: "grid", gap: 8 }}>
              <input value={s.eyebrow} onChange={(e) => update(s.id, { eyebrow: e.target.value })} placeholder="Eyebrow label" style={inputStyle()} />
              <textarea value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} placeholder="Slide title" style={{ ...inputStyle(), resize: "vertical" }} rows={2} />
              <input value={s.body} onChange={(e) => update(s.id, { body: e.target.value })} placeholder="Description" style={inputStyle()} />
              <div style={{ display: "flex", gap: 8 }}>
                <input value={s.cta} onChange={(e) => update(s.id, { cta: e.target.value })} placeholder="CTA text" style={{ ...inputStyle(), flex: 1 }} />
                <select value={s.dest} onChange={(e) => update(s.id, { dest: e.target.value })} style={{ ...inputStyle(), flex: 1 }}>
                  <option value="all">Destination: Shop All</option>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>Destination: {c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
              <label style={{ display: "flex", gap: 6, fontSize: 12, alignItems: "center" }}><input type="checkbox" checked={s.enabled} onChange={(e) => update(s.id, { enabled: e.target.checked })} style={{ accentColor: COLORS.gold }} /> Enabled</label>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => move(s.id, -1)} disabled={i === 0} style={{ background: "none", border: `1px solid ${COLORS.champagne}`, cursor: "pointer", padding: 4 }}><ChevronLeft size={13} style={{ transform: "rotate(90deg)" }} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} style={{ background: "none", border: `1px solid ${COLORS.champagne}`, cursor: "pointer", padding: 4 }}><ChevronLeft size={13} style={{ transform: "rotate(-90deg)" }} /></button>
                <button onClick={() => setSlides(slides.filter((x) => x.id !== s.id))} style={{ background: "none", border: `1px solid #b23b3b`, cursor: "pointer", padding: 4 }}><Trash2 size={13} color="#b23b3b" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Refunded"];
function AdminOrders({ orders, setOrders }) {
  const setStatus = (id, status) => setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  return (
    <div>
      <AdminHeading title="Order Management" body="Update an order's status and the customer sees it instantly on their tracking page." />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead><tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.champagne}` }}>{["Order ID", "Customer", "Total", "Payment", "Status", "Date"].map((h) => <th key={h} style={{ padding: "10px 8px" }}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${COLORS.champagne}` }}>
                <td style={{ padding: "10px 8px", fontWeight: 700 }}>{o.id}</td>
                <td style={{ padding: "10px 8px" }}>{o.customer}<br /><span style={{ color: "#8a7a68" }}>{o.state}</span></td>
                <td style={{ padding: "10px 8px" }}>{NGN(o.total)}</td>
                <td style={{ padding: "10px 8px", color: o.payment === "Paid" ? "#3f7a4d" : "#b8862d" }}>{o.payment}</td>
                <td style={{ padding: "10px 8px" }}>
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} style={{ padding: "6px 8px", border: `1px solid ${COLORS.champagne}`, fontSize: 12 }}>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "10px 8px" }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDelivery({ deliveryPrices, setDeliveryPrices }) {
  const [newState, setNewState] = useState(""); const [newPrice, setNewPrice] = useState("");
  return (
    <div>
      <AdminHeading title="Delivery Management" body="Set delivery pricing per state — nothing is hardcoded in the storefront." />
      <div style={{ display: "grid", gap: 10, maxWidth: 460 }}>
        {Object.entries(deliveryPrices).map(([state, price]) => (
          <div key={state} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${COLORS.champagne}`, padding: 12 }}>
            <span style={{ flex: 1, fontSize: 13.5 }}>{state}</span>
            <input type="number" value={price} onChange={(e) => setDeliveryPrices({ ...deliveryPrices, [state]: Number(e.target.value) || 0 })} style={{ width: 110, padding: "8px 10px", border: `1px solid ${COLORS.champagne}` }} />
            <button onClick={() => { const d = { ...deliveryPrices }; delete d[state]; setDeliveryPrices(d); }} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} color="#b23b3b" /></button>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20, maxWidth: 460 }}>
        <input placeholder="State name" value={newState} onChange={(e) => setNewState(e.target.value)} style={{ flex: 1, padding: "10px", border: `1px solid ${COLORS.champagne}` }} />
        <input placeholder="Price ₦" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: 110, padding: "10px", border: `1px solid ${COLORS.champagne}` }} />
        <button className="bf-btn-gold" onClick={() => { if (newState && newPrice) { setDeliveryPrices({ ...deliveryPrices, [newState]: Number(newPrice) }); setNewState(""); setNewPrice(""); } }}>ADD</button>
      </div>
    </div>
  );
}

function AdminCustomers({ orders }) {
  const customers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (!map[o.customer]) map[o.customer] = { name: o.customer, phone: o.phone, orders: 0, spend: 0, last: o.date };
      map[o.customer].orders += 1; map[o.customer].spend += o.total;
      if (o.date > map[o.customer].last) map[o.customer].last = o.date;
    });
    return Object.values(map);
  }, [orders]);
  return (
    <div>
      <AdminHeading title="Customer Management" body="Every customer who has ordered, with lifetime spend and recent activity." />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead><tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.champagne}` }}>{["Customer", "Phone", "Orders", "Total Spend", "Last Order"].map((h) => <th key={h} style={{ padding: "10px 8px" }}>{h}</th>)}</tr></thead>
        <tbody>{customers.map((c) => (
          <tr key={c.name} style={{ borderBottom: `1px solid ${COLORS.champagne}` }}>
            <td style={{ padding: "10px 8px" }}>{c.name}</td><td style={{ padding: "10px 8px" }}>{c.phone}</td>
            <td style={{ padding: "10px 8px" }}>{c.orders}</td><td style={{ padding: "10px 8px" }}>{NGN(c.spend)}</td><td style={{ padding: "10px 8px" }}>{c.last}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function AdminPromotions() {
  const [codes, setCodes] = useState([{ code: "GOLD10", type: "Percentage", value: "10%", active: true }, { code: "WELCOME2000", type: "Fixed", value: "₦2,000", active: true }]);
  return (
    <div>
      <AdminHeading title="Promotions" body="Discount codes, flash sales and featured placements." />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, maxWidth: 560 }}>
        <thead><tr style={{ textAlign: "left", borderBottom: `2px solid ${COLORS.champagne}` }}>{["Code", "Type", "Value", "Active"].map((h) => <th key={h} style={{ padding: "10px 8px" }}>{h}</th>)}</tr></thead>
        <tbody>{codes.map((c, i) => (
          <tr key={c.code} style={{ borderBottom: `1px solid ${COLORS.champagne}` }}>
            <td style={{ padding: "10px 8px", fontWeight: 700 }}>{c.code}</td><td style={{ padding: "10px 8px" }}>{c.type}</td><td style={{ padding: "10px 8px" }}>{c.value}</td>
            <td style={{ padding: "10px 8px" }}><input type="checkbox" checked={c.active} onChange={(e) => setCodes(codes.map((x, xi) => xi === i ? { ...x, active: e.target.checked } : x))} style={{ accentColor: COLORS.gold }} /></td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ fontSize: 12, color: "#8a7a68", marginTop: 16, maxWidth: 460 }}>Flash sales, featured-product pinning and promotional banners plug into this same table once connected to a backend.</div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [mode, setMode] = useState("site"); // 'site' | 'admin'
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [deliveryPrices, setDeliveryPrices] = useState(INITIAL_DELIVERY);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [addedFlash, setAddedFlash] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const nav = (dest) => {
    if (CATEGORIES.some((c) => c.id === dest) || dest === "all") { setCategory(dest); setPage("shop"); }
    else setPage(dest);
  };

  const addToCart = (product, size, qty) => {
    const s = size || product.size[0]; const q = qty || 1;
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === product.id && it.size === s);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: copy[idx].qty + q }; return copy; }
      return [...prev, { id: product.id, name: product.name, price: product.discountPrice || product.price, size: s, qty: q, gradient: product.gradient }];
    });
    setAddedFlash(true); setTimeout(() => setAddedFlash(false), 2500);
    setCartOpen(true);
    setQuickView(null);
  };
  const updateQty = (idx, qty) => { if (qty < 1) return; setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, qty } : it))); };
  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const toggleWishlist = (id) => { setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])); showToast(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist"); };

  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const placeOrder = ({ form, total, deliveryFee }) => {
    const id = "BF-" + Math.floor(10000 + Math.random() * 89999);
    const order = { id, customer: form.name, phone: form.phone, items: cart.map((it) => ({ name: it.name, qty: it.qty, price: it.price })), total, state: form.state, address: `${form.address}, ${form.city}`, payment: "Paid", status: "Order Received", date: new Date().toISOString().slice(0, 10) };
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    setCart([]);
    setPage("confirmation");
  };

  if (mode === "admin") {
    return <AdminApp products={products} setProducts={setProducts} slides={slides} setSlides={setSlides} orders={orders} setOrders={setOrders} deliveryPrices={deliveryPrices} setDeliveryPrices={setDeliveryPrices} onExit={() => setMode("site")} />;
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const cardHandlers = { onQuickView: setQuickView, onAdd: (p) => addToCart(p), onWishlist: toggleWishlist };

  return (
    <div className="bf-root" style={{ minHeight: "100vh" }}>
      <GlobalStyle />
      <Navbar cartCount={cart.reduce((s, i) => s + i.qty, 0)} wishCount={wishlist.length} onNav={nav} onOpenCart={() => setCartOpen(true)} onOpenSearch={() => nav("all")} onGoAdmin={() => setMode("admin")} onGoAccount={() => setPage("account")} />

      {page === "home" && (
        <>
          <HeroCarousel slides={slides} onCta={nav} />
          <CategorySection onSelect={nav} />
          <BestSellers products={products} {...cardHandlers} wishlist={wishlist} />
          <WhyUs />
          <BrandStory onNav={nav} />
          <FeaturedCollection onNav={nav} />
          <Reviews reviews={INITIAL_REVIEWS} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 20px", textAlign: "center" }}>
            <button onClick={() => setPage("tracking")} className="bf-btn-outline" style={{ marginRight: 10 }}>TRACK AN ORDER</button>
            <button onClick={() => setMode("admin")} className="bf-btn-outline">ADMIN PORTAL</button>
          </div>
        </>
      )}

      {page === "shop" && (
        <ShopSection products={products} initialCategory={category} onQuickView={setQuickView} onAdd={(p) => addToCart(p)} onWishlist={toggleWishlist} wishlist={wishlist} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}

      {page === "wishlist" && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 100px" }}>
          <SectionHeading eyebrow="Saved For Later" title="Your wishlist" />
          <div style={{ marginTop: 30 }}>
            {wishlistProducts.length === 0 ? <EmptyState title="Your wishlist is empty" body="Tap the heart on any product to save it here." /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
                {wishlistProducts.map((p) => <ProductCard key={p.id} p={p} onQuickView={setQuickView} onAdd={(pp) => addToCart(pp)} onWishlist={toggleWishlist} wished={true} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {page === "about" && (
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 100px" }}>
          <SectionHeading eyebrow="Our Story" title="About Beauty's Fragrance" />
          <p style={{ fontSize: 15, lineHeight: 2, color: "#6b5c4e", marginTop: 26 }}>
            Beauty's Fragrance is a Nigerian fragrance and beauty brand built on one idea: luxury should be something you can actually wear, every day, without apology. We curate perfumes, oils, mists and sprays that hold up in the heat, travel well from morning meetings to evening plans, and never feel out of reach.
            <br /><br />
            From our first bottle to every order we ship today, the promise is the same — original products, honest pricing, and a shopping experience that feels as good as the scent itself.
          </p>
          <button className="bf-btn-gold" style={{ marginTop: 10 }} onClick={() => nav("all")}>SHOP THE COLLECTION</button>
        </section>
      )}

      {page === "contact" && (
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 100px", textAlign: "center" }}>
          <SectionHeading eyebrow="Get In Touch" title="Contact us" />
          <p style={{ fontSize: 14, color: "#8a7a68", margin: "20px 0" }}>We usually respond within a few hours on WhatsApp.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "14px 26px", textDecoration: "none", fontSize: 13.5, fontWeight: 600 }}>
            <MessageCircle size={16} /> Chat on WhatsApp — 0814 471 1396
          </a>
        </section>
      )}

      {page === "checkout" && (
        <Checkout cart={cart} subtotal={subtotal} deliveryPrices={deliveryPrices} onBack={() => setPage("shop")} onPlaceOrder={placeOrder} />
      )}
      {page === "confirmation" && lastOrder && (
        <OrderConfirmation order={lastOrder} onTrack={() => setPage("tracking")} onContinue={() => nav("all")} />
      )}
      {page === "tracking" && <OrderTracking orders={orders} />}
      {page === "account" && <AccountPage orders={orders.slice(0, 2)} wishlistProducts={wishlistProducts} onNav={nav} />}

      <Newsletter />
      <Footer onNav={nav} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} subtotal={subtotal}
        addedToast={addedFlash} onCheckout={() => { setCartOpen(false); setPage("checkout"); }} />
      {quickView && <ProductModal product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} onWishlist={toggleWishlist} wished={wishlist.includes(quickView.id)} />}
      <Toast toast={toast} />
    </div>
  );
}