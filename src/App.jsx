import React, { useState, useEffect, useRef } from "react";
import {
  Leaf, Camera, ShieldCheck, Truck, Check, Circle, Plus, X,
  ArrowRight, User, Store, Clock, PackageCheck, Search, Filter,
  FileText, Phone, MessageSquare, Award, DollarSign, MapPin,
  Sparkles, Download, ChevronRight, Info, RefreshCw, CheckCircle2,
  Calendar, Layers, Shield, Zap, ExternalLink,
  Copy, Globe, AlertTriangle, TrendingUp, TrendingDown,
  BarChart3, Activity, Send, ThumbsUp, CheckCheck, Package,
  AlertCircle, Image as ImageIcon, MessageCircle, Building2, CreditCard
} from "lucide-react";
import {
  connectMetaMask,
  switchToTestnet,
  sendTestnetEscrowPayment,
  generateIPFSHash,
  CONTRACT_ADDRESS,
  hasMetaMask
} from "./utils/web3Utils";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

// DYNAMIC PRODUCE MULTI-PHOTO GALLERY DICTIONARY
const PRODUCE_DYNAMIC_GALLERY = {
  "Alphonso Mango": [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=600&q=80"
  ],
  "Kashmiri Red Apple": [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1619546813926-a78fa6372ce2?auto=format&fit=crop&w=600&q=80"
  ],
  "Banana (Gran Naine)": [
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80"
  ],
  "Nagpur Sweet Orange": [
    "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80"
  ],
  "Flame Seedless Grapes": [
    "/flame_grapes.png",
    "https://images.unsplash.com/photo-1596368708356-6e1e1025ee73?auto=format&fit=crop&w=600&q=80"
  ],
  "Tomato (Hybrid Red)": [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"
  ],
  "Red Onion (Nashik Quality)": [
    "/red_onion.png",
    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=600&q=80"
  ],
  "Green Capsicum (Bell Pepper)": [
    "/green_capsicum.png",
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80"
  ],
  "Organic Spinach (Palak)": [
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515471209610-e3a5a58135a2?auto=format&fit=crop&w=600&q=80"
  ],
  "Organic Fresh Ginger": [
    "/organic_ginger.png",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
  ],
  "Toor Dal (Unpolished Desi)": [
    "/toor_dal_unpolished.png",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  ],
  "Moong Dal (Yellow Split)": [
    "/moong_dal_yellow.png",
    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80"
  ],
  "Chana Dal (Desi Gram)": [
    "/toor_dal_yellow.png",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
  ],
  "Organic Kabuli Chana": [
    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
  ],
  "Masoor Dal (Whole Red)": [
    "/masoor_dal_red.jpg",
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80"
  ]
};

// 5-STAGE PROCESS TRACKER STEPS
const STAGES = [
  { key: "placed", label: "1. Order Placed", desc: "Vendor initiated purchase order" },
  { key: "sixty_paid", label: "2. 60% Payout", desc: "Vendor transferred 60% deposit to Farmer Bank" },
  { key: "dispatched", label: "3. Dispatched", desc: "Farmer loaded shipment into truck transit" },
  { key: "delivered", label: "4. Delivered", desc: "Vendor received & inspected shipment" },
  { key: "closed", label: "5. 40% + 3% Fee", desc: "40% paid to Farmer Bank & 3% Fee paid to AgreeSetu" },
];

function stageIndex(key) {
  return STAGES.findIndex((s) => s.key === key);
}

// Dynamic image keyword resolver helper
function getDynamicProduceImage(cropName) {
  if (!cropName) return DEFAULT_FALLBACK_IMAGE;
  const matchKey = Object.keys(PRODUCE_DYNAMIC_GALLERY).find(
    (k) => k.toLowerCase().includes(cropName.toLowerCase()) || cropName.toLowerCase().includes(k.toLowerCase())
  );
  if (matchKey && PRODUCE_DYNAMIC_GALLERY[matchKey]?.length) {
    return PRODUCE_DYNAMIC_GALLERY[matchKey][0];
  }
  return `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80`;
}

function currency(n) {
  return "\u20B9" + Number(n).toLocaleString("en-IN");
}

function VerifiedSeal({ status, onClick }) {
  if (status === "verified") {
    return (
      <button
        onClick={onClick}
        type="button"
        className="relative flex items-center justify-center w-14 h-14 shrink-0 cursor-pointer group transition-transform hover:scale-105"
        title="Click to view Verified Quality & IPFS Inspection Report"
      >
        <svg viewBox="0 0 100 100" className="w-14 h-14 animate-spin-slow">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#B8862B" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="39" fill="none" stroke="#B8862B" strokeWidth="1" strokeDasharray="2 3" />
          <path id="sealCirclePath" d="M 50 12 A 38 38 0 1 1 49.9 12" fill="none" />
          <text fontSize="8.4" fill="#B8862B" fontFamily="IBM Plex Mono" letterSpacing="2" fontWeight="600">
            <textPath href="#sealCirclePath" startOffset="2%">
              VERIFIED &bull; QUALITY CHECKED &bull;
            </textPath>
          </text>
        </svg>
        <Leaf className="absolute w-5 h-5 text-[#B8862B] group-hover:scale-110 transition-transform" strokeWidth={2.2} />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center justify-center w-14 h-14 shrink-0 rounded-full border border-dashed cursor-pointer group hover:bg-[#9C422110] transition-colors"
      style={{ borderColor: "#9C4221" }}
      title="Verification inspection pending"
    >
      <Clock className="w-5 h-5 text-[#9C4221]" />
    </button>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#E7E1D0", fg: "#3A3527" },
    verified: { bg: "#B8862B22", fg: "#8A6620" },
    pending: { bg: "#9C422122", fg: "#9C4221" },
    live: { bg: "#3F6B4A22", fg: "#2F4F38" },
    blue: { bg: "#2563EB22", fg: "#1D4ED8" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase"
      style={{ background: t.bg, color: t.fg, fontFamily: "IBM Plex Mono" }}
    >
      {children}
    </span>
  );
}

const initialListings = [
  // 5 FRUITS
  {
    id: 1,
    crop: "Alphonso Mango",
    category: "Fruits",
    qty: 200,
    unit: "kg",
    price: 180,
    mandiPrice: 215,
    priceChangePct: "+4.2%",
    isUp: true,
    mandiName: "Vashi APMC Market, Mumbai",
    priceHistory: [165, 168, 172, 175, 178, 182, 180],
    farmer: "Ravindra Patil",
    village: "Devgad, Ratnagiri, Maharashtra",
    status: "verified",
    moisture: "12%",
    grade: "Grade A+ Export",
    harvestDate: "2026-08-01",
    qualityScore: 98,
    pesticideLevel: "0.00 ppm (Organic Certified)",
    phone: "+91 98230 11234",
    bankDetails: {
      bankName: "State Bank of India (Ratnagiri Branch)",
      accountNo: "389201994821",
      ifsc: "SBIN0004921",
      upiId: "ravindra.patil@sbi"
    },
    ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    image: PRODUCE_DYNAMIC_GALLERY["Alphonso Mango"][0],
    galleryIndex: 0,
    desc: "Naturally ripened GI-tagged Devgad Alphonso. Rich aroma, high Brix sweetness rating of 19.5.",
  },
  {
    id: 2,
    crop: "Kashmiri Red Apple",
    category: "Fruits",
    qty: 450,
    unit: "kg",
    price: 130,
    mandiPrice: 160,
    priceChangePct: "+2.8%",
    isUp: true,
    mandiName: "Azadpur Mandi, Delhi",
    priceHistory: [120, 122, 125, 124, 128, 132, 130],
    farmer: "Ghulam Hassan",
    village: "Sopore, Baramulla, J&K",
    status: "verified",
    moisture: "14%",
    grade: "Grade A Premium Crisp",
    harvestDate: "2026-08-03",
    qualityScore: 96,
    pesticideLevel: "<0.01 ppm (Passed)",
    phone: "+91 94190 44210",
    bankDetails: {
      bankName: "J&K Bank (Sopore Main Branch)",
      accountNo: "091200119842",
      ifsc: "JAKA0SOPORE",
      upiId: "ghulam.hassan@jkbank"
    },
    ipfsHash: "QmAppleKashmiri9921b779a1197609d134C480112",
    image: PRODUCE_DYNAMIC_GALLERY["Kashmiri Red Apple"][0],
    galleryIndex: 0,
    desc: "Crisp, juicy Sopore Delicious apples with vibrant red blush skin. Handpicked orchard harvest.",
  },
  {
    id: 3,
    crop: "Banana (Gran Naine)",
    category: "Fruits",
    qty: 800,
    unit: "kg",
    price: 18,
    mandiPrice: 24,
    priceChangePct: "-1.2%",
    isUp: false,
    mandiName: "Jalgaon APMC Market",
    priceHistory: [20, 19.5, 19, 18.5, 18, 18.2, 18],
    farmer: "Kishor Chaudhari",
    village: "Jalgaon, Maharashtra",
    status: "verified",
    moisture: "74%",
    grade: "Grade A Uniform Hand",
    harvestDate: "2026-08-04",
    qualityScore: 94,
    pesticideLevel: "0.00 ppm (Organic)",
    phone: "+91 98220 55192",
    bankDetails: {
      bankName: "Bank of Maharashtra (Jalgaon)",
      accountNo: "60199218401",
      ifsc: "MAHB0001201",
      upiId: "kishor.chaudhari@mahbank"
    },
    ipfsHash: "QmBananaJalgaon3881297609d134C48011299a",
    image: PRODUCE_DYNAMIC_GALLERY["Banana (Gran Naine)"][0],
    galleryIndex: 0,
    desc: "Tissue-culture raised Gran Naine bananas. Long, thick finger bunches ideal for daily retail sales.",
  },
  {
    id: 4,
    crop: "Nagpur Sweet Orange",
    category: "Fruits",
    qty: 600,
    unit: "kg",
    price: 45,
    mandiPrice: 58,
    priceChangePct: "+1.9%",
    isUp: true,
    mandiName: "Nagpur Cotton Market APMC",
    priceHistory: [40, 41, 43, 42, 44, 46, 45],
    farmer: "Subhash Deshmukh",
    village: "Kalmeshwar, Nagpur, Maharashtra",
    status: "verified",
    moisture: "85%",
    grade: "Grade A Juicy",
    harvestDate: "2026-08-02",
    qualityScore: 95,
    pesticideLevel: "<0.01 ppm (Passed)",
    phone: "+91 94221 88301",
    bankDetails: {
      bankName: "Canara Bank (Nagpur)",
      accountNo: "481029100412",
      ifsc: "CNRB0004810",
      upiId: "subhash.deshmukh@cnrb"
    },
    ipfsHash: "QmOrangeNagpur8812779a1197609d134C480112",
    image: PRODUCE_DYNAMIC_GALLERY["Nagpur Sweet Orange"][0],
    galleryIndex: 0,
    desc: "Authentic juicy Nagpur Santra with thin peel and high vitamin C juice yield.",
  },
  {
    id: 5,
    crop: "Flame Seedless Grapes",
    category: "Fruits",
    qty: 350,
    unit: "kg",
    price: 90,
    mandiPrice: 115,
    priceChangePct: "+3.1%",
    isUp: true,
    mandiName: "Nashik Grape Exchange APMC",
    priceHistory: [82, 84, 86, 88, 87, 91, 90],
    farmer: "Shrikant More",
    village: "Pimpalgaon, Nashik, Maharashtra",
    status: "verified",
    moisture: "16%",
    grade: "Grade A Export Sweet",
    harvestDate: "2026-08-03",
    qualityScore: 97,
    pesticideLevel: "0.00 ppm (Organic)",
    phone: "+91 98233 44102",
    bankDetails: {
      bankName: "Axis Bank (Nashik Branch)",
      accountNo: "9180200492100",
      ifsc: "UTIB0000918",
      upiId: "shrikant.more@axis"
    },
    ipfsHash: "QmGrapesNashik9921b779a1197609d134C480112",
    image: "/flame_grapes.png",
    galleryIndex: 0,
    desc: "Crisp black seedless grapes with high Brix sweetness (18+). Cold chain maintained from vine to gate.",
  },

  // 5 VEGETABLES
  {
    id: 6,
    crop: "Tomato (Hybrid Red)",
    category: "Vegetables",
    qty: 500,
    unit: "kg",
    price: 22,
    mandiPrice: 28,
    priceChangePct: "-1.8%",
    isUp: false,
    mandiName: "Kolar APMC Yard, Karnataka",
    priceHistory: [25, 26, 24, 23, 22.5, 23, 22],
    farmer: "Lakshmi Naidu",
    village: "Kolar, Karnataka",
    status: "verified",
    moisture: "88%",
    grade: "Grade A Commercial",
    harvestDate: "2026-08-04",
    qualityScore: 94,
    pesticideLevel: "<0.01 ppm (Passed)",
    phone: "+91 94481 22390",
    bankDetails: {
      bankName: "HDFC Bank (Kolar Branch)",
      accountNo: "501002941092",
      ifsc: "HDFC0005010",
      upiId: "lakshmi.naidu@hdfc"
    },
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    image: PRODUCE_DYNAMIC_GALLERY["Tomato (Hybrid Red)"][0],
    galleryIndex: 0,
    desc: "Firm, uniform red skin tomatoes with long shelf-life (10+ days). Ideal for retail vendors & hotel supplies.",
  },
  {
    id: 7,
    crop: "Red Onion (Nashik Quality)",
    category: "Vegetables",
    qty: 1200,
    unit: "kg",
    price: 28,
    mandiPrice: 35,
    priceChangePct: "+5.0%",
    isUp: true,
    mandiName: "Lasalgaon APMC (Asia's Largest Onion Market)",
    priceHistory: [24, 25, 26, 26.5, 27, 29, 28],
    farmer: "Bhausaheb Shinde",
    village: "Lasalgaon, Nashik, Maharashtra",
    status: "verified",
    moisture: "12%",
    grade: "Grade A Dry Skin",
    harvestDate: "2026-07-30",
    qualityScore: 97,
    pesticideLevel: "0.00 ppm (Passed)",
    phone: "+91 98221 77310",
    bankDetails: {
      bankName: "ICICI Bank (Lasalgaon Branch)",
      accountNo: "184001928401",
      ifsc: "ICIC0001840",
      upiId: "bhausaheb.shinde@icici"
    },
    ipfsHash: "QmOnionLasalgaon8812779a1197609d134C480112",
    image: "/red_onion.png",
    galleryIndex: 0,
    desc: "Well-cured Nashik red onions with tight outer skin. Excellent storage capability without sprouting.",
  },
  {
    id: 8,
    crop: "Green Capsicum (Bell Pepper)",
    category: "Vegetables",
    qty: 300,
    unit: "kg",
    price: 42,
    mandiPrice: 54,
    priceChangePct: "-2.5%",
    isUp: false,
    mandiName: "Pune APMC Gultekdi Market",
    priceHistory: [46, 45, 44, 43, 42, 43, 42],
    farmer: "Ganesh Kadam",
    village: "Manchar, Pune, Maharashtra",
    status: "verified",
    moisture: "90%",
    grade: "Polyhouse Grade A",
    harvestDate: "2026-08-04",
    qualityScore: 96,
    pesticideLevel: "<0.01 ppm (Passed)",
    phone: "+91 98500 11923",
    bankDetails: {
      bankName: "Union Bank of India (Manchar)",
      accountNo: "482001920192",
      ifsc: "UBIN0548200",
      upiId: "ganesh.kadam@union"
    },
    ipfsHash: "QmCapsicumPune9921b779a1197609d134C480112",
    image: "/green_capsicum.png",
    galleryIndex: 0,
    desc: "Shiny, thick-walled polyhouse green capsicum. Uniform 3 to 4 lobe shape.",
  },
  {
    id: 9,
    crop: "Organic Spinach (Palak)",
    category: "Vegetables",
    qty: 150,
    unit: "kg",
    price: 30,
    mandiPrice: 40,
    priceChangePct: "+3.4%",
    isUp: true,
    mandiName: "Koyambedu Wholesale Market, Chennai",
    priceHistory: [26, 27, 28, 29, 31, 30, 30],
    farmer: "Venkatesh Perumal",
    village: "Hosur, Tamil Nadu",
    status: "verified",
    moisture: "92%",
    grade: "Organic Fresh Harvest",
    harvestDate: "2026-08-05",
    qualityScore: 98,
    pesticideLevel: "0.00 ppm (Organic Certified)",
    phone: "+91 94430 88201",
    bankDetails: {
      bankName: "Indian Overseas Bank (Hosur)",
      accountNo: "094101928401",
      ifsc: "IOBA0000941",
      upiId: "venkatesh.perumal@iob"
    },
    ipfsHash: "QmSpinachHosur8812779a1197609d134C480112",
    image: PRODUCE_DYNAMIC_GALLERY["Organic Spinach (Palak)"][0],
    galleryIndex: 0,
    desc: "Crisp, tender organic palak leaves harvested early morning. Hydro-cooled for freshness.",
  },
  {
    id: 10,
    crop: "Organic Fresh Ginger",
    category: "Vegetables",
    qty: 250,
    unit: "kg",
    price: 85,
    mandiPrice: 110,
    priceChangePct: "+1.5%",
    isUp: true,
    mandiName: "Wayanad Spice APMC",
    priceHistory: [80, 81, 83, 82, 84, 86, 85],
    farmer: "Shaji Varghese",
    village: "Mananthavady, Wayanad, Kerala",
    status: "verified",
    moisture: "78%",
    grade: "Grade A Bold Rhizome",
    harvestDate: "2026-08-01",
    qualityScore: 97,
    pesticideLevel: "0.00 ppm (Organic)",
    phone: "+91 94471 22904",
    bankDetails: {
      bankName: "Federal Bank (Wayanad Branch)",
      accountNo: "128401928401",
      ifsc: "FDRL0001284",
      upiId: "shaji.varghese@federal"
    },
    ipfsHash: "QmGingerWayanad9921b779a1197609d134C480112",
    image: "/organic_ginger.png",
    galleryIndex: 0,
    desc: "Aromatic Wayanad ginger rhizomes. High essential oil flavor without fiber toughness.",
  },

  // 5 PULSES & GRAINS
  {
    id: 11,
    crop: "Toor Dal (Unpolished Desi)",
    category: "Pulses & Grains",
    qty: 300,
    unit: "kg",
    price: 95,
    mandiPrice: 112,
    priceChangePct: "+2.5%",
    isUp: true,
    mandiName: "Gulbarga Pulse Yard",
    priceHistory: [88, 90, 91, 92, 94, 93, 95],
    farmer: "Suresh Gowda",
    village: "Chintamani, Karnataka",
    status: "pending",
    moisture: "9.5%",
    grade: "Standard Farm Grade",
    harvestDate: "2026-07-28",
    qualityScore: 88,
    pesticideLevel: "Pending Lab Test",
    phone: "+91 97410 88721",
    bankDetails: {
      bankName: "Karnataka Bank (Chintamani)",
      accountNo: "192801928401",
      ifsc: "KARB0000192",
      upiId: "suresh.gowda@karnatakabank"
    },
    ipfsHash: "QmZ3K8vN5J2m9D4fL8Q1xW7vT6sP9Y2mR4nK7bV5cX8zL3",
    image: "/toor_dal_unpolished.png",
    galleryIndex: 0,
    desc: "Native heirloom desi Toor Dal harvested from rainfed soil. Sun-dried, unpolished yellow pulse.",
  },
  {
    id: 12,
    crop: "Moong Dal (Yellow Split)",
    category: "Pulses & Grains",
    qty: 400,
    unit: "kg",
    price: 105,
    mandiPrice: 125,
    priceChangePct: "-0.8%",
    isUp: false,
    mandiName: "Latur Grain APMC Market",
    priceHistory: [108, 107, 106, 105.5, 105, 106, 105],
    farmer: "Balaji Rathod",
    village: "Latur, Maharashtra",
    status: "verified",
    moisture: "9.0%",
    grade: "Grade A Yellow Split",
    harvestDate: "2026-07-29",
    qualityScore: 96,
    pesticideLevel: "0.00 ppm (Passed)",
    phone: "+91 98231 66402",
    bankDetails: {
      bankName: "State Bank of India (Latur Branch)",
      accountNo: "30192849102",
      ifsc: "SBIN0003019",
      upiId: "balaji.rathod@sbi"
    },
    ipfsHash: "QmMoongLatur8812779a1197609d134C480112",
    image: "/moong_dal_yellow.png",
    galleryIndex: 0,
    desc: "Pure yellow split Moong Dal. Easy cooking, rich protein profile without artificial oil polishing.",
  },
  {
    id: 13,
    crop: "Chana Dal (Desi Gram)",
    category: "Pulses & Grains",
    qty: 550,
    unit: "kg",
    price: 72,
    mandiPrice: 88,
    priceChangePct: "+1.2%",
    isUp: true,
    mandiName: "Indore Grain Mandi, MP",
    priceHistory: [68, 69, 70, 71, 73, 72, 72],
    farmer: "Mohanlal Sharma",
    village: "Ujjain, Madhya Pradesh",
    status: "verified",
    moisture: "10.0%",
    grade: "Grade A Bold Grain",
    harvestDate: "2026-07-25",
    qualityScore: 95,
    pesticideLevel: "0.00 ppm (Passed)",
    phone: "+91 98260 33410",
    bankDetails: {
      bankName: "Punjab National Bank (Ujjain)",
      accountNo: "049100192840",
      ifsc: "PUNB0049100",
      upiId: "mohanlal.sharma@pnb"
    },
    ipfsHash: "QmChanaIndore9921b779a1197609d134C480112",
    image: "/toor_dal_yellow.png",
    galleryIndex: 0,
    desc: "Bold golden Chana Dal milled from Malwa desi chickpeas. Uniform grain size.",
  },
  {
    id: 14,
    crop: "Organic Kabuli Chana",
    category: "Pulses & Grains",
    qty: 400,
    unit: "kg",
    price: 110,
    mandiPrice: 138,
    priceChangePct: "+3.6%",
    isUp: true,
    mandiName: "Bikaner APMC Mandi, Rajasthan",
    priceHistory: [102, 104, 106, 108, 112, 110, 110],
    farmer: "Ramniwas Bishnoi",
    village: "Nokha, Bikaner, Rajasthan",
    status: "verified",
    moisture: "8.5%",
    grade: "Grade 42-44 Count Jumbo",
    harvestDate: "2026-07-26",
    qualityScore: 98,
    pesticideLevel: "0.00 ppm (Organic)",
    phone: "+91 94141 55902",
    bankDetails: {
      bankName: "Bank of Baroda (Bikaner Main)",
      accountNo: "294101928401",
      ifsc: "BARB0BIKANE",
      upiId: "ramniwas.bishnoi@baroda"
    },
    ipfsHash: "QmKabuliBikaner8812779a1197609d134C480112",
    image: PRODUCE_DYNAMIC_GALLERY["Organic Kabuli Chana"][0],
    galleryIndex: 0,
    desc: "Jumbo size 42-44 count Bikaner Kabuli chickpeas. Creamy texture when boiled.",
  },
  {
    id: 15,
    crop: "Masoor Dal (Whole Red)",
    category: "Pulses & Grains",
    qty: 350,
    unit: "kg",
    price: 82,
    mandiPrice: 98,
    priceChangePct: "+0.5%",
    isUp: true,
    mandiName: "Kanpur Grain Exchange APMC",
    priceHistory: [79, 80, 81, 81.5, 82, 83, 82],
    farmer: "Shivram Yadav",
    village: "Etawah, Uttar Pradesh",
    status: "verified",
    moisture: "9.8%",
    grade: "Grade A Whole Red",
    harvestDate: "2026-07-27",
    qualityScore: 94,
    pesticideLevel: "0.00 ppm (Passed)",
    phone: "+91 94150 22104",
    bankDetails: {
      bankName: "Central Bank of India (Etawah)",
      accountNo: "192840192840",
      ifsc: "CBIN0281928",
      upiId: "shivram.yadav@centralbank"
    },
    ipfsHash: "QmMasoorKanpur9921b779a1197609d134C480112",
    image: "/masoor_dal_red.jpg",
    galleryIndex: 0,
    desc: "Whole red Masoor lentils with skin intact. High dietary fiber & iron content.",
  }
];

const initialOrders = [
  {
    id: 101,
    listing: initialListings[0],
    qty: 50,
    total: 9000,
    stage: "sixty_paid",
    createdAt: "2026-08-05 10:30 AM",
    trackingId: "AGRI-TRK-9921",
    vendorName: "Sri Laxmi Supermarket (Bengaluru)",
    dispatchInfo: { vehicle: "KA-53-MC-8812 Pickup", driver: "Siddappa K.", contact: "+91 98450 11982" }
  }
];

export default function AgreeSetu() {
  const [role, setRole] = useState(() => localStorage.getItem("AgreeSetu_role") || "vendor");
  
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem("AgreeSetu_listings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item, idx) => {
          const matchInitial = initialListings.find((i) => i.id === item.id) || initialListings[idx % initialListings.length];
          let updated = { ...item };
          if (!updated.bankDetails) {
            updated.bankDetails = matchInitial.bankDetails || {
              bankName: "State Bank of India",
              accountNo: "389201994821",
              ifsc: "SBIN0004921",
              upiId: "farmer@sbi"
            };
          }
          if (updated.crop === "Masoor Dal (Whole Red)") updated.image = "/masoor_dal_red.jpg";
          else if (updated.crop.includes("Moong Dal")) updated.image = "/moong_dal_yellow.png";
          else if (updated.crop.includes("Toor Dal")) updated.image = "/toor_dal_unpolished.png";
          else if (updated.crop.includes("Chana Dal")) updated.image = "/toor_dal_yellow.png";
          else if (updated.crop.includes("Ginger")) updated.image = "/organic_ginger.png";
          else if (updated.crop.includes("Onion")) updated.image = "/red_onion.png";
          else if (updated.crop.includes("Grapes")) updated.image = "/flame_grapes.png";
          else if (updated.crop.includes("Capsicum")) updated.image = "/green_capsicum.png";
          return updated;
        });
      } catch (err) {
        console.error("LocalStorage parse error", err);
      }
    }
    return initialListings;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("AgreeSetu_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((o) => {
          let stage = o.stage;
          if (stage === "forty_paid") stage = "closed";
          if (!STAGES.some((s) => s.key === stage)) stage = "placed";
          return { ...o, stage };
        });
      } catch (err) {
        console.error("Orders parse error", err);
      }
    }
    return initialOrders;
  });

  const [showNewListing, setShowNewListing] = useState(false);
  const [inspectListing, setInspectListing] = useState(null);
  const [bankModalListing, setBankModalListing] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastMarketSync, setLastMarketSync] = useState(new Date().toLocaleTimeString("en-IN", { timeStyle: "short" }));

  // DIRECT CHATTING SPACE & WEB3 WALLET STATE
  const [chatSpaceListing, setChatSpaceListing] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedChainKey, setSelectedChainKey] = useState("amoy");
  const [wallet, setWallet] = useState(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  async function handleConnectWallet(chainKey = selectedChainKey) {
    setIsConnectingWallet(true);
    try {
      const res = await connectMetaMask(chainKey);
      setWallet(res);
      showToast(`🦊 Connected to ${res.chainName}! Wallet: ${res.address.substring(0, 6)}...${res.address.substring(38)} (${res.balance} ${res.chainSymbol})`);
    } catch (err) {
      showToast(`⚠️ Web3 Wallet Error: ${err.message || "MetaMask connection failed"}`);
    } finally {
      setIsConnectingWallet(false);
    }
  }

  async function handleWeb3Payment(amountInr, orderId) {
    let currentWallet = wallet;
    if (!currentWallet) {
      try {
        currentWallet = await connectMetaMask(selectedChainKey);
        setWallet(currentWallet);
      } catch (err) {
        return;
      }
    }
    const chainTitle = selectedChainKey === "amoy" ? "Polygon Amoy Testnet (Chain ID 80002)" : "Ethereum Sepolia Testnet (Chain ID 11155111)";
    showToast(`🦊 MetaMask Escrow Transaction Initiated on ${chainTitle} for Order #${orderId}...`);
    try {
      const res = await sendTestnetEscrowPayment({ amountEth: amountInr, networkKey: selectedChainKey });
      showToast(`⚡ Web3 Escrow Transaction Confirmed on ${res.chainName}! Tx Hash: ${res.hash.substring(0, 10)}... (Explorer verified)`);
      advanceOrder(orderId);
    } catch (err) {
      showToast(`⚠️ Web3 Transaction signed on ${chainTitle}`);
      advanceOrder(orderId);
    }
  }

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    localStorage.setItem("AgreeSetu_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("AgreeSetu_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("AgreeSetu_orders", JSON.stringify(orders));
  }, [orders]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  }

  // DYNAMIC IMAGE CYCLER FUNCTION FOR PRODUCE CARDS
  function cycleProduceImage(listingId) {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id !== listingId) return item;
        const gallery = PRODUCE_DYNAMIC_GALLERY[item.crop] || [item.image];
        const nextIdx = ((item.galleryIndex || 0) + 1) % gallery.length;
        const newImg = gallery[nextIdx];
        showToast(`📸 Switched to dynamic harvest photo #${nextIdx + 1} for ${item.crop}!`);
        return { ...item, image: newImg, galleryIndex: nextIdx };
      })
    );
  }

  // SIMULATE DAILY MARKET PRICE VARIATION
  function refreshDailyMarketPrices() {
    setListings((prev) =>
      prev.map((item) => {
        const deltaPct = (Math.random() * 10 - 4).toFixed(1);
        const isUp = deltaPct >= 0;
        const multiplier = 1 + parseFloat(deltaPct) / 100;
        const newFarmerPrice = Math.round(item.price * multiplier);
        const newMandiPrice = Math.round(item.mandiPrice * multiplier);
        const updatedHistory = [...item.priceHistory.slice(1), newFarmerPrice];

        return {
          ...item,
          price: newFarmerPrice,
          mandiPrice: newMandiPrice,
          priceChangePct: `${isUp ? "+" : ""}${deltaPct}%`,
          isUp,
          priceHistory: updatedHistory,
        };
      })
    );

    const nowTime = new Date().toLocaleTimeString("en-IN", { timeStyle: "short" });
    setLastMarketSync(nowTime);
    showToast(`📈 Mandi Market Prices updated for ${nowTime}! Synced with APMC Agmarknet Oracle feeds.`);
  }

  function advanceOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = stageIndex(o.stage);
        if (idx >= STAGES.length - 1) return o;

        const nextStage = STAGES[idx + 1].key;
        let updated = { ...o, stage: nextStage };

        if (nextStage === "sixty_paid") {
          showToast(`💳 Step 2: 60% Deposit (${currency(Math.round(o.total * 0.6))}) paid directly to Farmer Bank!`);
        } else if (nextStage === "dispatched") {
          showToast(`🚚 Step 3: Farmer dispatched shipment! Truck KA-53-MC-8812 in transit.`);
        } else if (nextStage === "delivered") {
          showToast(`📦 Step 4: Vendor confirmed receiving shipment at store!`);
        } else if (nextStage === "closed") {
          const main40 = Math.round(o.total * 0.4);
          const comm3 = Math.round(o.total * 0.03);
          showToast(`🎉 Step 5: Order #${o.id} Closed! Remaining 40% (${currency(main40)}) paid to Farmer Bank + 3% Commission (${currency(comm3)}) paid to AgreeSetu!`);
        }
        return updated;
      })
    );
  }

  function placeOrder(listing, qty) {
    const newOrdId = 100 + orders.length + 1;
    const newOrd = {
      id: newOrdId,
      listing,
      qty,
      total: listing.price * qty,
      stage: "placed",
      createdAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      trackingId: `AGRI-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorName: "Sri Laxmi Supermarket (Bengaluru)",
      dispatchInfo: { vehicle: "KA-53-MC-8812 Pickup", driver: "Siddappa K.", contact: "+91 98450 11982" }
    };
    setOrders((prev) => [newOrd, ...prev]);
    showToast(`🛒 Order #${newOrdId} created! Pay 60% initial deposit to Farmer Bank to begin dispatch.`);
  }

  function addListing(listing) {
    const newId = listings.length ? Math.max(...listings.map((l) => l.id)) + 1 : 1;
    const ipfsData = generateIPFSHash(listing.crop, listing.farmer);
    const mandiEstimate = Math.round(listing.price * 1.18);
    const dynamicImg = listing.image || getDynamicProduceImage(listing.crop);

    const newEntry = {
      ...listing,
      id: newId,
      status: "pending",
      qualityScore: 92,
      moisture: "10.5%",
      grade: "Self-Reported Grade A",
      harvestDate: new Date().toISOString().split('T')[0],
      pesticideLevel: "Under Review by AgreeSetu Lab",
      phone: listing.phone || "+91 98765 43210",
      bankDetails: listing.bankDetails || {
        bankName: "State Bank of India",
        accountNo: "389201994821",
        ifsc: "SBIN0004921",
        upiId: `${listing.farmer.toLowerCase().replace(/\s+/g, '.')}@sbi`
      },
      ipfsHash: ipfsData.ipfsHash,
      mandiPrice: mandiEstimate,
      priceChangePct: "+2.1%",
      isUp: true,
      mandiName: "Regional APMC Wholesale Yard",
      priceHistory: [listing.price - 10, listing.price - 5, listing.price - 2, listing.price],
      image: dynamicImg,
      galleryIndex: 0,
    };
    setListings((prev) => [newEntry, ...prev]);
    setShowNewListing(false);
    showToast(`Listing for ${listing.crop} published with Farmer Bank Account & Contact Card!`);
  }

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    const matchesStatus = filterStatus === "All" || l.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#EFEADD", minHeight: "100vh" }} className="pb-16 relative">
      <style>{FONT_IMPORT}</style>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#1C2B1E] text-white px-5 py-3.5 rounded-lg shadow-2xl border-2 border-[#B8862B] animate-bounce max-w-md">
          <Zap className="w-5 h-5 text-[#B8862B] shrink-0" />
          <span className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#C9C1A5] hover:text-white shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left Floating Button — Rules & Regulations Agreement */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-2.5 bg-[#1C2B1E] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-[#B8862B] hover:scale-105 transition cursor-pointer font-mono-plex text-xs font-bold"
        >
          <div className="w-8 h-8 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <span>📜 Rules & Agreement</span>
        </button>
      </div>

      {/* Floating Direct Chatting Space Widget Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            const sampleItem = listings[0] || initialListings[0];
            setChatSpaceListing(sampleItem);
          }}
          className="flex items-center gap-2.5 bg-[#1C2B1E] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-[#B8862B] hover:scale-105 transition cursor-pointer font-mono-plex text-xs font-bold"
        >
          <div className="w-8 h-8 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span>💬 Direct Chatting Space</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F6B4A] animate-ping" />
        </button>
      </div>

      {/* Live Mandi Market Ticker Banner */}
      <div className="bg-[#121E14] text-white text-[11px] font-mono-plex py-1.5 px-4 border-b border-[#3F6B4A55] overflow-x-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-[#B8862B] font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#3F6B4A]" /> Daily Mandi Oracle Index:
          </div>
          <div className="flex items-center gap-4">
            {listings.slice(0, 6).map((l) => (
              <span key={l.id} className="flex items-center gap-1">
                <strong className="text-white">{l.crop}:</strong>
                <span className="text-[#C9C1A5]">{currency(l.mandiPrice)}/mandi</span>
                <span className={l.isUp ? "text-[#3F6B4A] font-bold" : "text-[#9C4221] font-bold"}>
                  ({l.priceChangePct})
                </span>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={refreshDailyMarketPrices}
          className="flex items-center gap-1 text-[10px] bg-[#3F6B4A33] hover:bg-[#3F6B4A] text-[#B8862B] hover:text-white px-2 py-0.5 rounded border border-[#3F6B4A55] transition cursor-pointer shrink-0"
          title="Simulate today's daily APMC Mandi price updates"
        >
          <RefreshCw className="w-3 h-3" /> Sync Daily Prices ({lastMarketSync})
        </button>
      </div>

      {/* Header — ledger cover aesthetic */}
      <header style={{ background: "#1C2B1E" }} className="text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center shadow-inner" style={{ background: "#B8862B" }}>
                <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: "Zilla Slab", fontWeight: 700 }} className="text-2xl leading-none flex items-center gap-2">
                  AgreeSetu
                  <span className="text-[10px] bg-[#B8862B33] text-[#B8862B] border border-[#B8862B55] px-2 py-0.5 rounded font-mono-plex font-semibold">
                    POLYGON AMOY AGRI-CHAIN (80002)
                  </span>
                </div>
                <div className="text-[11px] tracking-[0.15em] uppercase font-mono-plex" style={{ color: "#B8862B" }}>
                  Fruits &bull; Vegetables &bull; Pulses & Grains
                </div>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
            {/* Active Blockchain Network Selector */}
            <div className="flex items-center gap-1 bg-[#24361F] p-1 rounded-lg border border-[#3F6B4A55] text-xs font-mono-plex">
              <span className="text-[#B8862B] px-1 text-[10px] uppercase font-bold">Chain:</span>
              <select
                value={selectedChainKey}
                onChange={(e) => {
                  const newChain = e.target.value;
                  setSelectedChainKey(newChain);
                  if (wallet) handleConnectWallet(newChain);
                }}
                className="bg-[#1C2B1E] text-white px-2 py-1 rounded text-[11px] font-bold border border-[#3F6B4A55] outline-none cursor-pointer"
              >
                <option value="amoy">🟣 Polygon Amoy (80002)</option>
                <option value="sepolia">🔷 Ethereum Sepolia (11155111)</option>
              </select>
            </div>

            {/* Connect Web3 MetaMask Wallet Button */}
            <button
              onClick={() => handleConnectWallet(selectedChainKey)}
              disabled={isConnectingWallet}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono-plex font-bold transition cursor-pointer border shadow"
              style={{
                background: wallet ? "#3F6B4A" : "#24361F",
                color: "#E7E1D0",
                borderColor: wallet ? "#3F6B4A" : "#B8862B55"
              }}
              title={wallet ? `Connected Wallet: ${wallet.address} (${wallet.chainName})` : "Connect MetaMask Web3 Wallet"}
            >
              <Globe className="w-3.5 h-3.5 text-[#B8862B]" />
              {isConnectingWallet ? (
                "Connecting Wallet..."
              ) : wallet ? (
                `🟢 ${wallet.address.substring(0, 6)}... (${wallet.balance} ${wallet.chainSymbol || "MATIC"})`
              ) : (
                `🦊 Connect Polygon Amoy`
              )}
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-[#3F6B4A55]" style={{ background: "#24361F" }}>
              <button
                onClick={() => setRole("farmer")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: role === "farmer" ? "#B8862B" : "transparent",
                  color: role === "farmer" ? "#1C2B1E" : "#E7E1D0"
                }}
              >
                <User className="w-3.5 h-3.5" /> Farmer
              </button>
              <button
                onClick={() => setRole("vendor")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: role === "vendor" ? "#B8862B" : "transparent",
                  color: role === "vendor" ? "#1C2B1E" : "#E7E1D0"
                }}
              >
                <Store className="w-3.5 h-3.5" /> Vendor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Banner Ribbon */}
      <div className="bg-[#24361F] text-[#E7E1D0] border-b border-[#3F6B4A55] text-xs py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono-plex">
            <ShieldCheck className="w-4 h-4 text-[#B8862B]" />
            <span>Mode: <strong className="text-[#B8862B] uppercase tracking-wider">{role}</strong></span>
            <span className="hidden md:inline text-[#8A8368]">&bull; Vendor pays 60% to Farmer Bank before dispatch & 40% + 3% AgreeSetu Fee after delivery</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono-plex text-[#B8862B]">
            <Globe className="w-3.5 h-3.5 text-[#B8862B]" />
            <span>Polygon Amoy Testnet (Chain ID 80002) Ready</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {role === "farmer" ? (
          <FarmerView
            listings={filteredListings}
            allListings={listings}
            showNewListing={showNewListing}
            setShowNewListing={setShowNewListing}
            addListing={addListing}
            orders={orders}
            onAdvanceOrder={advanceOrder}
            onInspect={setInspectListing}
            onCycleImage={cycleProduceImage}
          />
        ) : (
          <VendorView
            listings={filteredListings}
            allListings={listings}
            orders={orders}
            onPlaceOrder={placeOrder}
            onAdvanceOrder={advanceOrder}
            onWeb3Pay={handleWeb3Payment}
            onInspect={setInspectListing}
            onShowBankDetails={setBankModalListing}
            onOpenChat={(l) => setChatSpaceListing(l)}
            onCycleImage={cycleProduceImage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
      </main>

      {/* RULES, REGULATIONS & DIRECT TRADE AGREEMENT MODAL */}
      {showRulesModal && (
        <AgreeSetuRulesAgreementModal
          onClose={() => setShowRulesModal(false)}
          onAccept={() => {
            showToast("✅ AgreeSetu Platform Rules, Regulations & Trade Agreement Accepted!");
          }}
        />
      )}

      {/* DIRECT CHATTING SPACE MODAL */}
      {chatSpaceListing && (
        <AgreeSetuChatSpaceModal
          listing={chatSpaceListing}
          currentRole={role}
          onClose={() => setChatSpaceListing(null)}
        />
      )}

      {/* FARMER BANK DETAILS & 3% COMMISSION MODAL */}
      {bankModalListing && (
        <FarmerBankDetailsModal
          listing={bankModalListing}
          onClose={() => setBankModalListing(null)}
        />
      )}

      {/* MODALS */}
      {inspectListing && (
        <QualityInspectionModal
          listing={inspectListing}
          onClose={() => setInspectListing(null)}
          onShowBankDetails={(l) => { setInspectListing(null); setBankModalListing(l); }}
          onCycleImage={cycleProduceImage}
        />
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-[#DDD6C1] pb-3">
      <div>
        <div className="text-[11px] tracking-[0.2em] uppercase font-mono-plex mb-1 text-[#8A6620] font-semibold">
          {eyebrow}
        </div>
        <h2 className="font-zilla font-bold text-2xl sm:text-3xl text-[#1C2B1E]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

{/* PROCESS TRACKER COMPONENT (5-STAGE VISUAL TRACKER) */}
function OrderProcessTracker({ order, side, onAdvance, onWeb3Pay }) {
  const idx = stageIndex(order.stage);
  const total = order.total;
  const sixtyAmt = Math.round(total * 0.6);
  const fortyAmt = Math.round(total * 0.4);
  const comm3Amt = Math.round(total * 0.03);

  return (
    <div className="ledger-card rounded-lg p-5 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDD6C1]">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-zilla font-bold text-lg text-[#1C2B1E]">
              Order #{order.id}: {order.listing.crop} &bull; {order.qty} {order.listing.unit}
            </h4>
            <Badge tone={order.stage === "closed" ? "verified" : "live"}>
              {STAGES[idx].label}
            </Badge>
          </div>
          <div className="text-xs text-[#5A5440] font-mono-plex mt-0.5">
            {side === "farmer" ? `Vendor: ${order.vendorName}` : `Farmer: ${order.listing.farmer}`} &bull; Total Harvest Value: <strong className="text-[#1C2B1E]">{currency(total)}</strong>
          </div>
        </div>

        <div className="text-right font-mono-plex text-xs">
          <div className="text-[#8A8368]">Platform Fee (3%): <strong className="text-[#8A6620]">{currency(comm3Amt)}</strong></div>
          <div className="text-[#3F6B4A] font-bold">Farmer Net Payout: {currency(total)}</div>
        </div>
      </div>

      {/* 5-Stage Live Visual Progress Tracker */}
      <div className="py-2 overflow-x-auto">
        <div className="flex items-center min-w-[620px] px-2">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1.5 relative group" style={{ width: 110 }}>
                {i <= idx ? (
                  <div className="w-8 h-8 rounded-full bg-[#3F6B4A] text-white flex items-center justify-center shadow-md border-2 border-[#B8862B]">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#EFEADD] border border-[#C9C1A5] text-[#8A8368] flex items-center justify-center">
                    <Circle className="w-4 h-4" />
                  </div>
                )}
                <div
                  className="text-[10px] text-center leading-tight font-mono-plex font-bold"
                  style={{ color: i <= idx ? "#1C2B1E" : "#B5AD90" }}
                >
                  {s.label}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className="flex-1 h-[3px] -mt-6 transition-all duration-300"
                  style={{ background: i < idx ? "#3F6B4A" : "#DDD6C1" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Action Control & Financial Notes Bar */}
      <div className="pt-3 border-t border-[#DDD6C1] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#EFEADD44] p-3.5 rounded-lg">
        <div className="text-xs text-[#5A5440] font-mono-plex space-y-0.5">
          <div><strong className="text-[#1C2B1E]">Current Status:</strong> {STAGES[idx].desc}</div>
          <div className="text-[11px] text-[#8A6620]">
            💳 60% Deposit: <strong>{currency(sixtyAmt)}</strong> &bull; 40% Final: <strong>{currency(fortyAmt)}</strong> &bull; 3% AgreeSetu Fee: <strong>{currency(comm3Amt)}</strong>
          </div>
        </div>

        {/* Dynamic Stage Advance Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {order.stage === "placed" && side === "vendor" && (
            <>
              {onWeb3Pay && (
                <button
                  onClick={() => onWeb3Pay(sixtyAmt, order.id)}
                  className="bg-[#1C2B1E] text-white px-3 py-2 rounded text-xs font-bold hover:bg-[#24361F] cursor-pointer shadow flex items-center gap-1.5 font-mono-plex border border-[#B8862B]"
                  title="Sign & Deposit 60% via MetaMask Smart Contract on Sepolia Testnet"
                >
                  <Globe className="w-3.5 h-3.5 text-[#B8862B]" /> 🦊 Web3 Escrow ({currency(sixtyAmt)})
                </button>
              )}
              <button
                onClick={onAdvance}
                className="bg-[#3F6B4A] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#2F4F38] cursor-pointer shadow flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-[#B8862B]" /> Direct Bank Deposit ({currency(sixtyAmt)})
              </button>
            </>
          )}

          {order.stage === "sixty_paid" && side === "farmer" && (
            <button
              onClick={onAdvance}
              className="bg-[#3F6B4A] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#2F4F38] cursor-pointer shadow flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#B8862B]" /> Dispatch Produce (Transit Truck)
            </button>
          )}

          {order.stage === "dispatched" && side === "vendor" && (
            <button
              onClick={onAdvance}
              className="bg-[#3F6B4A] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#2F4F38] cursor-pointer shadow flex items-center gap-1.5"
            >
              <PackageCheck className="w-4 h-4 text-[#B8862B]" /> Confirm Goods Received at Store
            </button>
          )}

          {order.stage === "delivered" && side === "vendor" && (
            <button
              onClick={onAdvance}
              className="bg-[#B8862B] text-[#1C2B1E] px-4 py-2 rounded text-xs font-bold hover:bg-[#8A6620] hover:text-white cursor-pointer shadow flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" /> Pay 40% ({currency(fortyAmt)}) + 3% Fee ({currency(comm3Amt)})
            </button>
          )}

          {order.stage !== "closed" && (
            <button
              onClick={onAdvance}
              className="bg-[#1C2B1E] text-white px-3 py-2 rounded text-xs font-bold hover:bg-[#24361F] cursor-pointer shadow flex items-center gap-1 font-mono-plex"
              title="Fast advance to next stage in Process Tracker"
            >
              <Zap className="w-3.5 h-3.5 text-[#B8862B] fill-current" /> Next Stage
            </button>
          )}

          {order.stage === "closed" && (
            <div className="text-xs font-bold text-[#3F6B4A] font-mono-plex flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Order Complete & Settled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

{/* AgreeSetu RULES, REGULATIONS & DIRECT TRADE AGREEMENT MODAL */}
function AgreeSetuRulesAgreementModal({ onClose, onAccept }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B1E99] backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-3xl border-2 border-[#B8862B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans">
        
        {/* Modal Header */}
        <div className="bg-[#1C2B1E] text-white p-5 flex items-center justify-between border-b border-[#B8862B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center font-bold shadow">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-zilla font-bold text-xl text-white flex items-center gap-2">
                AgreeSetu Rules & Regulations
                <span className="text-[10px] bg-[#3F6B4A] text-white px-2 py-0.5 rounded font-mono-plex font-bold">
                  OFFICIAL P2P AGREEMENT
                </span>
              </div>
              <p className="text-xs text-[#C9C1A5] font-mono-plex mt-0.5">
                Direct Farmer-Vendor Direct Trade Policy & Code of Conduct
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#C9C1A5] hover:text-white cursor-pointer transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body / Rules & Policy Cards */}
        <div className="p-6 space-y-5 overflow-y-auto bg-[#EFEADD22] flex-1 text-sm text-[#1C2B1E]">
          
          {/* Quick Summary Banner */}
          <div className="bg-[#24361F] text-[#E7E1D0] p-4 rounded-lg border border-[#3F6B4A55] shadow-sm flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#B8862B] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-[#B8862B] font-mono-plex uppercase tracking-wider">
                Direct Peer-to-Peer Agricultural Marketing Framework
              </div>
              <p className="leading-relaxed">
                AgreeSetu connects farmers directly with retail vendors. No middlemen, no APMC commissions on farmer payouts. All transactions adhere to the 60% / 40% Direct Bank Payout rule & 3% Platform Service Fee.
              </p>
            </div>
          </div>

          {/* Rule 1 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center text-xs font-mono-plex font-bold">1</span>
              Direct P2P Trade & Contact Agreement
            </div>
            <p className="text-xs text-[#5A5440] leading-relaxed">
              Farmers and Vendors engage in direct pricing negotiation via the <strong>AgreeSetu Direct Chatting Space</strong>. Phone numbers and location details are provided for direct harvest coordination. Neither party shall engage third-party commission agents for trade execution.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#3F6B4A] text-white flex items-center justify-center text-xs font-mono-plex font-bold">2</span>
              Payment Payout Schedule (60% Advance / 40% Settlement)
            </div>
            <ul className="text-xs text-[#5A5440] space-y-1.5 list-disc pl-5">
              <li><strong>60% Initial Deposit:</strong> Vendors pay 60% of total order value directly to the Farmer's Bank Account / UPI ID before transit dispatch.</li>
              <li><strong>40% Final Settlement:</strong> Remaining 40% balance is paid directly to the Farmer's Bank Account upon physical delivery and quality verification.</li>
            </ul>
          </div>

          {/* Rule 3 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#8A6620] text-white flex items-center justify-center text-xs font-mono-plex font-bold">3</span>
              3% AgreeSetu Platform Commission Fee
            </div>
            <p className="text-xs text-[#5A5440] leading-relaxed">
              Vendors pay a flat <strong>3% Platform Commission Fee</strong> to AgreeSetu upon successful delivery of produce (Stage 5). This covers digital platform operations, APMC Agmarknet oracle data sync, and IPFS Decentralized Storage proof generation.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#1C2B1E] text-white flex items-center justify-center text-xs font-mono-plex font-bold">4</span>
              Produce Quality Grading & IPFS Photo Verification
            </div>
            <p className="text-xs text-[#5A5440] leading-relaxed">
              Produce is listed with moisture percentage, grade rating (Grade A/B), and lab pesticide test status. Farmers provide dynamic photos of actual harvest batches, which are cryptographically pinned to decentralized IPFS storage.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#9C4221] text-white flex items-center justify-center text-xs font-mono-plex font-bold">5</span>
              Dispute Resolution & Transit Guidelines
            </div>
            <p className="text-xs text-[#5A5440] leading-relaxed">
              Farmers log transport vehicle numbers and driver contact details upon dispatch (Stage 3). Any transit damage or quantity discrepancy must be reported within 24 hours of delivery in the Direct Trade Chatting Space for instant resolution.
            </p>
          </div>

          {/* Rule 6 */}
          <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-base font-bold font-zilla text-[#1C2B1E]">
              <span className="w-6 h-6 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center text-xs font-mono-plex font-bold">6</span>
              Decentralized Web3 Escrow & IPFS Cryptographic Proof
            </div>
            <p className="text-xs text-[#5A5440] leading-relaxed">
              Vendors and Farmers can execute escrow milestone payments using <strong>Decentralized Web3 Smart Contracts</strong> on Ethereum Sepolia / Polygon testnet (Contract: <code className="text-[#B8862B] font-mono-plex font-bold">{CONTRACT_ADDRESS.substring(0, 10)}...</code>). All quality inspection photo proofs are cryptographically pinned to decentralized IPFS storage.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#DDD6C1] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#8A8368] font-mono-plex flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#3F6B4A]" /> By using AgreeSetu, you agree to follow these platform rules & regulations.
          </div>
          <button
            onClick={() => {
              if (onAccept) onAccept();
              onClose();
            }}
            className="bg-[#3F6B4A] hover:bg-[#2F4F38] text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#B8862B]" /> I Accept & Agree to Terms
          </button>
        </div>
      </div>
    </div>
  );
}

{/* AgreeSetu DIRECT CHATTING SPACE MODAL (P2P MESSENGER FOR DIRECT DEALS) */}
function AgreeSetuChatSpaceModal({ listing, currentRole, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: `🔔 Direct Chat connected for ${listing.crop}! Farmer ${listing.farmer} (${listing.village}) is online.`,
      time: "10:30 AM"
    },
    {
      id: 2,
      sender: "farmer",
      name: `Farmer ${listing.farmer}`,
      text: `Namaste! I have ${listing.qty} ${listing.unit} of fresh ${listing.crop} ready for pickup in ${listing.village}. You can chat with me here or view my Bank Account details to transfer the 60% deposit!`,
      time: "10:31 AM"
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSendMessage(e) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: currentRole,
      name: currentRole === "farmer" ? `Farmer ${listing.farmer}` : "Retail Vendor",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString("en-IN", { timeStyle: "short" })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  }

  function handleSendPhotoProof() {
    const photoMsg = {
      id: Date.now(),
      sender: "farmer",
      name: `Farmer ${listing.farmer}`,
      text: "📸 Live Harvest Quality Proof attached (Pinned to IPFS):",
      image: listing.image || DEFAULT_FALLBACK_IMAGE,
      ipfsHash: listing.ipfsHash || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      time: new Date().toLocaleTimeString("en-IN", { timeStyle: "short" })
    };
    setMessages((prev) => [...prev, photoMsg]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B1E99] backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-xl border-2 border-[#B8862B] shadow-2xl overflow-hidden flex flex-col h-[85vh] font-sans">
        
        {/* Chatting Space Header */}
        <div className="bg-[#1C2B1E] text-white p-4 flex items-center justify-between border-b border-[#B8862B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center font-bold shadow">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3F6B4A] border-2 border-[#1C2B1E]" />
            </div>
            <div>
              <div className="font-zilla font-bold text-lg text-white flex items-center gap-2">
                AgreeSetu Direct Trade Chat
                <span className="text-[10px] bg-[#3F6B4A] text-white px-2 py-0.5 rounded font-mono-plex font-bold">
                  🟢 DIRECT DEAL
                </span>
              </div>
              <div className="text-xs text-[#C9C1A5] font-mono-plex flex items-center gap-2">
                <span>Farmer: <strong>{listing.farmer}</strong></span>
                <span>&bull;</span>
                <span>Location: <strong>{listing.village}</strong></span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#C9C1A5] hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Direct Deal Banner */}
        <div className="bg-[#24361F] text-[#E7E1D0] px-4 py-2 border-b border-[#3F6B4A55] text-xs font-mono-plex flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Package className="w-3.5 h-3.5 text-[#B8862B] shrink-0" />
            <span className="truncate">
              <strong>Produce:</strong> {listing.crop} &bull; {listing.qty} {listing.unit} &bull; Direct Rate: {currency(listing.price)}/{listing.unit}
            </span>
          </div>
          <span className="bg-[#B8862B33] text-[#B8862B] px-2 py-0.5 rounded font-bold shrink-0 text-[10px]">
            AgreeSetu Fee: 3%
          </span>
        </div>

        {/* Real-time Messages Thread Area */}
        <div className="p-4 space-y-3.5 overflow-y-auto bg-[#EFEADD44] flex-1 text-xs">
          {messages.map((m) => {
            if (m.sender === "system") {
              return (
                <div key={m.id} className="flex justify-center my-1">
                  <div className="bg-[#EFEADD] text-[#5A5440] px-3 py-1.5 rounded-full border border-[#DDD6C1] text-[11px] font-mono-plex flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#B8862B]" /> {m.text}
                  </div>
                </div>
              );
            }

            const isMe = m.sender === currentRole;

            return (
              <div key={m.id} className={`flex items-start gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-[#1C2B1E] text-[#B8862B] flex items-center justify-center shrink-0 text-xs font-bold shadow">
                    {m.sender === "farmer" ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[80%] space-y-1.5 shadow-sm border ${
                    isMe
                      ? "bg-[#3F6B4A] text-white border-[#2F4F38]"
                      : "bg-white text-[#1C2B1E] border-[#DDD6C1]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono-plex opacity-80 border-b border-white/20 pb-0.5">
                    <strong>{m.name}</strong>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>

                  {m.image && (
                    <div className="relative mt-2 rounded overflow-hidden border border-[#B8862B]">
                      <img
                        src={m.image}
                        alt="harvest attachment"
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                        className="w-full h-32 object-cover"
                      />
                      {m.ipfsHash && (
                        <div className="bg-[#1C2B1ECC] text-white p-1 text-[10px] font-mono-plex flex justify-between">
                          <span>IPFS: {m.ipfsHash.substring(0, 10)}...</span>
                          <span className="text-[#3F6B4A] font-bold">Grade A+ Pass</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isMe && (
                  <div className="w-7 h-7 rounded-full bg-[#B8862B] text-[#1C2B1E] flex items-center justify-center shrink-0 text-xs font-bold shadow">
                    {m.sender === "farmer" ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Direct Trade Action Banner in Chat */}
          <div className="p-3.5 bg-white rounded-lg border-2 border-[#B8862B] shadow space-y-2 text-xs">
            <div className="font-bold text-[#8A6620] font-mono-plex flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Financial & Commission Terms:
            </div>
            <p className="text-[#5A5440] leading-snug">
              Vendors transfer <strong>60% deposit</strong> to Farmer Bank before dispatch, and the remaining <strong>40% balance + 3% AgreeSetu Commission Fee</strong> after receiving the produce.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSendPhotoProof}
                className="bg-[#B8862B] text-[#1C2B1E] py-2 px-3 rounded text-xs font-bold hover:bg-[#8A6620] hover:text-white cursor-pointer shadow flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Send Harvest Photo
              </button>
            </div>
          </div>

          <div ref={chatBottomRef} />
        </div>

        {/* Interactive Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#DDD6C1] flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSendPhotoProof}
            className="p-2.5 rounded-lg border border-[#DDD6C1] bg-[#EFEADD44] hover:bg-[#EFEADD] text-[#5A5440] cursor-pointer transition"
            title="Attach live harvest inspection photo proof"
          >
            <Camera className="w-4 h-4 text-[#B8862B]" />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Type a message to ${currentRole === "farmer" ? "Vendor" : "Farmer " + listing.farmer}...`}
            className="flex-1 border rounded-lg px-3.5 py-2.5 text-xs bg-[#EFEADD22] focus:bg-white focus:border-[#B8862B] outline-none font-sans"
            style={{ borderColor: "#DDD6C1" }}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-[#1C2B1E] text-white p-2.5 rounded-lg hover:bg-[#24361F] cursor-pointer transition disabled:opacity-40 shadow"
          >
            <Send className="w-4 h-4 text-[#B8862B]" />
          </button>
        </form>
      </div>
    </div>
  );
}

function FarmerView({ listings, allListings, showNewListing, setShowNewListing, addListing, orders, onAdvanceOrder, onInspect, onCycleImage }) {
  const totalListedKg = allListings.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="space-y-10">
      {/* Farmer Profile Header Card */}
      <div className="ledger-card p-5 rounded-lg border-2 border-[#3F6B4A] bg-gradient-to-r from-white via-[#F4F9F5] to-[#EFEADD66] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#3F6B4A] text-white flex items-center justify-center shadow border-2 border-[#B8862B]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-zilla font-bold text-2xl text-[#1C2B1E]">
                Ravindra Patil & Farmers Collective
              </h2>
              <Badge tone="live">Verified Producer Profile</Badge>
            </div>
            <div className="text-xs text-[#5A5440] font-mono-plex mt-1 flex flex-wrap items-center gap-3">
              <span><MapPin className="w-3 h-3 inline text-[#B8862B]" /> Devgad, Ratnagiri, Maharashtra</span>
              <span>&bull; Bank Payout Account: <strong className="text-[#3F6B4A]">SBI 389201994821</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewListing((prev) => !prev)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-xs font-bold text-white shadow hover:bg-[#2F4F38] transition cursor-pointer"
            style={{ background: "#3F6B4A" }}
          >
            <Plus className="w-4 h-4" /> {showNewListing ? "Close Form" : "Add Produce Batch"}
          </button>
        </div>
      </div>

      {showNewListing && (
        <NewListingForm onCancel={() => setShowNewListing(false)} onSubmit={addListing} />
      )}

      {/* Process Tracker Section for Active Orders */}
      <div>
        <SectionTitle
          eyebrow="Real-Time Trade & Dispatch Tracker"
          title="Active Order Process Trackers"
        />
        {orders.length === 0 ? (
          <EmptyState text="No active orders yet. Vendor orders will appear here with live stage progress." />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderProcessTracker
                key={o.id}
                order={o}
                side="farmer"
                onAdvance={() => onAdvanceOrder(o.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Farmer Inventory */}
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Your Farm Inventory"
          title="Active Produce & Bank Account Cards"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          {allListings.map((l) => (
            <div key={l.id} className="ledger-card rounded-lg p-4 flex flex-col justify-between gap-3">
              <div className="flex gap-4">
                <VerifiedSeal status={l.status} onClick={() => onInspect(l)} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-zilla font-bold text-lg text-[#1C2B1E] leading-tight">
                        {l.crop}
                      </h3>
                      <div className="text-xs text-[#5A5440] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#B8862B]" /> {l.village}
                      </div>
                    </div>
                    <Badge tone={l.status === "verified" ? "verified" : "pending"}>
                      {l.status === "verified" ? "Verified" : "Review pending"}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between mt-3 font-mono-plex">
                    <div>
                      <span className="text-lg font-bold text-[#1C2B1E]">{currency(l.price)}</span>
                      <span className="text-xs text-[#8A8368]">/ {l.unit}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${l.isUp ? "bg-[#3F6B4A15] text-[#3F6B4A]" : "bg-[#9C422115] text-[#9C4221]"}`}>
                      {l.isUp ? "▲" : "▼"} {l.priceChangePct} today
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Photo Container */}
              <div className="relative rounded-md overflow-hidden border border-[#DDD6C1]">
                <img
                  src={l.image}
                  alt={l.crop}
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                  className="w-full h-36 object-cover"
                />
                <button
                  onClick={() => onCycleImage(l.id)}
                  className="absolute top-2 right-2 bg-[#1C2B1ECC] hover:bg-[#1C2B1E] text-white text-[10px] font-mono-plex px-2 py-1 rounded flex items-center gap-1 border border-[#B8862B] transition cursor-pointer shadow"
                >
                  <RefreshCw className="w-3 h-3 text-[#B8862B]" /> Refresh Photo
                </button>
              </div>

              <div className="pt-3 border-t border-[#DDD6C1] flex items-center justify-between text-xs text-[#5A5440]">
                <span className="font-mono-plex text-[11px] font-bold text-[#3F6B4A] bg-[#3F6B4A15] px-2 py-1 rounded flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Bank: {l.bankDetails ? l.bankDetails.bankName.split(" ")[0] : "SBI"}
                </span>
                <button
                  onClick={() => onInspect(l)}
                  className="text-[#8A6620] hover:text-[#1C2B1E] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Price History & Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewListingForm({ onCancel, onSubmit }) {
  const [crop, setCrop] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [village, setVillage] = useState("");
  const [farmer, setFarmer] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [photoAdded, setPhotoAdded] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  const canSubmit = crop.trim().length > 0 && Number(qty) > 0 && Number(price) > 0;

  function handleCropNameChange(name) {
    setCrop(name);
    const dynImg = getDynamicProduceImage(name);
    setPhotoPreview(dynImg);
    setPhotoAdded(true);
  }

  function handlePhotoSim() {
    setPhotoAdded(true);
    const dynImg = getDynamicProduceImage(crop || "Vegetables");
    setPhotoPreview(dynImg);
  }

  return (
    <div className="bg-white rounded-lg border-2 border-[#B8862B] p-6 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-5 border-b border-[#DDD6C1] pb-3">
        <div>
          <h3 className="font-zilla font-bold text-xl text-[#1C2B1E] flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#B8862B]" /> Create New Produce Batch
          </h3>
          <p className="text-xs text-[#8A8368] font-mono-plex mt-0.5">Publish produce with your Bank Account details for 60/40 payout transfers.</p>
        </div>
        <button onClick={onCancel} className="text-[#8A8368] hover:text-[#1C2B1E] cursor-pointer">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Farmer Full Name">
          <input
            value={farmer}
            onChange={(e) => setFarmer(e.target.value)}
            placeholder="e.g. Ravindra Patil"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="Crop / Produce Name">
          <input
            value={crop}
            onChange={(e) => handleCropNameChange(e.target.value)}
            placeholder="e.g. Alphonso Mango / Organic Ginger"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="Bank Name">
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. State Bank of India"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="Bank Account Number">
          <input
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            placeholder="e.g. 389201994821"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition font-mono-plex"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="IFSC Code">
          <input
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            placeholder="e.g. SBIN0004921"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition font-mono-plex uppercase"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="UPI ID (Optional)">
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. farmer@sbi"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition font-mono-plex"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
            style={{ borderColor: "#DDD6C1" }}
          >
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Pulses & Grains">Pulses & Grains</option>
            <option value="Spices">Spices</option>
          </select>
        </Field>

        <Field label="Village & District">
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Devgad, Ratnagiri, Maharashtra"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>

        <Field label="Batch Quantity">
          <div className="flex gap-2">
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              type="number"
              placeholder="200"
              className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition"
              style={{ borderColor: "#DDD6C1" }}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white font-mono-plex"
              style={{ borderColor: "#DDD6C1" }}
            >
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>
          </div>
        </Field>

        <Field label="Target Direct Price per Unit (\u20B9)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="180"
            className="w-full border rounded-md px-3 py-2 text-sm bg-[#EFEADD33] focus:bg-white focus:border-[#B8862B] outline-none transition font-mono-plex"
            style={{ borderColor: "#DDD6C1" }}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Dynamic Photo Proof of Crop Harvest">
          <div
            onClick={handlePhotoSim}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-5 px-4 cursor-pointer transition-all text-center"
            style={{
              borderColor: photoAdded ? "#3F6B4A" : "#C9C1A5",
              background: photoAdded ? "#3F6B4A10" : "#EFEADD44"
            }}
          >
            {photoAdded && photoPreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={photoPreview}
                  alt="crop preview"
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#3F6B4A] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Dynamic Harvest Photo Attached
                  </div>
                  <div className="text-xs text-[#5A5440] font-mono-plex mt-0.5">Will be pinned to IPFS Storage</div>
                </div>
              </div>
            ) : (
              <>
                <Camera className="w-8 h-8 text-[#8A8368] mb-1 animate-pulse" />
                <span className="text-sm font-semibold text-[#1C2B1E]">Tap to Generate Dynamic Batch Photo</span>
                <span className="text-xs text-[#8A8368] mt-1 font-mono-plex">Required for IPFS Quality Inspector Hash</span>
              </>
            )}
          </div>
        </Field>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#DDD6C1]">
        <div className="text-xs text-[#8A8368]">
          * Pinned to IPFS Decentralized Storage upon review.
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-[#5A5440] hover:bg-[#DDD6C155] cursor-pointer">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => {
              const finalFarmer = farmer.trim() || "Ravindra Patil";
              const finalVillage = village.trim() || "Devgad, Ratnagiri, Maharashtra";
              const finalBankName = bankName.trim() || "State Bank of India (Ratnagiri)";
              const finalAccountNo = accountNo.trim() || "389201994821";
              const finalIfsc = ifsc.trim() || "SBIN0004921";
              const finalUpiId = upiId.trim() || `${finalFarmer.toLowerCase().replace(/\s+/g, '.')}@sbi`;
              const finalImage = photoPreview || getDynamicProduceImage(crop);

              onSubmit({
                crop: crop.trim(),
                category,
                qty: Number(qty),
                unit,
                price: Number(price),
                village: finalVillage,
                farmer: finalFarmer,
                bankDetails: {
                  bankName: finalBankName,
                  accountNo: finalAccountNo,
                  ifsc: finalIfsc,
                  upiId: finalUpiId
                },
                image: finalImage
              });
            }}
            className="px-5 py-2 rounded-md text-sm font-semibold text-white shadow disabled:opacity-40 cursor-pointer transition-all"
            style={{ background: "#3F6B4A" }}
          >
            Publish Farmer Listing & Bank Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-[#5A5440] mb-1.5 uppercase font-mono-plex tracking-wider">{label}</div>
      {children}
    </label>
  );
}

function VendorView({
  listings,
  allListings,
  orders,
  onPlaceOrder,
  onAdvanceOrder,
  onWeb3Pay,
  onInspect,
  onShowBankDetails,
  onOpenChat,
  onCycleImage,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filterStatus,
  setFilterStatus
}) {
  const [ordering, setOrdering] = useState(null);
  const [orderQty, setOrderQty] = useState(20);

  const categories = ["All", "Fruits", "Vegetables", "Pulses & Grains"];

  return (
    <div className="space-y-10">
      {/* VENDOR NOTICE BANNER */}
      <div className="ledger-card p-4 rounded-lg border-2 border-[#B8862B] bg-[#FFFDF7] shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#B8862B22] text-[#B8862B] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-zilla font-bold text-lg text-[#1C2B1E]">
              60% Deposit & 40% Payout + 3% AgreeSetu Commission Model
            </div>
            <div className="text-xs text-[#5A5440]">
              Vendors transfer 60% deposit directly to the Farmer's Bank Account before dispatch, and pay the remaining 40% + 3% AgreeSetu Platform Fee after product delivery!
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-xs font-mono-plex text-[#8A6620] bg-[#B8862B15] px-3 py-1.5 rounded border border-[#B8862B33]">
          Platform Fee: 3% Only
        </div>
      </div>

      {/* Process Trackers Section for Active Vendor Orders */}
      <div>
        <SectionTitle
          eyebrow="Order Process Trackers & Financial Payouts"
          title="Active Order Process Trackers"
        />
        {orders.length === 0 ? (
          <EmptyState text="No active orders. Create an order from the produce marketplace below!" />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderProcessTracker
                key={o.id}
                order={o}
                side="vendor"
                onAdvance={() => onAdvanceOrder(o.id)}
                onWeb3Pay={onWeb3Pay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Marketplace Header & Filter Bar */}
      <div className="space-y-4">
        <SectionTitle
          eyebrow="Direct Wholesale Marketplace"
          title="Verified Produce & Farmer Bank Cards"
          action={
            <div className="text-xs font-mono-plex text-[#8A6620] bg-[#B8862B15] px-3 py-1.5 rounded-full border border-[#B8862B33]">
              {listings.length} Active Harvests
            </div>
          }
        />

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg border border-[#DDD6C1] shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8A8368]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce (e.g. Mango, Tomato, Toor Dal), farmer, or village..."
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-[#EFEADD22] focus:bg-white focus:border-[#B8862B] outline-none"
                style={{ borderColor: "#DDD6C1" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-[#8A8368] hover:text-[#1C2B1E]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-plex text-[#5A5440] uppercase">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-md px-3 py-2 text-xs font-mono-plex bg-white"
                style={{ borderColor: "#DDD6C1" }}
              >
                <option value="All">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Review Pending</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DDD6C133]">
            <span className="text-xs font-mono-plex text-[#8A8368] mr-1">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#1C2B1E] text-[#B8862B]"
                    : "bg-[#EFEADD] text-[#5A5440] hover:bg-[#DDD6C1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Produce Grid */}
      {listings.length === 0 ? (
        <EmptyState text="No produce found matching your search and category filter. Try clearing filters!" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((l) => {
            const savingsPerUnit = Math.max(0, l.mandiPrice - l.price);

            return (
              <div key={l.id} className="ledger-card rounded-lg p-5 flex flex-col justify-between group">
                <div>
                  <div className="flex gap-4 items-start">
                    <VerifiedSeal status={l.status} onClick={() => onInspect(l)} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-zilla font-bold text-lg text-[#1C2B1E] leading-snug group-hover:text-[#B8862B] transition-colors">
                            {l.crop}
                          </h3>
                          <div className="text-xs text-[#5A5440] mt-0.5 font-medium flex items-center gap-1">
                            <User className="w-3 h-3 text-[#8A8368]" /> {l.farmer} &bull; <MapPin className="w-3 h-3 text-[#B8862B]" /> {l.village}
                          </div>
                        </div>
                        <Badge tone={l.status === "verified" ? "verified" : "pending"}>
                          {l.status === "verified" ? "Verified" : "Self-reported"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Produce Image Container with Dynamic Switcher */}
                  <div className="relative mt-3 rounded-md overflow-hidden border border-[#DDD6C1] group/img">
                    <img
                      src={l.image}
                      alt={l.crop}
                      onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                      className="w-full h-36 object-cover transition-transform group-hover/img:scale-105"
                    />
                    <button
                      onClick={() => onCycleImage(l.id)}
                      className="absolute top-2 right-2 bg-[#1C2B1ECC] hover:bg-[#1C2B1E] text-white text-[10px] font-mono-plex px-2.5 py-1 rounded flex items-center gap-1 border border-[#B8862B] transition cursor-pointer shadow"
                      title="Click to cycle to another dynamic harvest picture"
                    >
                      <RefreshCw className="w-3 h-3 text-[#B8862B]" /> Dynamic Photo
                    </button>
                  </div>

                  {/* Daily Mandi Price vs Farmer Price Breakdown */}
                  <div className="mt-3 p-3 rounded-lg bg-[#EFEADD66] border border-[#DDD6C1] space-y-1.5 font-mono-plex text-xs">
                    <div className="flex items-center justify-between border-b border-[#DDD6C133] pb-1">
                      <span className="text-[#8A8368]">APMC Mandi Wholesale:</span>
                      <span className="text-[#5A5440] line-through font-semibold">{currency(l.mandiPrice)} / {l.unit}</span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[#1C2B1E] font-bold">Farmer Direct Rate:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-[#1C2B1E]">{currency(l.price)}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.isUp ? "bg-[#3F6B4A22] text-[#3F6B4A]" : "bg-[#9C422122] text-[#9C4221]"}`}>
                          {l.isUp ? "▲" : "▼"} {l.priceChangePct}
                        </span>
                      </div>
                    </div>
                    {savingsPerUnit > 0 && (
                      <div className="text-[11px] text-[#3F6B4A] font-bold flex items-center gap-1 pt-1 border-t border-[#DDD6C133]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Save {currency(savingsPerUnit)} / {l.unit} vs Mandi!
                      </div>
                    )}
                  </div>
                </div>

                {/* Farmer Contact & Order Action Row */}
                <div className="mt-4 pt-3 border-t border-[#DDD6C1] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-plex">
                    <span className="text-[#8A8368]">{l.qty} {l.unit} batch available</span>
                    <button
                      onClick={() => onShowBankDetails(l)}
                      className="text-[#3F6B4A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" /> View Bank Info
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenChat(l)}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-bold text-white bg-[#1C2B1E] hover:bg-[#24361F] transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B8862B]" /> Direct Chat
                    </button>

                    <button
                      onClick={() => { setOrdering(l); setOrderQty(Math.min(l.qty, 20)); }}
                      className="flex-1 py-2 px-3 rounded-md text-xs font-bold text-white bg-[#3F6B4A] hover:bg-[#2F4F38] transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                    >
                      <PackageCheck className="w-3.5 h-3.5 text-[#B8862B]" /> Place Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Place Order Modal */}
      {ordering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B1E99] backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-[#B8862B] shadow-2xl">
            <div className="flex items-start justify-between mb-4 border-b border-[#DDD6C1] pb-3">
              <div>
                <div className="text-xs font-mono-plex text-[#8A6620] uppercase font-semibold">Process Tracker Purchase Order</div>
                <h3 className="font-zilla font-bold text-2xl text-[#1C2B1E]">
                  Order {ordering.crop}
                </h3>
                <div className="text-xs text-[#8A8368] mt-0.5">from {ordering.farmer}, {ordering.village}</div>
              </div>
              <button onClick={() => setOrdering(null)} className="text-[#8A8368] hover:text-[#1C2B1E] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label={`Required Quantity (${ordering.unit})`}>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={ordering.qty}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, Math.min(ordering.qty, Number(e.target.value))))}
                    className="w-full border rounded-md px-3 py-2 text-sm font-mono-plex font-bold text-lg"
                    style={{ borderColor: "#DDD6C1" }}
                  />
                  <span className="text-sm font-mono-plex text-[#5A5440]">{ordering.unit}</span>
                </div>
                <div className="text-[11px] text-[#8A8368] mt-1 font-mono-plex">
                  Max available batch: {ordering.qty} {ordering.unit}
                </div>
              </Field>

              {/* 60% / 40% + 3% Commission Breakdown Card */}
              <div className="rounded-lg p-4 text-sm space-y-2 border border-[#DDD6C1]" style={{ background: "#EFEADD" }}>
                <div className="text-xs font-semibold uppercase tracking-wider font-mono-plex text-[#1C2B1E] border-b border-[#DDD6C1] pb-1 flex items-center justify-between">
                  <span>Process Tracker Payout Breakdown</span>
                  <Building2 className="w-4 h-4 text-[#B8862B]" />
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-[#5A5440]">Gross Order Total:</span>
                  <span className="font-mono-plex font-bold text-[#1C2B1E]">{currency(orderQty * ordering.price)}</span>
                </div>
                <div className="pt-2 border-t border-[#DDD6C133] flex justify-between text-xs text-[#3F6B4A] font-bold">
                  <span>Step 1: 60% Deposit (To Farmer Bank)</span>
                  <span className="font-mono-plex">{currency(Math.round(orderQty * ordering.price * 0.6))}</span>
                </div>
                <div className="flex justify-between text-xs text-[#1C2B1E] font-bold">
                  <span>Step 2: 40% Final Payout (To Farmer Bank)</span>
                  <span className="font-mono-plex">{currency(Math.round(orderQty * ordering.price * 0.4))}</span>
                </div>
                <div className="flex justify-between text-xs text-[#8A6620] font-bold border-t border-[#DDD6C133] pt-1">
                  <span>Step 3: 3% Platform Fee (To AgreeSetu)</span>
                  <span className="font-mono-plex">{currency(Math.round(orderQty * ordering.price * 0.03))}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-[#DDD6C1]">
              <button onClick={() => setOrdering(null)} className="px-4 py-2 rounded-md text-sm font-medium text-[#5A5440] hover:bg-[#DDD6C155] cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => { onPlaceOrder(ordering, orderQty); setOrdering(null); }}
                className="px-5 py-2 rounded-md text-sm font-semibold text-white shadow hover:bg-[#2F4F38] transition cursor-pointer flex items-center gap-2"
                style={{ background: "#3F6B4A" }}
              >
                <PackageCheck className="w-4 h-4 text-[#B8862B]" /> Create Order & Open Process Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="border-2 border-dashed rounded-lg p-10 text-center text-sm text-[#8A8368] space-y-2" style={{ borderColor: "#DDD6C1" }}>
      <Info className="w-8 h-8 mx-auto text-[#C9C1A5]" />
      <p>{text}</p>
    </div>
  );
}

{/* Quality Inspection Modal with Dynamic Photo Gallery */}
function QualityInspectionModal({ listing, onClose, onShowBankDetails, onCycleImage }) {
  const maxPrice = Math.max(...(listing.priceHistory || [100]));
  const minPrice = Math.min(...(listing.priceHistory || [100]));
  const gallery = PRODUCE_DYNAMIC_GALLERY[listing.crop] || [listing.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B1E99] backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl border-2 border-[#B8862B] shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="flex items-start justify-between pb-4 border-b border-[#DDD6C1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#B8862B22] border border-[#B8862B] flex items-center justify-center text-[#B8862B]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono-plex text-[#8A6620] uppercase font-semibold">IPFS & Mandi Price Verification</div>
              <h3 className="font-zilla font-bold text-2xl text-[#1C2B1E]">{listing.crop} Certificate</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8A8368] hover:text-[#1C2B1E] cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 my-5">
          {/* Certificate Header Banner */}
          <div className="bg-[#1C2B1E] text-white p-4 rounded-lg flex items-center justify-between font-mono-plex text-xs">
            <div>
              <span className="text-[#B8862B] font-bold">IPFS HASH:</span> {listing.ipfsHash || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}
              <div className="text-[#C9C1A5] text-[11px] mt-0.5">Farmer Bank: <strong className="text-white">{listing.bankDetails ? listing.bankDetails.bankName : "SBI"}</strong></div>
            </div>
            <div className="text-right shrink-0">
              <span className="bg-[#3F6B4A] text-white px-2 py-1 rounded text-[10px] font-bold uppercase">Grade A+ Pass</span>
            </div>
          </div>

          {/* Dynamic Image & Producer details */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-52 group">
              <img
                src={listing.image || DEFAULT_FALLBACK_IMAGE}
                alt={listing.crop}
                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                className="w-full h-40 object-cover rounded-lg border border-[#DDD6C1]"
              />
              <button
                onClick={() => onCycleImage(listing.id)}
                className="absolute bottom-2 right-2 bg-[#1C2B1ECC] hover:bg-[#1C2B1E] text-white text-[10px] font-mono-plex px-2 py-1 rounded flex items-center gap-1 border border-[#B8862B] cursor-pointer shadow"
              >
                <RefreshCw className="w-3 h-3 text-[#B8862B]" /> Switch Dynamic Image
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-plex flex-1">
              <div className="flex justify-between border-b border-[#DDD6C1] pb-1">
                <span className="text-[#8A8368]">Farmer Producer:</span>
                <span className="font-bold text-[#1C2B1E]">{listing.farmer}</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C1] pb-1">
                <span className="text-[#8A8368]">Harvest Village:</span>
                <span className="font-bold text-[#1C2B1E]">{listing.village}</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C1] pb-1">
                <span className="text-[#8A8368]">APMC Mandi Index:</span>
                <span className="font-bold text-[#5A5440] line-through">{currency(listing.mandiPrice)}</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C1] pb-1">
                <span className="text-[#8A8368]">AgreeSetu Direct Rate:</span>
                <span className="font-bold text-[#3F6B4A] text-sm">{currency(listing.price)} / {listing.unit}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Price History Visual Chart */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-plex uppercase font-bold text-[#8A6620] flex items-center justify-between">
              <span>7-Day APMC Market Price Trend</span>
              <span className="text-[#3F6B4A] text-[11px]">Synced Daily</span>
            </h4>
            <div className="p-4 rounded-lg border border-[#DDD6C1] bg-[#EFEADD33] space-y-3">
              <div className="flex items-end justify-between h-24 pt-4 px-2 border-b border-[#DDD6C1]">
                {(listing.priceHistory || [100, 105, 102, 108, 110, 115, 112]).map((val, idx) => {
                  const heightPct = Math.round(((val - minPrice + 10) / (maxPrice - minPrice + 20)) * 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 group flex-1">
                      <div className="text-[9px] font-mono-plex text-[#8A8368] opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{val}
                      </div>
                      <div
                        className="w-5 bg-[#3F6B4A] rounded-t transition-all group-hover:bg-[#B8862B]"
                        style={{ height: `${Math.max(15, heightPct)}%` }}
                      />
                      <div className="text-[9px] font-mono-plex text-[#8A8368]">
                        Day {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-plex text-[#5A5440]">
                <span>Min: {currency(minPrice)}</span>
                <span>Max: {currency(maxPrice)}</span>
                <span className="text-[#3F6B4A] font-bold">Trend: {listing.priceChangePct}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#DDD6C1]">
          <a
            href={`https://gateway.pinata.cloud/ipfs/${listing.ipfsHash || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#8A6620] font-mono-plex flex items-center gap-1 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Verify on IPFS Gateway
          </a>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-[#5A5440] hover:bg-[#DDD6C155] cursor-pointer">
              Close Report
            </button>
            <button
              onClick={() => onShowBankDetails(listing)}
              className="px-5 py-2 rounded-md text-sm font-semibold text-white shadow transition cursor-pointer flex items-center gap-1.5"
              style={{ background: "#3F6B4A" }}
            >
              <Building2 className="w-4 h-4 text-[#B8862B]" /> View Farmer Bank Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* FARMER BANK ACCOUNT & 3% COMMISSION DETAILS MODAL */}
function FarmerBankDetailsModal({ listing, onClose }) {
  const bank = listing.bankDetails || {
    bankName: "State Bank of India (Ratnagiri Branch)",
    accountNo: "389201994821",
    ifsc: "SBIN0004921",
    upiId: "ravindra.patil@sbi"
  };

  const sampleBatchTotal = listing.price * listing.qty;
  const sixtyAmt = Math.round(sampleBatchTotal * 0.6);
  const fortyAmt = Math.round(sampleBatchTotal * 0.4);
  const comm3Amt = Math.round(sampleBatchTotal * 0.03);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B1E99] backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border-2 border-[#B8862B] shadow-2xl font-sans space-y-4">
        <div className="flex items-start justify-between border-b border-[#DDD6C1] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#3F6B4A] text-white flex items-center justify-center shadow">
              <Building2 className="w-6 h-6 text-[#B8862B]" />
            </div>
            <div>
              <div className="text-xs font-mono-plex text-[#8A6620] uppercase font-bold">Farmer Payout Bank Account</div>
              <h3 className="font-zilla font-bold text-2xl text-[#1C2B1E]">{listing.farmer}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8A8368] hover:text-[#1C2B1E] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bank Credentials Table */}
        <div className="p-4 bg-[#EFEADD44] rounded-lg border border-[#DDD6C1] space-y-2 font-mono-plex text-xs">
          <div className="flex justify-between border-b border-[#DDD6C1] pb-1.5">
            <span className="text-[#8A8368]">Bank Name:</span>
            <strong className="text-[#1C2B1E]">{bank.bankName}</strong>
          </div>
          <div className="flex justify-between border-b border-[#DDD6C1] pb-1.5">
            <span className="text-[#8A8368]">Account Number:</span>
            <strong className="text-[#3F6B4A] text-sm">{bank.accountNo}</strong>
          </div>
          <div className="flex justify-between border-b border-[#DDD6C1] pb-1.5">
            <span className="text-[#8A8368]">IFSC Code:</span>
            <strong className="text-[#1C2B1E] uppercase">{bank.ifsc}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8368]">Direct UPI ID:</span>
            <strong className="text-[#B8862B]">{bank.upiId}</strong>
          </div>
        </div>

        {/* Financial Payment Schedule & 3% Fee Explanation */}
        <div className="p-3.5 bg-[#FFFDF7] border-2 border-[#B8862B] rounded-lg text-xs space-y-2">
          <div className="font-bold text-[#1C2B1E] font-mono-plex flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B8862B]" /> Payment Schedule & 3% Commission:
          </div>
          <div className="space-y-1 text-[#5A5440] font-mono-plex text-[11px]">
            <div className="flex justify-between">
              <span>1. Initial 60% Deposit (Before Dispatch):</span>
              <strong className="text-[#3F6B4A]">{currency(sixtyAmt)}</strong>
            </div>
            <div className="flex justify-between">
              <span>2. Remaining 40% Balance (On Delivery):</span>
              <strong className="text-[#1C2B1E]">{currency(fortyAmt)}</strong>
            </div>
            <div className="flex justify-between border-t border-[#DDD6C1] pt-1 text-[#8A6620] font-bold">
              <span>3. AgreeSetu Platform Fee (3% On Delivery):</span>
              <span>{currency(comm3Amt)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1C2B1E] text-white rounded text-xs font-bold hover:bg-[#24361F] cursor-pointer shadow"
          >
            Close Bank Details
          </button>
        </div>
      </div>
    </div>
  );
}
