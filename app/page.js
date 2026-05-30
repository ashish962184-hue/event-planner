'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  Sparkles, Calendar, Users, DollarSign, Send, MessageSquare, Phone, 
  MapPin, Mail, ChevronDown, Check, Menu, X, ArrowRight, Calculator,
  Award, Clock, Star, Heart, Volume2, ShieldCheck, Gift, ArrowUpRight
} from 'lucide-react';

// Premium distinct, high-res imagery for 18+ unique non-repeating luxury events
const IMAGES = {
  heroVideo: "https://assets.mixkit.co/videos/preview/mixkit-glittering-bokeh-lights-background-loop-4286-large.mp4",
  before: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=1200",
  after: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=1200",
  testimonials: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  ],
  blog: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600"
  ]
};

const PARTNERS = ["Ritz-Carlton", "Four Seasons", "Taj Hotels", "Grand Palace", "Vogue Events", "Tiffany & Co."];

// Expanded non-repeating database of 18 unique luxury events (3 per major category)
const ALL_EVENTS = [
  // Birthdays
  { id: 1, category: "Birthdays", title: "Royal Golden 50th Banquet", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800", desc: "A bespoke golden canopy setup at The Ritz-Carlton featuring 5000+ custom balloon sets and premium tablescapes." },
  { id: 2, category: "Birthdays", title: "Elite Sweet Sixteen Neon Rave", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800", desc: "Futuristic glowing tunnels, LED wall configurations, and premium neon balloon installations." },
  { id: 3, category: "Birthdays", title: "Classy Midnight & Silver Gala", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800", desc: "A sophisticated black-tie dinner with silver metallic structures, crystal chandeliers, and customized name favors." },

  // Weddings & Engagements
  { id: 4, category: "Weddings", title: "Ethereal Floral Canopy Mandap", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800", desc: "A premium floral dome wedding setup featuring 10,000 fresh white roses and delicate glass chandeliers." },
  { id: 5, category: "Weddings", title: "Waterfront Glasshouse Vows", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800", desc: "Minimalist geometric framing, hanging fairy light ceilings, and an immersive lakeside stage setup." },
  { id: 6, category: "Weddings", title: "Palace Archway Royal Engagement", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", desc: "Traditional elements combined with modern brass frameworks, exquisite marigolds, and deep velvet seats." },

  // Baby Showers
  { id: 7, category: "Baby Showers", title: "Ethereal Pastel Clouds & Teddy", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", desc: "Drifting pastel cloud formations, hot air balloon centerpieces, and warm glowing neon backdrops." },
  { id: 8, category: "Baby Showers", title: "Botanical Bloom Garden Tea", image: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=80&w=800", desc: "An organic rustic garden layout complete with hand-woven foliage, ivory details, and botanical mocktail booths." },
  { id: 9, category: "Baby Showers", title: "Under the Stars Twinkle Shower", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800", desc: "Deep blue velvet backdrops, warm hanging star lights, and sparkling metallic silver accents." },

  // Corporate Events
  { id: 10, category: "Corporate Events", title: "Annual Elite Leadership Gala", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", desc: "Corporate brand colors masterfully integrated into sleek geometric layouts, premium seating, and accent downlighting." },
  { id: 11, category: "Corporate Events", title: "Silicon Valley Tech Summit Lounge", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", desc: "Ultra-modern lounge pods, integrated tablet controls, premium abstract metal backdrops, and laser arrays." },
  { id: 12, category: "Corporate Events", title: "Luxe Yacht Product Unveiling", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800", desc: "High-end nautical branding, premium custom deck canopies, crystal structures, and custom drone show launches." },

  // Theme Decorations
  { id: 13, category: "Theme Decorations", title: "Chrome Organic Balloon Forest", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800", desc: "Massive scale custom organic balloons with metallic chrome gold, rosegold, and matte sand layers." },
  { id: 14, category: "Theme Decorations", title: "Enchanted Rose Glass Walkway", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=800", desc: "Mirror floors reflecting hanging floral ceiling gardens, delicate warm fairy bulbs, and signature crystal vases." },
  { id: 15, category: "Theme Decorations", title: "Cyberpunk Glitch Stage Setup", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", desc: "Neon wire meshes, geometric light fixtures, and a state-of-the-art interactive motion backdrop." },

  // Surprise Events
  { id: 16, category: "Surprise Events", title: "Rooftop Candlelit Proposal Hyderabad", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800", desc: "1000+ natural candles, custom rose petal pathways, and an ivory string quartet background setup." },
  { id: 17, category: "Surprise Events", title: "Backyard Retro Movie Night surprise", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800", desc: "Cozy floor rugs, bespoke canopy framing, organic warm lanterns, and a private high-end projector canopy." },
  { id: 18, category: "Surprise Events", title: "Sunset Runway Helicopter Surprise", image: "https://images.unsplash.com/photo-1508847154043-be12a62861c1?auto=format&fit=crop&q=80&w=800", desc: "Bespoke custom message banner layout, premium champagne lounge setup, and high-society floral sprays." }
];

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const VCLogo = (props) => (
  <svg
    viewBox="0 0 100 100"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M50 5 L95 50 L50 95 L5 50 Z"
      stroke="#d4af37"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      className="opacity-75"
    />
    <path
      d="M50 12 L88 50 L50 88 L12 50 Z"
      stroke="#d4af37"
      strokeWidth="0.5"
      strokeMiterlimit="10"
      className="opacity-40"
    />
    <path
      d="M28 35 L45 70 L51 70 L57 58"
      stroke="#d4af37"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M68 38 C64 32, 52 30, 46 38 C40 46, 42 58, 48 64 C54 70, 64 68, 68 62"
      stroke="#d4af37"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M50 46 L52 50 L56 50 L53 52 L54 56 L50 53 L46 56 L47 52 L44 50 L48 50 Z"
      fill="#d4af37"
    />
  </svg>
);

// Framer Motion staggered grid variants
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 15 } 
  }
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  // Custom scroll progress
  const { scrollYProgress } = useScroll();
  const scaleXSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Floating Action Center Expansion
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  // Before/After Slider Interaction
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', eventType: '', budget: '', date: '', guests: '', requirements: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Chatbot State
  const [chatStep, setChatStep] = useState(0);
  const [chatAnswers, setChatAnswers] = useState({ type: '', budget: '', guests: '' });

  // Real-time Event Budget Calculator State
  const [calcType, setCalcType] = useState('Birthday');
  const [calcGuests, setCalcGuests] = useState(100);
  const [calcTier, setCalcTier] = useState('Gold');
  const [calcAddons, setCalcAddons] = useState({ photo: false, music: false, emcee: false });
  const [calcTotal, setCalcTotal] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  // Handle preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll shadow for Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic budget calculation with counter easing animation
  useEffect(() => {
    let basePrice = 15000;
    if (calcTier === 'Gold') basePrice = 35000;
    if (calcTier === 'Platinum') basePrice = 75000;

    let guestMultiplier = 1;
    if (calcGuests > 250) guestMultiplier = 2.2;
    else if (calcGuests > 100) guestMultiplier = 1.6;
    else if (calcGuests > 50) guestMultiplier = 1.2;

    let typeMultiplier = 1.0;
    if (calcType === 'Wedding') typeMultiplier = 1.5;
    if (calcType === 'Corporate') typeMultiplier = 1.3;

    let addonCost = 0;
    if (calcAddons.photo) addonCost += 12000;
    if (calcAddons.music) addonCost += 15000;
    if (calcAddons.emcee) addonCost += 8000;

    const total = Math.round((basePrice * guestMultiplier * typeMultiplier) + addonCost);
    setCalcTotal(total);
  }, [calcType, calcGuests, calcTier, calcAddons]);

  // Animate the displayed total number counter up/down smoothly
  useEffect(() => {
    let start = displayedTotal;
    const end = calcTotal;
    if (start === end) return;

    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / 15) : Math.floor(range / 15);
    
    const timer = setInterval(() => {
      current += increment;
      if ((end > start && current >= end) || (end < start && current <= end)) {
        clearInterval(timer);
        setDisplayedTotal(end);
      } else {
        setDisplayedTotal(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [calcTotal]);

  // Before/After Slider Mouse/Touch Handlers
  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleSliderMove(e.clientX);
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    handleSliderMove(e.touches[0].clientX);
  };

  // Form Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill in the required fields.");
      return;
    }
    setFormSubmitted(true);
  };

  // Chatbot Step Navigation
  const handleChatAnswer = (key, value) => {
    setChatAnswers(prev => ({ ...prev, [key]: value }));
    setChatStep(prev => prev + 1);
  };

  const resetChat = () => {
    setChatAnswers({ type: '', budget: '', guests: '' });
    setChatStep(0);
  };

  const filteredGallery = galleryFilter === 'All' 
    ? ALL_EVENTS 
    : ALL_EVENTS.filter(item => item.category === galleryFilter);

  // Distinct Featured Masterpieces
  const featuredMasterpieces = [
    ALL_EVENTS[0], // Royal Golden 50th Banquet (Birthdays)
    ALL_EVENTS[3], // Ethereal Floral Canopy Mandap (Weddings)
    ALL_EVENTS[6], // Ethereal Pastel Clouds (Baby Showers)
    ALL_EVENTS[9], // Annual Elite Gala (Corporate)
    ALL_EVENTS[12], // Chrome Organic Balloon Forest (Themes)
    ALL_EVENTS[15]  // Rooftop Candlelit Proposal (Surprises)
  ];

  return (
    <>
      {/* 1. PREMIUM PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b13]"
          >
            <div className="relative flex flex-col items-center">
              {/* Luxury Logo Graphic */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }}
                className="w-24 h-24 mb-6 relative"
              >
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-[#d4af37]/35 rounded-xl"
                />
                <VCLogo className="w-full h-full p-2 relative z-10" />
              </motion.div>

              <motion.h1 
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.4em", opacity: 1, transition: { delay: 0.5, duration: 1 } }}
                className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-widest"
              >
                Vivid <span className="text-[#d4af37]">Celebrations</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6, transition: { delay: 1.2 } }}
                className="text-xs text-slate-300 uppercase tracking-widest mt-2 font-light"
              >
                Bespoke Luxury Events
              </motion.p>
              
              {/* Shimmer loading bar */}
              <div className="w-48 h-[1px] bg-slate-800 mt-8 relative overflow-hidden">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX FOR MASONRY GALLERY */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxIndex(null)} 
              className="absolute top-6 right-6 text-white hover:text-[#d4af37] transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={filteredGallery[lightboxIndex].image}
              alt={filteredGallery[lightboxIndex].title}
              className="max-w-full max-h-[85vh] rounded-lg border border-[#d4af37]/30 shadow-2xl object-contain"
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold bg-slate-900/80 px-4 py-2 rounded-full border border-[#d4af37]/20">
                {filteredGallery[lightboxIndex].category}
              </span>
              <h4 className="text-xl text-white font-serif mt-3 drop-shadow-md">
                {filteredGallery[lightboxIndex].title}
              </h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PREMIUM STICKY NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glassmorphism py-4 shadow-xl' : 'bg-transparent py-6'
      }`}>
        {/* Micro-thin interactive scroll progress indicator */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] origin-left"
          style={{ scaleX: scaleXSpring }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900/80 rounded-lg p-1.5 border border-[#d4af37]/35 flex items-center justify-center shrink-0">
              <VCLogo />
            </div>
            <span className="text-xl font-serif tracking-widest text-white uppercase font-bold">
              VIVID <span className="text-[#d4af37] font-sans font-light">CELEBRATIONS</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium tracking-wider text-slate-300 hover:text-[#d4af37] transition-colors duration-300 uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Action Button */}
          <div className="hidden lg:block">
            <a 
              href="#book"
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all duration-300 transform hover:-translate-y-[2px]"
            >
              Book Event
            </a>
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#d4af37] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden glassmorphism mt-4 border-t border-[#d4af37]/20 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-slate-300 hover:text-[#d4af37] transition-colors uppercase tracking-wider py-2 border-b border-slate-800"
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 mt-4 rounded-full text-sm font-semibold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11]"
                >
                  Book Event
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. CINEMATIC HERO SECTION WITH HIGH-CONTRAST CLEAR LUXURY BACKDROP */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Crisp Clear Luxury Backdrop & Soft Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Subtle soft vignette overlay (extremely clear center) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/40 via-transparent to-[#070b13] z-10" />
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1600"
            alt="Luxury Event Backdrop"
            className="w-full h-full object-cover scale-100 opacity-90 transition-opacity duration-500"
          />

          {/* Animated Gold Glowing Orbs (Deep visual depth) */}
          <motion.div
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-[120px] z-5 pointer-events-none"
          />
          <motion.div
            animate={{
              x: [0, -80, 50, 0],
              y: [0, 50, -60, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#aa7c11]/10 blur-[100px] z-5 pointer-events-none"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full pt-12 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6 bg-slate-950/65 p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-[#d4af37]/30 text-xs font-semibold text-[#d4af37] uppercase tracking-widest"
            >
              <Award className="w-3.5 h-3.5" /> Award-Winning Luxury Event Planners
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7.5xl font-serif font-bold text-white leading-tight"
            >
              Creating <br/>
              <span className="shimmer-text">Unforgettable</span> <br/>
              Celebrations
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-slate-300 font-light max-w-xl leading-relaxed"
            >
              Luxury birthday planning, premium decorations, and bespoke experiences crafted with immaculate creativity and sophistication.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a 
                href="#book"
                className="px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] hover:shadow-xl hover:shadow-[#d4af37]/35 transition-all duration-300"
              >
                Plan Your Event
              </a>
              <a 
                href="#gallery"
                className="px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-white border border-[#d4af37]/40 hover:bg-slate-900/40 hover:border-[#d4af37] transition-all duration-300"
              >
                Explore Gallery
              </a>
            </motion.div>
          </div>

          {/* Floating glassmorphic stat widgets on Hero */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {[
                { count: "500+", label: "Events Planned", sub: "Impeccable setups" },
                { count: "1000+", label: "Happy Clients", sub: "Unmatched delight" },
                { count: "8+ Years", label: "Elite Experience", sub: "Industry pioneers" },
                { count: "4.9 ★", label: "Top Rating", sub: "Highly recommended" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                  className="glassmorphism bg-slate-950/70 p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <h3 className="text-3xl font-serif font-bold text-[#d4af37] mb-1">{stat.count}</h3>
                  <p className="text-sm font-semibold text-white tracking-wide">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-light mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Glowing orb background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#d4af37]/10 blur-[100px] z-0 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 4. PREMIUM TRUST SECTION */}
      <section className="py-12 bg-[#070b13] border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]/60 mb-8">Trusted By Luxury Venues & Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 grayscale hover:opacity-85 transition-opacity duration-500">
            {PARTNERS.map((partner) => (
              <span key={partner} className="text-xl md:text-2xl font-serif font-bold text-slate-400 tracking-wider">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED EVENTS SHOWCASE (ORCHESTRATED STAGGERED REVEALS) */}
      <section className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Exquisite Masterpieces</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Featured Celebrations</h2>
            <p className="text-slate-400 font-light">Explore a curated selection of our grandest designs and bespoke themed setups.</p>
          </div>

          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredMasterpieces.map((event) => (
              <motion.div
                key={event.title}
                variants={cardItemVariants}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 hover:border-[#d4af37]/35 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-[#070b13]/60 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <span className="text-[#d4af37] text-xs font-semibold uppercase tracking-widest">{event.category}</span>
                  <h3 className="text-xl font-serif text-white font-bold group-hover:text-[#d4af37] transition-colors">{event.title}</h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. BEFORE & AFTER TRANSFORMATION SECTION */}
      <section className="py-24 bg-[#070b13] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Visual Magic</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Before & After Decor</h2>
            <p className="text-slate-400 font-light">Drag the golden slider to witness our luxury transformation of an empty hall into a premium luxury banquet event.</p>
          </div>

          {/* Interactive Drag Slider */}
          <div 
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-2xl select-none cursor-ew-resize"
          >
            {/* After Image (Full background) */}
            <img 
              src={IMAGES.after} 
              alt="Venue After Decor" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-emerald-600/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Luxury Setup (After)
            </div>

            {/* Before Image (Width bound by sliderPosition) */}
            <div 
              className="absolute top-0 bottom-0 left-0 overflow-hidden z-10"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={IMAGES.before} 
                alt="Venue Before Decor" 
                className="absolute top-0 left-0 w-full h-full object-cover max-w-none pointer-events-none"
                style={{ width: sliderRef.current ? sliderRef.current.getBoundingClientRect().width : '100%' }}
              />
              <div className="absolute bottom-6 left-6 z-20 bg-amber-600/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Raw Space (Before)
              </div>
            </div>

            {/* Slider bar and golden handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 w-1 bg-[#d4af37] flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-[#d4af37] flex items-center justify-center cursor-ew-resize slider-handle-shadow">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EVENT CATEGORIES SECTION */}
      <section id="services" className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Our Specialties</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Event Categories</h2>
            <p className="text-slate-400 font-light">Crafting absolute perfection across all major luxury themes and gatherings.</p>
          </div>

          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: "Birthday Parties", icon: Gift, desc: "Milestones crafted with custom luxury themes." },
              { title: "Kids Birthdays", icon: Sparkles, desc: "Magical fairy tale themed premium balloon decors." },
              { title: "Baby Showers", icon: Heart, desc: "Sophisticated floral setup celebrations." },
              { title: "Engagement Ceremonies", icon: Star, desc: "Bespoke romantic dining and stage decors." },
              { title: "Corporate Events", icon: Calendar, desc: "Polished and upscale corporate annual dinners." },
              { title: "Anniversary Celebrations", icon: Clock, desc: "Warm candlelight ambiance to honor commitment." },
              { title: "Theme Decorations", icon: Award, desc: "Fully immersive customizable visual setups." },
              { title: "Surprise Events", icon: Users, desc: "Impeccably coordinated secret planners." }
            ].map((srv) => {
              const IconComp = srv.icon;
              return (
                <motion.div
                  key={srv.title}
                  variants={cardItemVariants}
                  className="glassmorphism p-6 rounded-2xl hover:border-[#d4af37] hover:shadow-lg hover:shadow-[#d4af37]/10 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle hover holographic light sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-[#d4af37]/30 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/10 group-hover:border-[#d4af37] transition-all">
                    <IconComp className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">{srv.title}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{srv.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 8. DETAILED MASONRY FILTER GALLERY WITH 18+ UNIQUE EVENTS */}
      <section id="gallery" className="py-24 bg-[#070b13] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="text-left space-y-3">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Exquisite Designs (18 Unique Event Blueprints)</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Visual Showcase</h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 max-w-full">
              {['All', 'Birthdays', 'Weddings', 'Baby Showers', 'Corporate Events', 'Theme Decorations', 'Surprise Events'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGalleryFilter(filter)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    galleryFilter === filter 
                      ? 'bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] text-slate-900' 
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-[#d4af37]/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Layout */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-850 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[#d4af37] text-[10px] font-semibold uppercase tracking-widest bg-slate-900/90 px-3 py-1 rounded-full border border-[#d4af37]/20">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-serif text-white font-bold mt-3 group-hover:text-[#d4af37] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/80 border border-[#d4af37]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-[#d4af37]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 9. REAL-TIME EVENT BUDGET CALCULATOR WITH COUNTER UP/DOWN ANIMATION */}
      <section id="calculator" className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold bg-slate-900/60 px-4 py-1.5 rounded-full border border-[#d4af37]/20">
              Interactive Estimator
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Event Budget Calculator</h2>
            <p className="text-slate-400 font-light">Estimate your custom luxury event pricing live based on guest sizes and custom additions.</p>
          </div>

          <div className="glassmorphism rounded-3xl p-8 border-[#d4af37]/30 shadow-2xl grid md:grid-cols-12 gap-8 items-center">
            {/* Input Selection Side */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">1. Event Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Birthday', 'Wedding', 'Corporate'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCalcType(type)}
                      className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                        calcType === type 
                          ? 'bg-[#d4af37] text-slate-900 border-[#d4af37]' 
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-[#d4af37]/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">2. Guest Capacity</label>
                  <span className="text-xs font-bold text-white">{calcGuests} Guests</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={calcGuests}
                  onChange={(e) => setCalcGuests(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">3. Decor Setup Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Silver', 'Gold', 'Platinum'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCalcTier(tier)}
                      className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                        calcTier === tier 
                          ? 'bg-[#d4af37] text-slate-900 border-[#d4af37]' 
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-[#d4af37]/50'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">4. Add-on Services</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Photography', key: 'photo' },
                    { label: 'DJ Sound System', key: 'music' },
                    { label: 'Emcee/Host', key: 'emcee' }
                  ].map((add) => (
                    <button
                      key={add.key}
                      type="button"
                      onClick={() => setCalcAddons(prev => ({ ...prev, [add.key]: !prev[add.key] }))}
                      className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                        calcAddons[add.key] 
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' 
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-[#d4af37]/35'
                      }`}
                    >
                      {add.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt Summary Side */}
            <div className="md:col-span-5 bg-slate-950/80 p-6 rounded-2xl border border-slate-900 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold border-b border-slate-850 pb-2">Estimated Quote</h4>
                
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Decor ({calcTier}):</span>
                    <span className="font-semibold text-white">₹{calcTier === 'Silver' ? '15,000' : calcTier === 'Gold' ? '35,000' : '75,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category Multiplier:</span>
                    <span className="font-semibold text-white">x{calcType === 'Wedding' ? '1.5' : calcType === 'Corporate' ? '1.3' : '1.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Multiplier:</span>
                    <span className="font-semibold text-white">x{calcGuests > 250 ? '2.2' : calcGuests > 100 ? '1.6' : calcGuests > 50 ? '1.2' : '1.0'}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Add-ons:</span>
                    <span>+₹{Object.values(calcAddons).filter(Boolean).length * 10000}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Grand Total Estimate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  {/* Digital counter ease transition */}
                  <span className="text-3xl font-serif font-bold text-[#d4af37]">₹{displayedTotal.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 font-light">/ Approx</span>
                </div>
                <a
                  href="#book"
                  className="block text-center w-full py-3 mt-4 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] hover:shadow-lg transition-all"
                >
                  Book with this estimate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PACKAGES COMPARISON */}
      <section id="packages" className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Investment Details</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Event Pricing & Packages</h2>
            <p className="text-slate-400 font-light">Choose from our tier-based luxury coordination packages.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-16">
            {/* Silver */}
            <div className="glassmorphism p-8 rounded-3xl flex flex-col justify-between border-slate-800 relative hover:border-[#d4af37]/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Standard Luxury</span>
                <h3 className="text-2xl font-serif font-bold text-white">Silver Package</h3>
                <div className="py-2 border-y border-slate-800">
                  <span className="text-4xl font-serif font-bold text-white">₹15,000</span>
                  <span className="text-xs text-slate-400 font-light"> / Starting</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Premium Balloon Arch Setup', 'Standard Backdrop Design', 'Professional LED Par Lights', 'Cake Table Elegance Setup', '1 Lead Decor Coordinator'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#book" className="w-full text-center py-3 mt-8 rounded-xl text-xs font-semibold uppercase tracking-widest text-white border border-[#d4af37]/30 hover:border-[#d4af37] transition-all">
                Select Silver
              </a>
            </div>

            {/* Gold */}
            <div className="glassmorphism p-8 rounded-3xl flex flex-col justify-between border-[#d4af37]/50 bg-slate-900/60 relative hover:shadow-2xl hover:shadow-[#d4af37]/15 transition-all duration-300 lg:transform lg:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#d4af37] text-slate-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Deluxe Experience</span>
                <h3 className="text-2xl font-serif font-bold text-white">Gold Package</h3>
                <div className="py-2 border-y border-slate-800">
                  <span className="text-4xl font-serif font-bold text-white">₹35,000</span>
                  <span className="text-xs text-slate-400 font-light"> / Starting</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Luxury Theme Backdrop (Customized)', 'Premium Balloon & Floral Decor', 'Special Spotlights & Fog Entry', 'Premium Cake Table Stylist', 'Photography Included (3 Hrs)', 'Dedicated Planner Assigned'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#book" className="w-full text-center py-3 mt-8 rounded-xl text-xs font-semibold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] hover:shadow-lg transition-all">
                Select Gold
              </a>
            </div>

            {/* Platinum */}
            <div className="glassmorphism p-8 rounded-3xl flex flex-col justify-between border-slate-800 relative hover:border-[#d4af37]/30 transition-all duration-300">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Elite Signature</span>
                <h3 className="text-2xl font-serif font-bold text-white">Platinum Package</h3>
                <div className="py-2 border-y border-slate-800">
                  <span className="text-4xl font-serif font-bold text-white">₹75,000</span>
                  <span className="text-xs text-slate-400 font-light"> / Starting</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Custom Immersive Concept Theme', 'Complete Grand Stage Backdrop', 'Exquisite Fresh Flower & Balloon setups', 'Cinematic Photography & Highlight Reel', 'DJ & Grand Special Effects Entry', 'Full Event Concierge Team'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#book" className="w-full text-center py-3 mt-8 rounded-xl text-xs font-semibold uppercase tracking-widest text-white border border-[#d4af37]/30 hover:border-[#d4af37] transition-all">
                Select Platinum
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. EVENT PROCESS TIMELINE */}
      <section id="process" className="py-24 bg-[#070b13] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Impeccable Logistics</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">How We Plan Perfection</h2>
            <p className="text-slate-400 font-light">From initial concept meeting to grand execution on the celebration day.</p>
          </div>

          <div className="relative border-l border-[#d4af37]/30 ml-4 md:ml-0 md:grid md:grid-cols-6 md:border-l-0 md:border-t md:pt-12 gap-6">
            {[
              { num: "01", title: "Consultation", desc: "Understanding your vision, colors, guest profile and expectations." },
              { num: "02", title: "Theme Selection", desc: "Designing a premium luxury concept blueprint customized for the venue." },
              { num: "03", title: "Strategic Planning", desc: "Coordinating premium vendors, timing, florists, and catering lists." },
              { num: "04", title: "Decoration Setup", desc: "Handcrafting luxury balloon installations and setting stage lighting." },
              { num: "05", title: "Event Execution", desc: "Flawless backstage orchestration so you enjoy every minute stress-free." },
              { num: "06", title: "Celebration Day", desc: "Bask in the glory of a premium luxury bespoke party experience." }
            ].map((step, i) => (
              <div key={step.title} className="relative pl-8 pb-12 md:pl-0 md:pb-0">
                {/* Visual marker dot */}
                <div className="absolute top-0 left-[-9px] md:top-[-17px] md:left-0 w-4 h-4 rounded-full bg-[#d4af37] border-4 border-slate-900" />
                
                <span className="text-4xl font-serif font-extrabold text-[#d4af37]/20 block mb-2">{step.num}</span>
                <h4 className="text-lg font-serif font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. INTERACTIVE AI EVENT PLANNER (CHATBOT DEMO) */}
      <section className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold bg-slate-900/60 px-4 py-1.5 rounded-full border border-[#d4af37]/20">
              Interactive Tool
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">AI Luxury Event Assistant</h2>
            <p className="text-slate-400 font-light">Instantly curate your bespoke decoration setup and pricing recommendation.</p>
          </div>

          <div className="glassmorphism rounded-3xl p-8 border-[#d4af37]/20 shadow-2xl relative min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {chatStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 max-w-[80%]">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        Welcome to Vivid Celebrations assistant! Let's tailor the perfect event setup. First, **what type of celebration are you planning?**
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {['Birthday Party', 'Kids Theme Party', 'Baby Shower', 'Wedding/Engagement', 'Corporate Gala'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleChatAnswer('type', type)}
                        className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-left hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {chatStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 max-w-[80%]">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        Excellent choice! A {chatAnswers.type} is special. **What is your budget preference for the decoration & theme?**
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {[
                      { label: '₹15,000 – ₹50,000', value: '15k-50k' },
                      { label: '₹50,000 – ₹1 Lakh', value: '50k-1L' },
                      { label: '₹1 Lakh +', value: '1L+' }
                    ].map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => handleChatAnswer('budget', budget.value)}
                        className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-center text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all"
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {chatStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 max-w-[80%]">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        Understood. Lastly, **how many guests are you expecting to host?**
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {['Under 50', '50 – 150', '150+'].map((guests) => (
                      <button
                        key={guests}
                        onClick={() => handleChatAnswer('guests', guests)}
                        className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-center text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all"
                      >
                        {guests}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {chatStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 w-full">
                      <h4 className="text-[#d4af37] font-serif font-bold text-lg mb-2">Your Bespoke Recommendation</h4>
                      
                      <div className="space-y-3 text-xs text-slate-300">
                        <div className="flex justify-between border-b border-slate-850 pb-2">
                          <span>Recommended Tier:</span>
                          <span className="font-bold text-white uppercase tracking-wider">
                            {chatAnswers.budget === '15k-50k' ? 'Silver Luxury Package' : chatAnswers.budget === '50k-1L' ? 'Gold Luxury Package' : 'Platinum Signature Package'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850 pb-2">
                          <span>Target Budget:</span>
                          <span className="font-bold text-white uppercase tracking-wider">
                            {chatAnswers.budget === '15k-50k' ? '₹15,000+' : chatAnswers.budget === '50k-1L' ? '₹35,000+' : '₹75,000+'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850 pb-2">
                          <span>Decor Highlights:</span>
                          <span className="text-[#d4af37] text-right font-medium">
                            {chatAnswers.type === 'Kids Theme Party' ? 'Fantasy Character Arch & Lights' : chatAnswers.type === 'Wedding/Engagement' ? 'Ethereal Canopy & Premium Florals' : 'Golden Shimmer Backdrop & Luxe Table Setup'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-[#d4af37]/20 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">Est. Guest Capacity</p>
                          <p className="text-sm font-bold text-white">{chatAnswers.guests} Guests</p>
                        </div>
                        <a 
                          href="#book"
                          className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-[#d4af37] hover:bg-[#b8962e] transition-colors"
                        >
                          Enquire Now
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={resetChat}
                      className="text-xs text-slate-400 hover:text-[#d4af37] underline transition-colors"
                    >
                      Reset and plan another
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 13. INSTAGRAM REELS SHOWCASE (HORIZONTAL SCROLL) */}
      <section className="py-24 bg-[#070b13] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Social Proof</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Instagram Reels Showcase</h2>
            <p className="text-slate-400 font-light">Swipe or scroll horizontally to experience the raw excitement and high-society aesthetics from our live celebrations.</p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory px-4">
            {[
              { views: "45K", likes: "3.2K", tag: "@vividcelebrations", desc: "Whimsical forest entrance walkthrough", bg: ALL_EVENTS[13].image },
              { views: "82K", likes: "7.1K", tag: "@vividcelebrations", desc: "The grand 50th golden balloon drop", bg: ALL_EVENTS[1].image },
              { views: "112K", likes: "10.4K", tag: "@vividcelebrations", desc: "A dream floral canopy reveal", bg: ALL_EVENTS[4].image },
              { views: "34K", likes: "2.8K", tag: "@vividcelebrations", desc: "VIP anniversary candlelight setting", bg: ALL_EVENTS[16].image }
            ].map((reel) => (
              <div 
                key={reel.desc} 
                className="flex-none w-72 h-[450px] rounded-2xl overflow-hidden relative border border-slate-800 snap-start group"
              >
                <img 
                  src={reel.bg} 
                  alt={reel.desc} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                
                {/* Video Play Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/80 flex items-center justify-center backdrop-blur-sm scale-90 group-hover:scale-100 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <Volume2 className="w-5 h-5 text-slate-900" />
                  </div>
                </div>

                {/* Reels stats */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs text-white font-semibold">{reel.tag}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">{reel.desc}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>{reel.views} Views</span>
                    <span>{reel.likes} Likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. EVENT CALENDAR TIMELINE */}
      <section className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Live Availability</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Upcoming Events Roadmap</h2>
            <p className="text-slate-400 font-light">A visual look into our highly-anticipated luxury bookings scheduled across top hotels.</p>
          </div>

          <div className="space-y-6">
            {[
              { date: "June 12, 2026", hotel: "The Ritz-Carlton Grand Ballroom", type: "Royal Theme 1st Birthday Setup", status: "Fully Booked" },
              { date: "June 28, 2026", hotel: "Taj Palace Garden Lawn", type: "Ethereal Pastel Baby Shower", status: "Fully Booked" },
              { date: "July 04, 2026", hotel: "Four Seasons Elite Lounge", type: "Exclusive Candlelit Engagement Banquet", status: "Fully Booked" },
              { date: "July 18, 2026", hotel: "Vivid Signature Studio", type: "Open Booking Slot", status: "Available", action: true }
            ].map((evt) => (
              <div 
                key={evt.date}
                className={`p-6 rounded-2xl border transition-all ${
                  evt.action ? 'border-[#d4af37] bg-[#d4af37]/5 hover:bg-[#d4af37]/10' : 'border-slate-850 bg-slate-900/40 hover:border-slate-800'
                } flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold">{evt.date}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      evt.action ? 'bg-[#d4af37] text-slate-900' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white">{evt.type}</h4>
                  <p className="text-xs text-slate-400 font-light">{evt.hotel}</p>
                </div>
                {evt.action && (
                  <a 
                    href="#book"
                    className="self-start md:self-auto px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-900 bg-[#d4af37] hover:bg-[#b8962e] transition-colors"
                  >
                    Secure Slot
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FAQ SECTION (ACCORDION) */}
      <section id="faq" className="py-24 bg-[#070b13] relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Got Questions?</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 font-light">Everything you need to know about our luxury booking and planning process.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How early should I book my event with Vivid Celebrations?", a: "For milestone birthdays, baby showers, and smaller events, we recommend booking 3 to 6 weeks in advance. For grand weddings and elaborate custom concept parties, booking 2 to 4 months in advance ensures absolute perfection and complete venue walkthroughs." },
              { q: "Can the themes and balloon setups be customized?", a: "Absolutely! We do not offer generic pre-packaged templates. Every luxury celebration is designed entirely from scratch, customized to match your chosen color palette, event venue dimensions, and specific visual themes." },
              { q: "What is included in the Gold and Platinum packages?", a: "Our premium packages cover the full end-to-end spectrum: customized theme conceptualization, bespoke backdrop decorations, high-end studio lighting (LED par lights, spotlights), premium table styling, professional photography, sound setups, and dedicated on-site event managers." },
              { q: "Which locations do you serve?", a: "We operate and coordinate premium celebrations globally, with active direct setups across all elite hotels, luxury private mansions, and commercial banquets in major metropolitan regions." },
              { q: "Do you handle photography and professional videography?", a: "Yes, our Gold and Platinum packages include our award-winning in-house team of luxury events photographers who deliver high-resolution portraits, candid albums, and cinematic highlight reels." }
            ].map((faq, i) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={faq.q} className="glassmorphism rounded-2xl overflow-hidden border-slate-850">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 text-left flex items-center justify-between text-white hover:text-[#d4af37] transition-colors"
                  >
                    <span className="font-serif font-bold text-sm md:text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#d4af37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-850/50 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 16. BLOG / EVENT INSIGHTS */}
      <section className="py-24 bg-[#0b0f19] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Luxury Trends</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Event Insights & Inspiration</h2>
            <p className="text-slate-400 font-light">Read professional tips and luxury setups curated by our elite planning directors.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "2026 Birthday Decoration Trends", date: "May 24, 2026", desc: "Explore why chrome organic balloon arches and glassmorphic panels dominate VIP event planning this season.", image: IMAGES.blog[0] },
              { title: "Luxury Party Checklist for Families", date: "May 10, 2026", desc: "A comprehensive guide on managing caterers, photographers, and themes seamlessly for private home celebrations.", image: IMAGES.blog[1] },
              { title: "Bespoke Kids Theme Blueprints", date: "Apr 28, 2026", desc: "How to draft interactive fairy tale themes that will delight children and look incredibly premium on camera.", image: IMAGES.blog[2] }
            ].map((post) => (
              <div 
                key={post.title}
                className="glassmorphism rounded-2xl overflow-hidden border-slate-850 hover:border-[#d4af37]/35 transition-all group"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider">{post.date}</span>
                  <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#d4af37] transition-colors">{post.title}</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{post.desc}</p>
                  <a href="#book" className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4af37] hover:text-[#b8962e] pt-2">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. PREMIUM BOOKING INQUIRY FORM */}
      <section id="contact" className="py-24 bg-[#070b13] relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">Start Planning</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Let's Design Your Masterpiece</h2>
              <p className="text-slate-400 font-light">Have an upcoming celebration in mind? Secure your exclusive slot with Vivid Celebrations and let us handcraft your dream theme.</p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Direct Call / WhatsApp</p>
                  <p className="text-sm font-bold text-white">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Email Enquiries</p>
                  <p className="text-sm font-bold text-white">concierge@vividcelebrations.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">VIP Design Studio Office</p>
                  <p className="text-sm font-bold text-white">Level 4, Executive Plaza, Jubilee Hills, Hyderabad, TS, India</p>
                </div>
              </div>
            </div>

            {/* Google Maps Premium Placeholder Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-850 h-44 bg-slate-900/60 relative">
              <div className="absolute inset-0 bg-slate-950/40 z-10" />
              {/* Simulated map graphic */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-25 p-4 text-center space-y-2">
                <MapPin className="w-8 h-8 text-[#d4af37]" />
                <span className="text-xs text-white font-bold">Jubilee Hills, Hyderabad</span>
                <span className="text-[10px] text-slate-400">Click to launch Google Maps navigation</span>
              </div>
              <div className="w-full h-full opacity-20 bg-cover" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')` }} />
            </div>
          </div>

          {/* Form Side */}
          <div id="book" className="lg:col-span-7">
            <div className="glassmorphism p-8 md:p-10 rounded-3xl border-[#d4af37]/30 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Aishwarya Rao"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. aishwarya@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Event Type</label>
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        >
                          <option value="">Select Celebration</option>
                          <option value="Birthday">Birthday Party</option>
                          <option value="Kids Theme">Kids Birthday Theme</option>
                          <option value="Baby Shower">Baby Shower Setup</option>
                          <option value="Wedding">Engagement/Wedding</option>
                          <option value="Corporate">Corporate Gala</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        >
                          <option value="">Select Budget</option>
                          <option value="15k-35k">₹15,000 – ₹35,000</option>
                          <option value="35k-75k">₹35,000 – ₹75,000</option>
                          <option value="75k+">₹75,000 +</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Event Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Est. Guests</label>
                        <input
                          type="number"
                          value={formData.guests}
                          onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                          placeholder="e.g. 100"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">Special Visual Requirements / Custom Theme ideas</label>
                      <textarea
                        rows="3"
                        value={formData.requirements}
                        onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                        placeholder="e.g. 'Golden balloon entrance with matching floral centerpieces and VIP photoshoot backdrop...'"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] hover:shadow-xl hover:shadow-[#d4af37]/35 transition-all duration-300"
                    >
                      Request Call & Free Proposal
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37] flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">Proposal Request Received!</h3>
                    <p className="text-xs text-slate-300 font-light max-w-md mx-auto leading-relaxed">
                      Thank you, **{formData.name}**. Our premium event concierge team has received your inquiry for a {formData.eventType || 'luxury'} celebration and will contact you on **{formData.phone}** within 2 hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-[#d4af37] hover:text-[#b8962e] underline transition-colors"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FLOATING ACTION CENTER + WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-[400] flex flex-col items-end gap-3">
        <AnimatePresence>
          {actionMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="flex flex-col gap-3 items-end"
            >
              {/* Call Now */}
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 bg-slate-900 border border-[#d4af37] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:bg-slate-850 transition-colors"
              >
                <span>Call Now</span>
                <Phone className="w-4 h-4 text-[#d4af37]" />
              </a>

              {/* Book Event */}
              <a
                href="#book"
                onClick={() => setActionMenuOpen(false)}
                className="flex items-center gap-2 bg-[#d4af37] text-slate-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#b8962e] transition-colors"
              >
                <span>Book Event</span>
                <Sparkles className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Trigger Button (WhatsApp Green Aesthetic + Callout) */}
        <button
          onClick={() => setActionMenuOpen(!actionMenuOpen)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl border border-emerald-500/30 transition-all duration-300 relative group animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          {actionMenuOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          
          {/* Active tooltip alert */}
          <span className="absolute right-16 bg-slate-900 border border-[#d4af37]/30 text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with Planners
          </span>
        </button>
      </div>

      {/* 14. PREMIUM FOOTER */}
      <footer className="bg-[#070b13] border-t border-slate-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-950 p-2.5 rounded-xl border border-[#d4af37]/35 flex items-center justify-center mb-3">
              <VCLogo />
            </div>
            <span className="text-lg font-serif font-bold text-white uppercase tracking-widest">
              VIVID <span className="text-[#d4af37]">CELEBRATIONS</span>
            </span>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Bespoke luxury event management, breathtaking balloon configurations, high-society decorations and unforgettable memories planned to perfection.
            </p>
            <div className="flex gap-4 pt-2">
              {['instagram', 'facebook', 'pinterest', 'youtube'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-all">
                  <InstagramIcon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Our Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Birthday Party Planning', 'Custom Theme Balloons', 'Baby Shower Decors', 'Wedding Ceremony Design', 'VIP Corporate Events'].map((srv) => (
                <li key={srv}>
                  <a href="#services" className="hover:text-white transition-colors">{srv}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Newsletter Subscription</h4>
            <p className="text-xs text-slate-400 font-light">Join our exclusive mailing list for luxury event decor trends and inspiration.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter elite email" 
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-[#d4af37] focus:outline-none"
              />
              <button className="px-4 py-2 bg-[#d4af37] hover:bg-[#b8962e] text-slate-900 rounded-lg text-xs font-bold transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Vivid Celebrations. All Rights Reserved.</span>
          <span>Crafted with Immaculate Elegance & Creativity</span>
        </div>
      </footer>
    </>
  );
}
