'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Sparkles, Calendar, Users, DollarSign, Send, MessageSquare, Phone, 
  MapPin, Mail, ChevronDown, Check, Menu, X, ArrowRight, Calculator,
  Award, Clock, Star, Heart, Volume2, ShieldCheck, Gift, ArrowUpRight
} from 'lucide-react';

// Premium high-res birthday & kids party images from Unsplash (no wedding/corporate)
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1600",
  before: "/before.png",
  after: "/after.png",
  testimonials: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  ],
  blog: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600"
  ]
};

const AREAS = ["Jubilee Hills", "Banjara Hills", "Gachibowli", "Kondapur", "Madhapur", "Begumpet", "Secunderabad", "Kukatpally"];

// 18+ Unique, non-repeating birthday and family event setups (3 unique themes per category)
const ALL_EVENTS = [
  // Birthday Themes
  { id: 1, category: "Birthday Themes", title: "Space Adventure Kids Set", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800", desc: "Out of this world astronauts, rocket cutouts, dark blue backdrop panels, and planet balloons." },
  { id: 2, category: "Birthday Themes", title: "Jungle Safari Adventures", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800", desc: "Lush green backdrop panels, customized giraffe & lion models, organic olive green balloon arch." },
  { id: 3, category: "Birthday Themes", title: "Magical Mermaid Paradise", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", desc: "Pastel purple and turquoise shell panels, shimmering sequin curtains, and starfish cake table decorations." },

  // Balloon Decorations
  { id: 4, category: "Balloon Decorations", title: "Pastel Balloon Canopy Arch", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800", desc: "A gorgeous, multi-layered organic balloon backdrop in soft peach, mint, pink, and gold." },
  { id: 5, category: "Balloon Decorations", title: "Chrome Gold Helium Clusters", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800", desc: "High-shine metallic gold and black organic pillars with giant customized letter bouquets." },
  { id: 6, category: "Balloon Decorations", title: "Whimsical Rainbow Entrance Gate", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800", desc: "An outstanding colorful balloon entrance arch designed to welcome children at the banquet or backyard." },

  // Baby Showers
  { id: 7, category: "Baby Showers", title: "Sweet Pastel Teddy Cloud", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", desc: "Drifting white and baby pink cloud backdrops, customized hot air balloons, and floral teddy swings." },
  { id: 8, category: "Baby Showers", title: "Oh Baby Botanical Sage Arch", image: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=80&w=800", desc: "Soft white and sage green balloon arches mixed with organic ivy leaves and a neon sign backdrop." },
  { id: 9, category: "Baby Showers", title: "Twinkle Twinkle Little Star Shower", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800", desc: "Metallic silver star hangings, glowing yellow moon backdrops, and deep navy velvet cake table drapes." },

  // Kids Parties
  { id: 10, category: "Kids Parties", title: "Superhero City Skyline", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", desc: "Miniature city skyscraper silhouettes, customized shield props, and high-energy primary color balloon sweeps." },
  { id: 11, category: "Kids Parties", title: "Fairy Tale Princess Castle", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", desc: "Bespoke castle card cutouts, pink and gold floral arches, and sparkling custom throne seating." },
  { id: 12, category: "Kids Parties", title: "Fun Undersea Aquarium Theme", image: "https://images.unsplash.com/photo-1563841930-5664d3671f4c?auto=format&fit=crop&q=80&w=800", desc: "Hanging jelly fish lanterns, organic blue bubble balloon cascades, and customized coral reef pillars." },

  // Home Celebrations
  { id: 13, category: "Home Celebrations", title: "Cozy Living Room surprise Arch", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800", desc: "An organic balloon semicircle tailored to fit home living room spaces, complete with a neon name sign." },
  { id: 14, category: "Home Celebrations", title: "Backyard Canopy Picnic Setup", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800", desc: "Bespoke teepee tent drapes, soft floor cushions, string lights, and organic flower centerpieces." },
  { id: 15, category: "Home Celebrations", title: "Terrace Sunset Surprise Setup", image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800", desc: "Warm glowing lantern clusters, round metallic frame setups, and rich rose gold balloon details." },

  // Theme Decor
  { id: 16, category: "Theme Decor", title: "Candy Land Sweet Carousel", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800", desc: "Giant dummy lollipop models, candy cane arches, pink striped backdrop boards, and bubble balloon structures." },
  { id: 17, category: "Theme Decor", title: "Retro Disco Neon Beats", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800", desc: "Shimmering disco foil curtains, customized silver metallic pillars, and bright neon balloon designs." },
  { id: 18, category: "Theme Decor", title: "Vintage Floral Tea Party", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=800", desc: "Delicate lace drapes, fresh garden pastel roses, gold wire backdrops, and customized vintage cups and favors." }
];

const VCLogo = (props) => (
  <svg
    viewBox="0 0 100 100"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Friendly Party Balloon Logo */}
    <path
      d="M50 15 C30 15, 20 30, 20 50 C20 70, 35 80, 50 80 C65 80, 80 70, 80 50 C80 30, 70 15, 50 15 Z"
      fill="#F59E0B"
    />
    <path
      d="M47 80 L53 80 L50 85 Z"
      fill="#D97706"
    />
    <path
      d="M50 85 Q48 90, 50 95"
      stroke="#1E293B"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M38 48 L44 58 L50 48 L56 58 L62 48 L58 64 L42 64 Z"
      fill="#FFFFFF"
    />
  </svg>
);

const WHATSAPP_NUMBER = "919959512223";
const WHATSAPP_DISPLAY = "+91 99595 12223";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20am%20planning%20a%20magical%20celebration%20in%20Hyderabad.%20Please%20send%20details.`;

// Framer Motion variants for friendly staggered entrances
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 16 } 
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
    name: '', phone: '', email: '', eventType: 'Birthday', budget: '', date: '', guests: '', requirements: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Advanced AI Event Planner Chatbot State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I am your ThemeCraft AI Assistant. 🌟 I am an advanced event-planning intelligence! I can help you custom-design magical setups for **Kids Birthdays**, **Oh Baby Sage Showers**, **Anniversaries**, **Surprise Terrace Decorations**, and **Home setups** across Hyderabad! Describe your dream theme, event type, or ask me any questions!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Real-time Event Budget Calculator State
  const [calcType, setCalcType] = useState('Birthday');
  const [calcGuests, setCalcGuests] = useState(100);
  const [calcTier, setCalcTier] = useState('Theme Party');
  const [calcAddons, setCalcAddons] = useState({ castle: false, magic: false, tattoo: false, cartoon: false, chocolate: false, popcorn: false, cotton: false });
  const [calcTotal, setCalcTotal] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  // Dynamic User Reviews State
  const [reviews, setReviews] = useState([
    { name: "Priya Reddy", location: "Jubilee Hills", role: "Parent of 2yo", type: "Kids Jungle Safari Birthday", quote: "ThemeCraft Celebrations turned our living room into a jungle! The Safari panels and organic olive balloon arch looked stunning. Rahul's team was highly professional and on-time.", rate: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
    { name: "Rahul Kumar", location: "Gachibowli", role: "Parent of 5yo", type: "Space Adventure Birthday", quote: "Highly recommend the Theme Party package! The candid photography was excellent, and the Astronaut backdrop completely blew our guests away. Best planners in Hyderabad.", rate: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    { name: "Sneha Sharma", location: "Kondapur", role: "New Mother", type: "Botanical Sage Baby Shower", quote: "Absolutely flawless Oh Baby backdrop setups in Sage green and botanical ivy leaves. They book directly on WhatsApp which saved so much coordination time.", rate: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
    { name: "Anil Verma", location: "Begumpet", role: "Father of 7yo", type: "Candy Land Theme Celebration", quote: "The Premium Package was worth every rupee. Bouncy castle kept children completely engaged, popcorn and cotton candy stalls were absolute hits! On-time balloon setups.", rate: 5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
  ]);
  const [newReview, setNewReview] = useState({ name: '', role: '', location: '', type: '', quote: '', rate: 5 });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
    let basePrice = 9999; // Starter Party
    if (calcTier === 'Theme Party') basePrice = 19999;
    if (calcTier === 'Premium Celebration') basePrice = 34999;

    let guestMultiplier = 1;
    if (calcGuests > 200) guestMultiplier = 1.8;
    else if (calcGuests > 100) guestMultiplier = 1.4;
    else if (calcGuests > 50) guestMultiplier = 1.2;

    let typeMultiplier = 1.0;
    if (calcType === 'Baby Shower') typeMultiplier = 1.1;
    if (calcType === 'Theme Party') typeMultiplier = 1.25;

    let addonCost = 0;
    if (calcAddons.castle) addonCost += 6000;
    if (calcAddons.magic) addonCost += 5000;
    if (calcAddons.tattoo) addonCost += 3000;
    if (calcAddons.cartoon) addonCost += 4000;
    if (calcAddons.chocolate) addonCost += 5500;
    if (calcAddons.popcorn) addonCost += 2500;
    if (calcAddons.cotton) addonCost += 2500;

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

  // Advanced Generative AI Chat Handler
  const handleSendChatMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    // Simulate real AI model reasoning and dynamic response
    setTimeout(() => {
      let aiResponse = "";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('contact') || lowerText.includes('ashish') || lowerText.includes('phone') || lowerText.includes('call') || lowerText.includes('number') || lowerText.includes('mobile')) {
        aiResponse = `### 📞 How to Contact Ashish & The Team!\n\nYou can reach out to **Ashish** directly using any of these quick channels:\n\n* **WhatsApp Chat**: Click the **Book Blueprint Now** button below to open an instant chat with Ashish!\n* **Phone Call**: Feel free to dial us at **${WHATSAPP_DISPLAY}** anytime for instant consultations.\n* **Address / Range**: We operate all across Hyderabad (including Hitech City, Jubilee Hills, Gachibowli, Begumpet, and Secunderabad).\n\nWhat kind of event are you looking to plan with Ashish today? Let me know so we can draft it!`;
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey') || lowerText.includes('who are you') || lowerText.includes('yo')) {
        aiResponse = `### 🌟 Hello & Welcome! I am your ThemeCraft AI Assistant!\n\nI am thrilled to help you plan an unforgettable celebration in Hyderabad! I can draft designs for:\n\n* **Kids Birthday Themes** (Space, Jungle Safari, Princess, Undersea, Candy Land)\n* **Oh Baby Sage Showers** & Botanical Arches\n* **Anniversaries** & Romantic Terrace surprises\n* **Home Balloon setups** (cozy, noise-free, zero-mess installations)\n\nTell me: **What event are you planning, or what theme/colors do you have in mind?** I'll customize a complete layout blueprint for you instantly!`;
      } else if (lowerText.includes('pricing') || lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much') || lowerText.includes('budget') || lowerText.includes('package')) {
        aiResponse = `### 💰 Transparent Hyderabad Event Packages!\n\nWe offer three structured tiers designed to fit any family celebration budget:\n\n* **Starter Party (₹9,999)**: Semicircular balloon setup, cake table designer styling, LED stage spotlights, and setup leads.\n* **Theme Party (₹19,999)**: Full organic balloon arch, custom theme backdrop panels, candid photography (3 hours), and professional layout coordination.\n* **Premium Celebration (₹34,999)**: Full custom theme setups, bouncy castles, cartoon character mascot, face painter, popcorn & cotton candy live food stalls!\n\nWhich of these packages fits your event vision? Give me some theme details, and I will draft a layout!`;
      } else if (lowerText.includes('time') || lowerText.includes('duration') || lowerText.includes('long') || lowerText.includes('setup')) {
        aiResponse = `### ⏱️ Hassle-Free Setup & Setup Timings!\n\n* **Setup Duration**: Normally, our professional decorators require **2 to 3 hours** depending on the package scale.\n* **Cleanup Service**: We ensure complete, clean balloon setup and leave the venue as pristine as we found it.\n* **Planning ahead**: We recommend booking at least **3 to 7 days in advance** so Ashish and our design team can prepare custom printed cutouts and premium helium orders!\n\nAre you looking to book for a specific date? Let me know!`;
      } else if (lowerText.includes('shower') || lowerText.includes('baby')) {
        aiResponse = `### 👶 Oh Baby Sage Shower Blueprint Drafted!\n\nI have generated a gorgeous, trending design proposal for your Baby Shower:\n\n* **Backdrop Style**: Circular matte-sage board layered with drifting white 3D foam clouds.\n* **Balloon Palette**: Sage Green, Pastel Peach, Metallic Gold clusters.\n* **Curated Add-ons**: A floral swing for the parents, custom botanical neon sign ("Oh Baby!"), and warm fairy lights.\n* **Recommended Tier**: **Theme Party Package (₹19,999)**.\n\nWould you like me to reserve this design or make adjustments? Click below to discuss directly on WhatsApp!`;
      } else if (lowerText.includes('anniversary') || lowerText.includes('surprise') || lowerText.includes('terrace')) {
        aiResponse = `### 💖 Romantic Terrace Surprise Setup Crafted!\n\nI have generated a magical romantic surprise blueprint:\n\n* **Backdrop Style**: Sleek geometric copper arch wrapped in cascading chrome rose gold balloons.\n* **Lighting & Vibe**: Over 50 warm LED copper lanterns, floating candle walkways, and a glowing neon marquee sign.\n* **Vibe Extras**: A cozy low-seating picnic rug with boho cushions and plush floral elements.\n* **Recommended Tier**: **Premium Celebration (₹34,999)**.\n\nThis setup is extremely popular for Gachibowli & Jubilee Hills terraces! Let's book this on WhatsApp?`;
      } else if (lowerText.includes('home') || lowerText.includes('living')) {
        aiResponse = `### 🏡 Cozy Home Balloon Decor Planner!\n\nI have structured a perfect living room balloon backdrop that maximizes home space:\n\n* **Backdrop Style**: Semi-organic balloon arch framing a custom gold mesh screen.\n* **Color Vibe**: High-shine metallic chrome gold, midnight slate, and warm white.\n* **Package Tier**: **Starter Party (₹9,999)** (optimized to complete within 2 hours at home).\n\nSetup is completely noise-free and zero mess. Click below to confirm!`;
      } else if (lowerText.includes('safari') || lowerText.includes('jungle')) {
        aiResponse = `### 🦁 Jungle Safari Adventure Kids Theme Blueprint!\n\nHere is an absolute favorite setup for Hyderabad parents:\n\n* **Backdrop Theme**: Custom jungle foliage print boards with customized 3D wooden animal cutouts (Giraffe, Lion, Zebra).\n* **Balloon Palette**: Forest green, matte yellow, chocolate brown, and chrome gold arches.\n* **Included Entertainment**: We highly recommend adding a **Bouncy Castle (₹4,500)** and a **Magic Show (₹3,500)** for the kids!\n* **Recommended Tier**: **Theme Party Package (₹19,999)**.\n\nLet's get a WhatsApp quote for this theme?`;
      } else if (lowerText.includes('space') || lowerText.includes('astronaut')) {
        aiResponse = `### 🚀 Outer Space Adventure Kids Theme Blueprint!\n\nReady for launch! Here is our highly requested custom space setup:\n\n* **Backdrop Theme**: Deep space nebula custom prints, astronaut models, and glowing LED star spheres.\n* **Balloon Palette**: Midnight dark blue, metallic silver chrome, and bright orange helium clusters.\n* **Stall Add-ons**: Popcorn & Cotton Candy live stalls to keep all the little space travelers fueled!\n* **Recommended Tier**: **Premium Celebration (₹34,999)**.\n\nClick below to push this custom blueprint directly to our WhatsApp chat!`;
      } else if (lowerText.includes('area') || lowerText.includes('where') || lowerText.includes('hyderabad') || lowerText.includes('location')) {
        aiResponse = `### 📍 Hyderabad Delivery Areas Covered!\n\nThemeCraft Celebrations plans events all over Hyderabad! Our main service areas include:\n\n* **Jubilee Hills & Banjara Hills**\n* **Gachibowli, Kondapur, & Madhapur** (Hitech City area)\n* **Begumpet, Secunderabad, & Kukatpally**\n\n*Note: Setup takes about 3 hours, and our planners ensure a pristine, clean, and hassle-free cleanup afterward!*`;
      } else {
        const concepts = [
          "Modern organic balloon cascade wrapped around a round mesh backdrop panel",
          "Double-stuffed pastel peach and chrome gold balloon pillars with custom neon name boards",
          "A retro glowing neon sign backed by dense green foliage panels and helium arches",
          "A multi-layered circular backdrop themed with high-quality custom card models",
          "Glittering sequin backdrop wall with a premium organic balloon arch framing"
        ];
        const stylings = [
          "Custom pastel palettes, slow-pulsing marquee letter lights, and designer cake tables",
          "Vibrant forest green and olive balloons with warm metallic spotlights and rustic centerpieces",
          "Metallic silver chrome balloons, starry LED spheres, and deep navy velvet curtains",
          "Soft baby pink and sky blue balloons with drifting foam clouds and golden crown badges",
          "Sunset gold chrome accents, warm lantern clusters, and boho rug seating"
        ];
        const stalls = [
          "Bouncy Castle (₹4,500) and Popcorn Stall (₹3,000)",
          "Live Balloon Twisting (₹2,500) and Face Painting (₹2,000)",
          "Magic Show & Emcee Host (₹4,500) and Chocolate Fountain (₹4,000)",
          "Tattoo Art (₹2,500) and Cotton Candy Stall (₹3,000)",
          "Popcorn Stall (₹3,000) and Cotton Candy Live Stall (₹3,000)"
        ];
        const tiers = [
          "Starter Party (₹9,999)",
          "Theme Party Package (₹19,999)",
          "Premium Celebration (₹34,999)"
        ];

        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const selectIdx = (arr) => arr[Math.abs(hash) % arr.length];
        
        const concept = selectIdx(concepts);
        const styling = selectIdx(stylings);
        const stall = selectIdx(stalls);
        const tier = selectIdx(tiers);

        aiResponse = `### 🌟 Customized Event Blueprint Generated!\n\nBased on your unique request, I have custom-compiled a personal blueprint:\n\n* **Design Concept**: ${concept}.\n* **Vibe Styling**: ${styling}.\n* **Stall Suggestion**: We highly recommend adding **${stall}** to delight your guests!\n* **Suggested Tier**: **${tier}**.\n\n*Our generative AI Planner has logged your custom preferences. Click the button below to instantly book or custom-discuss this setup with Ashish!*`;
      }

      setChatMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: aiResponse,
        whatsappLink: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20used%20your%20Advanced%20AI%20Planner%20and%20got%20this%20blueprint:%20${encodeURIComponent(text.trim())}.%20Let's%20discuss%20booking.`
      }]);
      setIsAiTyping(false);
    }, 1200);
  };

  const resetChat = () => {
    setChatMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hello! I am your ThemeCraft AI Assistant. 🌟 I am an advanced event-planning intelligence! I can help you custom-design magical setups for **Kids Birthdays**, **Oh Baby Sage Showers**, **Anniversaries**, **Surprise Terrace Decorations**, and **Home setups** across Hyderabad! Describe your dream theme, event type, or ask me any questions!"
      }
    ]);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.quote || !newReview.role || !newReview.location) {
      alert("Please fill in all the review fields.");
      return;
    }
    
    const avatars = [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const submittedReview = {
      ...newReview,
      avatar: randomAvatar,
      type: newReview.type || "Custom Party Theme"
    };

    setReviews(prev => [submittedReview, ...prev]);
    setNewReview({ name: '', role: '', location: '', type: '', quote: '', rate: 5 });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4500);
  };

  const filteredGallery = galleryFilter === 'All' 
    ? ALL_EVENTS 
    : ALL_EVENTS.filter(item => item.category === galleryFilter);

  // Distinct Kids/Family Featured Masterpieces
  const featuredMasterpieces = [
    ALL_EVENTS[0],  // Space Adventure (Birthday Themes)
    ALL_EVENTS[3],  // Pastel Balloon Canopy (Balloon Decorations)
    ALL_EVENTS[6],  // Sweet Pastel Teddy Cloud (Baby Showers)
    ALL_EVENTS[10], // Superhero City Skyline (Kids Parties)
    ALL_EVENTS[13], // Cozy Living Room Surprise (Home Celebrations)
    ALL_EVENTS[16]  // Candy Land Sweet Carousel (Theme Decor)
  ];

  return (
    <>
      {/* 1. PREMIUM PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          >
            <div className="relative flex flex-col items-center">
              {/* ThemeCraft Crown-Balloon Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }}
                className="w-24 h-24 mb-6 relative"
              >
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-[#f59e0b]/35 rounded-xl"
                />
                <VCLogo className="w-full h-full p-2 relative z-10" />
              </motion.div>

              <motion.h1 
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.4em", opacity: 1, transition: { delay: 0.5, duration: 1 } }}
                className="text-2xl md:text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest text-center"
              >
                ThemeCraft <span className="text-[#f59e0b]">Celebrations</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6, transition: { delay: 1.2 } }}
                className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-semibold"
              >
                Creating Magical Celebrations Across Hyderabad
              </motion.p>
              
              {/* loading bar */}
              <div className="w-48 h-[2px] bg-slate-100 mt-8 relative overflow-hidden">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent"
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
              className="absolute top-6 right-6 text-white hover:text-[#f59e0b] transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={filteredGallery[lightboxIndex].image}
              alt={filteredGallery[lightboxIndex].title}
              className="max-w-full max-h-[85vh] rounded-lg border border-[#f59e0b]/30 shadow-2xl object-contain"
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-[#f59e0b] text-xs uppercase tracking-widest font-semibold bg-slate-900/80 px-4 py-2 rounded-full border border-[#f59e0b]/20">
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
        scrolled ? 'friendly-glass py-4 shadow-md' : 'bg-transparent py-6'
      }`}>
        {/* Micro-thin interactive scroll progress indicator */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#f59e0b] origin-left"
          style={{ scaleX: scaleXSpring }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg p-1.5 border border-amber-200 flex items-center justify-center shrink-0">
              <VCLogo />
            </div>
            <span className="text-xl font-serif tracking-widest text-slate-900 uppercase font-bold">
              ThemeCraft <span className="text-[#f59e0b] font-sans font-light">Celebrations</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold tracking-wider text-slate-700 hover:text-[#f59e0b] transition-colors duration-300 uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop Action Button */}
          <div className="hidden lg:block">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-amber-400 via-[#f59e0b] to-amber-600 hover:shadow-md hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-[2px]"
            >
              Get Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-800 hover:text-[#f59e0b] transition-colors"
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
              className="lg:hidden friendly-glass mt-4 border-t border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4 bg-white">
                {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-700 hover:text-[#f59e0b] transition-colors uppercase tracking-wider py-2 border-b border-slate-100"
                  >
                    {item}
                  </a>
                ))}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 mt-4 rounded-full text-sm font-bold uppercase tracking-widest text-white bg-[#f59e0b]"
                >
                  Get Quote
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. FRIENDLY MODERN HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-gradient-to-b from-amber-50/50 via-white to-white">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
          <img
            src={IMAGES.hero}
            alt="ThemeCraft Birthday Backdrop"
            className="w-full h-full object-cover scale-100"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full pt-12 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 uppercase tracking-wider"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" /> Hyderabad's Trusted Birthday Planners
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-slate-900 leading-tight"
            >
              Hyderabad's Trusted <br/>
              <span className="shimmer-text">Birthday Party</span> <br/>
              Planners
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-slate-600 font-normal max-w-xl leading-relaxed"
            >
              Creative birthday themes, balloon decorations, baby showers, entertainment services, and complete party setups for unforgettable celebrations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] shadow-lg shadow-emerald-500/20 transition-all duration-300 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Get Quote on WhatsApp
              </a>
              <a 
                href="#gallery"
                className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-slate-700 border-2 border-slate-300 hover:bg-slate-50 transition-all duration-300"
              >
                View Themes
              </a>
            </motion.div>
          </div>

          {/* Friendly statistics cards on Hero */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {[
                { count: "500+", label: "Events Completed", sub: "Hyderabad wide" },
                { count: "1000+", label: "Happy Families", sub: "Meticulous setups" },
                { count: "5+ Years", label: "Elite Experience", sub: "Parent approved" },
                { count: "4.9 ★", label: "Customer Rating", sub: "Top rated reviews" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-amber-400 transition-all duration-300 hover:transform hover:-translate-y-1 friendly-shadow"
                >
                  <h3 className="text-3xl font-serif font-bold text-[#f59e0b] mb-1">{stat.count}</h3>
                  <p className="text-sm font-bold text-slate-900 tracking-wide">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Glowing yellow background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400/10 blur-[100px] z-0 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { title: "Experienced Team", icon: ShieldCheck },
              { title: "Custom Themes", icon: Sparkles },
              { title: "Affordable Packages", icon: DollarSign },
              { title: "On-Time Setup", icon: Clock },
              { title: "Premium Decorations", icon: Award },
              { title: "Family-Friendly Service", icon: Heart }
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.title} className="space-y-3 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#f59e0b]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Our Specialties</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Magical Party Services</h2>
            <p className="text-slate-500 font-normal">Crafting absolute perfection across all major home celebrations and kids entertainment themes.</p>
          </div>

          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: "Balloon Decorations", icon: Gift, desc: "A gorgeous semicircular standard arch tailored to home living room setups.", textEmoji: "🎈" },
              { title: "Birthday Themes", icon: Sparkles, desc: "Out of this world astronauts, safari, princess castle set blueprints.", textEmoji: "🎂" },
              { title: "Baby Shower Setups", icon: Heart, desc: "Ethereal pastel clouds, hot air balloon baby showers with sage leaves.", textEmoji: "👶" },
              { title: "Bouncy Castles", icon: Star, desc: "Safe, colorful high-jumping bouncing castles to keep the kids laughing.", textEmoji: "🏰" },
              { title: "Cartoon Characters", icon: Users, desc: "Familiar costume cartoon animations to play games and capture memories.", textEmoji: "🎭" },
              { title: "Tattoo Artists", icon: Clock, desc: "Stunning non-toxic kids face painting, arm painting, and glitter tattoos.", textEmoji: "🎨" },
              { title: "Magic Shows", icon: Award, desc: "Mind-blowing kid magic routines that engage families and parents.", textEmoji: "✨" },
              { title: "Popcorn Stalls", icon: Calendar, desc: "Fresh hot popcorn machine stalls complete with standard paper cones.", textEmoji: "🍿" },
              { title: "Cotton Candy", icon: Calendar, desc: "Sweet pink and blue sugar cloud candy spun live at the event.", textEmoji: "🍭" },
              { title: "Chocolate Fountain", icon: DollarSign, desc: "3-tier warm liquid chocolate fountain with fruit skewers.", textEmoji: "🍫" },
              { title: "Entertainment Services", icon: Phone, desc: "Full emcee hosts, interactive game conductors, and audio setups.", textEmoji: "🎤" },
              { title: "Surprise Decorations", icon: Heart, desc: "Beautiful candlelight pathways, terraces drapes, and organic balloons.", textEmoji: "🎁" }
            ].map((srv) => (
              <motion.div
                key={srv.title}
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-amber-400 transition-all duration-300 group relative overflow-hidden friendly-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 text-xl">
                  {srv.textEmoji}
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-[#f59e0b] transition-colors">{srv.title}</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed mb-4">{srv.desc}</p>
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#f59e0b] hover:text-amber-700"
                >
                  Book on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. BEFORE & AFTER SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Party Magic</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Before & After Decor</h2>
            <p className="text-slate-500 font-normal">Drag the slider to witness our colorful transformation of a plain empty living room into a customized theme birthday setup.</p>
          </div>

          {/* Interactive Drag Slider */}
          <div 
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-amber-300 shadow-xl select-none cursor-ew-resize friendly-shadow"
          >
            {/* After Image */}
            <img 
              src={IMAGES.after} 
              alt="Venue After Decor" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-6 right-6 z-20 bg-emerald-500/90 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Theme setup (After)
            </div>

            {/* Before Image */}
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
              <div className="absolute bottom-6 left-6 z-20 bg-amber-500/90 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Empty Space (Before)
              </div>
            </div>

            {/* Slider bar and golden handle */}
            <div 
              className="absolute top-0 bottom-0 z-30 w-1 bg-[#f59e0b] flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#f59e0b] flex items-center justify-center cursor-ew-resize slider-handle-shadow">
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DETAILED MASONRY FILTER GALLERY WITH 18+ UNIQUE EVENTS */}
      <section id="gallery" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="text-left space-y-3">
              <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Theme Catalogs (18 Unique Blueprints)</span>
              <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Magical Theme Gallery</h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 max-w-full">
              {['All', 'Birthday Themes', 'Balloon Decorations', 'Baby Showers', 'Kids Parties', 'Home Celebrations', 'Theme Decor'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGalleryFilter(filter)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    galleryFilter === filter 
                      ? 'bg-[#f59e0b] text-white' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-amber-400'
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
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 cursor-pointer shadow-md hover:shadow-xl transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[#f59e0b] text-[10px] font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-amber-300 shadow-sm">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-serif text-white font-bold mt-3">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-light mt-1 mb-3 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20am%20interested%20in%20the%20${encodeURIComponent(item.title)}%20theme.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#25d366] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Quote
                      </a>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 border border-amber-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 8. BUDGET ESTIMATOR TOOL */}
      <section id="calculator" className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-amber-800">
              Interactive Estimator
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Party Budget Calculator</h2>
            <p className="text-slate-500 font-normal">Estimate your custom birthday or baby shower package pricing instantly based on your required stalls and activities.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl grid md:grid-cols-12 gap-8 items-center friendly-shadow">
            {/* Input Selection Side */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">1. Event Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Birthday', 'Baby Shower', 'Home Decoration', 'Theme Party'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCalcType(type)}
                      className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        calcType === type 
                          ? 'bg-[#f59e0b] text-white border-[#f59e0b]' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">2. Guest Capacity</label>
                  <span className="text-xs font-bold text-slate-800">{calcGuests} Guests</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={calcGuests}
                  onChange={(e) => setCalcGuests(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">3. Package Tier Selection</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Starter Party', 'Theme Party', 'Premium Celebration'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCalcTier(tier)}
                      className={`py-2.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider transition-all border ${
                        calcTier === tier 
                          ? 'bg-[#f59e0b] text-white border-[#f59e0b]' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">4. Add-on Activities & Food Stalls</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Bouncy Castle', key: 'castle' },
                    { label: 'Magic Show', key: 'magic' },
                    { label: 'Tattoo Artist', key: 'tattoo' },
                    { label: 'Cartoon Character', key: 'cartoon' },
                    { label: 'Chocolate Fountain', key: 'chocolate' },
                    { label: 'Popcorn Stall', key: 'popcorn' },
                    { label: 'Cotton Candy', key: 'cotton' }
                  ].map((add) => (
                    <button
                      key={add.key}
                      type="button"
                      onClick={() => setCalcAddons(prev => ({ ...prev, [add.key]: !prev[add.key] }))}
                      className={`py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                        calcAddons[add.key] 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-400' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      {add.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Receipt Summary Side */}
            <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold border-b border-slate-200 pb-2">Estimated Quote</h4>
                
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Base Tier ({calcTier}):</span>
                    <span className="font-semibold text-slate-900">₹{calcTier === 'Starter Party' ? '9,999' : calcTier === 'Theme Party' ? '19,999' : '34,999'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category Factor:</span>
                    <span className="font-semibold text-slate-900">x{calcType === 'Baby Shower' ? '1.1' : calcType === 'Theme Party' ? '1.25' : '1.0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Density:</span>
                    <span className="font-semibold text-slate-900">x{calcGuests > 200 ? '1.8' : calcGuests > 100 ? '1.4' : calcGuests > 50 ? '1.2' : '1.0'}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Stalls & Magic:</span>
                    <span>+₹{Object.entries(calcAddons).reduce((acc, [k, v]) => {
                      if (!v) return acc;
                      if (k === 'castle') return acc + 6000;
                      if (k === 'magic') return acc + 5000;
                      if (k === 'tattoo') return acc + 3000;
                      if (k === 'cartoon') return acc + 4000;
                      if (k === 'chocolate') return acc + 5500;
                      if (k === 'popcorn' || k === 'cotton') return acc + 2500;
                      return acc;
                    }, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Grand Total Estimate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-serif font-bold text-slate-900">₹{displayedTotal.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400">/ approx</span>
                </div>
                
                {/* Dynamic WhatsApp Link based on Estimate */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20used%20your%20Budget%20Calculator%20and%20got%20an%20estimate%20of%20%E2%82%B9${calcTotal.toLocaleString('en-IN')}%20for%20a%20${calcTier}%20with%20${calcGuests}%20guests.%20Let's%20discuss.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-3 mt-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4.5 h-4.5" /> Book on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PACKAGES COMPARISON */}
      <section id="packages" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Investments</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Party Packages</h2>
            <p className="text-slate-500 font-normal">Choose from our family-friendly tier-based birthday party packages.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter Party */}
            <div className="bg-white p-8 rounded-3xl flex flex-col justify-between border border-slate-100 hover:border-amber-400 transition-all duration-300 friendly-shadow relative">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">Starter Package</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Starter Party</h3>
                <div className="py-2 border-y border-slate-100">
                  <span className="text-4xl font-serif font-bold text-slate-900">₹9,999</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Basic Balloon Setup (semicircular)', 'Elegant Cake Table Decoration', 'Theme Card Backdrop panels', 'Basic LED stage spotlight', '1 Assign Lead Planner on Setup'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20am%20interested%20in%20booking%20the%20Starter%20Party%20%E2%82%B99%2C999%20package.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 mt-8 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Book Starter Party
              </a>
            </div>

            {/* Theme Party */}
            <div className="bg-white p-8 rounded-3xl flex flex-col justify-between border-2 border-amber-400 hover:shadow-2xl transition-all duration-300 relative lg:transform lg:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#f59e0b] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">Standard Theme Package</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Theme Party</h3>
                <div className="py-2 border-y border-slate-100">
                  <span className="text-4xl font-serif font-bold text-slate-900">₹19,999</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Premium Customized Theme Backdrop', 'Organic Balloon Arch & Pillars', 'Cake Table Designer Styling', 'High-end Studio Spotlights', 'Candid Photography (3 Hours)', 'Dedicated lead planner assigned'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20am%20interested%20in%20booking%20the%20Theme%20Party%20%E2%82%B919%2C999%20package.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 mt-8 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Book Theme Party
              </a>
            </div>

            {/* Premium Celebration */}
            <div className="bg-white p-8 rounded-3xl flex flex-col justify-between border border-slate-100 hover:border-amber-400 transition-all duration-300 friendly-shadow relative">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">All-Inclusive Package</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Premium Celebration</h3>
                <div className="py-2 border-y border-slate-100">
                  <span className="text-4xl font-serif font-bold text-slate-900">₹34,999</span>
                </div>
                <ul className="space-y-3 pt-4">
                  {['Grand Concept Custom Themes backdrop', 'Immersive Balloon & Flower setups', 'Kids Entertainment (Magic or Puppet Show)', 'Popcorn & Cotton Candy Live Stalls', 'Face Painter / Tattoo Artist included', 'Unlimited setup coordinators'].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20ThemeCraft%20Celebrations!%20I%20am%20interested%20in%20booking%20the%20Premium%20Celebration%20%E2%82%B934%2C999%20package.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 mt-8 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Book Premium Package
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ADVANCED GENERATIVE AI PARTY PLANNER TOOL */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold bg-white px-4 py-1.5 rounded-full border border-amber-300 shadow-sm">
              ThemeCraft AI
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Advanced AI Event Assistant</h2>
            <p className="text-slate-500 font-normal">Chat instantly with our highly advanced generative planner to design custom birthdays, baby showers, home surprise décors, and anniversaries.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col min-h-[550px] friendly-shadow">
            {/* AI Assistant Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center border border-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-wide">ThemeCraft AI Planner</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Gemini-Powered Active Agent</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={resetChat}
                className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-lg"
              >
                Reset Chat
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            {chatMessages.length === 1 && (
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap gap-2.5 items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Suggest:</span>
                {[
                  "Plan a Kids Space Theme Birthday",
                  "Plan a Sage Green Baby Shower",
                  "Plan a Surprise Terrace Anniversary",
                  "Living Room Balloon Surprise Setup",
                  "Plan a Jungle Safari Kids Theme",
                  "Tell me about Hyderabad service areas"
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSendChatMessage(preset)}
                    className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 px-3 py-1.5 rounded-full transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Thread Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[350px] bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300 shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl max-w-[80%] border ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 border-slate-800 text-white rounded-tr-none' 
                      : 'bg-white border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Rich text processor formatting bullet lists and bold keywords */}
                    <div className="text-xs leading-relaxed space-y-2">
                      {msg.content.split('\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('### ')) {
                          return <h5 key={pIdx} className="text-sm font-serif font-bold text-[#f59e0b] mt-3 mb-1">{paragraph.replace('### ', '')}</h5>;
                        }
                        if (paragraph.startsWith('* ')) {
                          const cleanText = paragraph.replace('* ', '');
                          const parts = cleanText.split('**');
                          return (
                            <div key={pIdx} className="flex gap-2 pl-2">
                              <span className="text-[#f59e0b] font-bold">•</span>
                              <span>
                                {parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="font-extrabold text-[#f59e0b]">{part}</strong> : part)}
                              </span>
                            </div>
                          );
                        }
                        const parts = paragraph.split('**');
                        return (
                          <p key={pIdx}>
                            {parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="font-extrabold text-[#f59e0b]">{part}</strong> : part)}
                          </p>
                        );
                      })}
                    </div>

                    {/* Packaged Action Quote trigger button inside chat */}
                    {msg.whatsappLink && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <a 
                          href={msg.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white bg-[#25d366] hover:bg-[#1ebd54] flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Book Blueprint Now
                        </a>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0 shadow-sm text-white text-[10px] font-bold uppercase tracking-wider font-serif">
                      ME
                    </div>
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <div className="flex items-start gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300 shrink-0">
                    <Sparkles className="w-4 h-4 text-[#f59e0b] animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1 items-center py-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Chat input form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(chatInput); }}
              className="bg-slate-50 p-4 border-t border-slate-100 flex gap-3 items-center"
            >
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask ThemeCraft AI to plan your baby shower, terrace surprise, anniversary, or custom kids party..."
                className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-xs text-slate-850 rounded-2xl focus:border-amber-400 focus:outline-none shadow-inner"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 11. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Feedback</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Happy Hyderabad Families</h2>
            <p className="text-slate-500 font-normal">Read genuine local parent reviews from Gachibowli, Jubilee Hills, and Kondapur.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {reviews.map((test) => (
              <div 
                key={test.name + test.location}
                className="bg-white p-6 rounded-3xl border border-slate-100 friendly-shadow hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-[#f59e0b]">
                    {Array.from({ length: test.rate }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed italic mb-6">"{test.quote}"</p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{test.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{test.role} • {test.location}</p>
                    <span className="text-[8px] uppercase tracking-wider text-amber-600 font-bold block mt-0.5">{test.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Feedback submission form */}
          <div className="mt-16 max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
            
            <div className="relative space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#f59e0b] animate-bounce" />
                <h3 className="text-lg font-serif font-bold text-slate-900">Share Your Magical Experience!</h3>
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Hyderabad parents, did we craft magical memories for your family? Leave a live review below to instantly post it on our wall!
              </p>

              {reviewSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-2xl text-center space-y-2"
                >
                  <p className="text-sm font-bold">🎉 Review Posted Live Successfully!</p>
                  <p className="text-xs font-light">Thank you! Your wonderful testimonial is now displayed dynamically in our parent reviews board.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Priya Reddy"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Your Role / Vibe</label>
                      <input 
                        type="text" 
                        required
                        value={newReview.role}
                        onChange={(e) => setNewReview(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g. Parent of 2yo / Mother of Bride"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Hyderabad Area</label>
                      <input 
                        type="text" 
                        required
                        value={newReview.location}
                        onChange={(e) => setNewReview(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Jubilee Hills / Madhapur"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Event Setup Type</label>
                      <input 
                        type="text" 
                        value={newReview.type}
                        onChange={(e) => setNewReview(prev => ({ ...prev, type: e.target.value }))}
                        placeholder="e.g. Oh Baby Shower / Jungle Safari Theme"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Rating</label>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rate: star }))}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= newReview.rate 
                                ? 'fill-[#f59e0b] text-[#f59e0b]' 
                                : 'text-slate-300 fill-transparent'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[10px] text-slate-500 ml-2 font-bold uppercase tracking-wider">({newReview.rate} Stars)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Review Comments</label>
                    <textarea 
                      required
                      rows={3}
                      value={newReview.quote}
                      onChange={(e) => setNewReview(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="ThemeCraft Celebrations turned our living room into a magical sky..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-amber-400 focus:outline-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full text-center py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md"
                  >
                    Post Testimonial Live
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Got Questions?</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-normal">Everything you need to know about our Hyderabad birthday balloon setup services.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How early should I book my birthday party with ThemeCraft?", a: "We recommend booking 2 to 3 weeks in advance for standard balloon decoration setups and theme parties. For custom tailored large scale theme celebrations or during heavy weekend dates, booking 4 weeks in advance ensures guaranteed on-time setup." },
              { q: "Can the birthday themes and balloon setups be customized?", a: "Absolutely! We specialize in tailored concept setups. You can choose your child's favorite cartoon characters, colors, and visual layouts. We design completely custom backdrop cards and table styling." },
              { q: "Do you provide home decorations and living room balloon arches?", a: "Yes, home celebrations and living room birthday balloon decor setups are our core specialty! We design Semispherical arches and backdrop panels tailored precisely to living room dimensions across apartments and villas." },
              { q: "Do you provide entertainment services (Magic Shows, Cartoon Characters)?", a: "Yes, we handle complete entertainment coordination! We provide professional kid-safe magicians, cartoon character mascots (like Mickey, Minions, CoComelon), professional face painting/tattoo artists, bouncy castles, popcorn machines, and cotton candy stalls." },
              { q: "What areas in Hyderabad do you serve?", a: "We provide complete birthday setups and balloon decorations across Hyderabad, serving Jubilee Hills, Banjara Hills, Gachibowli, Kondapur, Madhapur, Begumpet, Secunderabad, Kukatpally, Miyapur, Manikonda, and surrounding residential colonies." },
              { q: "Can I book my event directly on WhatsApp?", a: "Yes, we are a WhatsApp-first brand! You can click any WhatsApp link on this site to chat directly with our planner directors, select themes, receive invoices, and confirm bookings in less than 5 minutes." }
            ].map((faq) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={faq.q} className="bg-white rounded-2xl overflow-hidden border border-slate-200 friendly-shadow">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 text-left flex items-center justify-between text-slate-900 hover:text-[#f59e0b] transition-colors"
                  >
                    <span className="font-serif font-bold text-sm md:text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#f59e0b] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
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

      {/* 13. CONTACT SECTION WITH HYDERABAD MAP */}
      <section id="contact" className="py-24 bg-white relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[#f59e0b] text-sm uppercase tracking-widest font-bold">Start Planning</span>
              <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-slate-900">Let's Design Magic</h2>
              <p className="text-slate-500 font-normal">Ready to host an unforgettable birthday or baby shower? Get a free quote on WhatsApp or schedule a call with Hyderabad's favorite planners.</p>
            </div>

            <div className="space-y-6 pt-4">
              {/* WhatsApp CTA */}
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-emerald-50 border border-emerald-300 p-4 rounded-2xl hover:bg-emerald-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white shrink-0 shadow-md">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">WhatsApp Planner Director</p>
                  <p className="text-sm font-extrabold text-[#25d366] group-hover:underline">{WHATSAPP_DISPLAY}</p>
                </div>
              </a>

              <a 
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl hover:bg-slate-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Call Now</p>
                  <p className="text-sm font-extrabold text-slate-800 group-hover:underline">{WHATSAPP_DISPLAY}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ThemeCraft Hyderabad Studio</p>
                  <p className="text-sm font-bold text-slate-800">Plot 124, Gachibowli Main Rd, near DLF Cybercity, Hyderabad, Telangana</p>
                </div>
              </div>
            </div>

            {/* Google Maps Hyderabad Placeholder Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100 relative shadow-sm">
              <div className="absolute inset-0 bg-slate-950/20 z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-25 p-4 text-center space-y-1">
                <MapPin className="w-8 h-8 text-[#f59e0b]" />
                <span className="text-xs text-slate-800 font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm">DLF Gachibowli, Hyderabad</span>
                <span className="text-[9px] text-slate-500">Serving all luxury and family colonies across Hyderabad</span>
              </div>
              <div className="w-full h-full opacity-35 bg-cover animate-pulse" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')` }} />
            </div>
          </div>

          {/* Inquiry Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative friendly-shadow">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Aishwarya Rao"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. aishwarya@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Event Type</label>
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        >
                          <option value="Birthday">Birthday Party</option>
                          <option value="Kids Theme">Kids Birthday Theme</option>
                          <option value="Baby Shower">Baby Shower Setup</option>
                          <option value="Home Decoration">Home Balloon Decor</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        >
                          <option value="">Select Budget</option>
                          <option value="Starter">₹9,999 – ₹15,000</option>
                          <option value="Theme">₹15,000 – ₹25,000</option>
                          <option value="Premium">₹25,000 +</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Event Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-400 text-xs focus:border-[#f59e0b] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Est. Guests</label>
                        <input
                          type="number"
                          value={formData.guests}
                          onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                          placeholder="e.g. 100"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">Special Balloon Colors / Custom Theme Request</label>
                      <textarea
                        rows="3"
                        value={formData.requirements}
                        onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                        placeholder="e.g. 'CoComelon organic balloon semicircle arch with character cutouts in Gachibowli home...'"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-850 text-xs focus:border-[#f59e0b] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#f59e0b] hover:bg-amber-600 shadow-md transition-all duration-300"
                    >
                      Request Call & Free Quote
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#f59e0b] flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-[#f59e0b]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">Inquiry Received!</h3>
                    <p className="text-xs text-slate-600 font-normal max-w-md mx-auto leading-relaxed">
                      Thank you, **{formData.name}**. Our birthday planning directors have received your request for a {formData.eventType || 'birthday'} celebration and will WhatsApp you or call you on **{formData.phone}** within 2 hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-[#f59e0b] hover:text-amber-700 underline transition-colors"
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
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:bg-slate-800 transition-colors"
              >
                <span>Call Now</span>
                <Phone className="w-4 h-4 text-[#f59e0b]" />
              </a>

              {/* Get Quote */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActionMenuOpen(false)}
                className="flex items-center gap-2 bg-[#f59e0b] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-amber-600 transition-colors"
              >
                <span>Get Quote</span>
                <Sparkles className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Action Button */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl border border-emerald-400/30 transition-all duration-300 relative group animate-bounce"
          style={{ animationDuration: '3.5s' }}
        >
          <MessageSquare className="w-6 h-6" />
          
          <span className="absolute right-16 bg-slate-900 border border-[#f59e0b]/35 text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            WhatsApp Planners
          </span>
        </a>
      </div>

      {/* 14. PREMIUM FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-850 p-2.5 rounded-xl border border-amber-300/30 flex items-center justify-center mb-3">
              <VCLogo />
            </div>
            <span className="text-lg font-serif font-bold text-white uppercase tracking-widest block">
              ThemeCraft <span className="text-[#f59e0b]">Celebrations</span>
            </span>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Hyderabad's favorite family planners. We design creative birthday themes, gorgeous balloon decorations, baby showers, and complete kids party stalls.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { name: 'instagram', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                )},
                { name: 'facebook', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                )},
                { name: 'youtube', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                  </svg>
                )}
              ].map((social) => (
                <a key={social.name} href="#" className="w-8 h-8 rounded-full bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#f59e0b] hover:border-[#f59e0b] transition-all">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Home', 'Services', 'Gallery', 'Packages', 'Calculator', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">Our Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Kids Birthday Planning', 'Helium Balloon Arch', 'Oh Baby Sage Showers', 'Surprise Terrace Setup', 'Home Balloon Decor'].map((srv) => (
                <li key={srv}>
                  <a href="#services" className="hover:text-white transition-colors">{srv}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">Newsletter Subscription</h4>
            <p className="text-xs text-slate-400 font-light">Join our exclusive mailing list for creative birthday decoration ideas and trends.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter parent email" 
                className="w-full px-3 py-2 rounded-lg bg-slate-850 border border-slate-800 text-slate-200 text-xs focus:border-[#f59e0b] focus:outline-none"
              />
              <button className="px-4 py-2 bg-[#f59e0b] hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} ThemeCraft Celebrations. All Rights Reserved.</span>
          <span>Creating Magical Celebrations Across Hyderabad</span>
        </div>
      </footer>
    </>
  );
}
