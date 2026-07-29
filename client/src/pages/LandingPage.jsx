import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  TrendingDown,
  AlertCircle,
  History,
  Heart,
  MessageSquare,
  PlaneTakeoff,
  MapPin,
  Calendar,
  Users,
  Plane,
  BarChart3,
  Bookmark,
  Bot,
  Wallet,
  ArrowRight,
  Zap,
  Globe,
  Star
} from 'lucide-react';

import ScrollReveal, { ScrollRevealGroup } from '../components/ui/ScrollReveal';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import MouseTiltCard from '../components/ui/MouseTiltCard';
import FlightPathSVG from '../components/ui/FlightPathSVG';
import HeroGlobe from '../components/ui/HeroGlobe';
import FloatingIcons from '../components/ui/FloatingIcons';

/* ─── Feature card data ──────────────────────── */
const features = [
  {
    Icon: Sparkles,
    spinner: 'brain',
    color: 'sky',
    title: 'AI Flight Recommendation',
    desc: 'Gemini AI compares price, layovers, and duration to pick the single best-value flight for you.'
  },
  {
    Icon: TrendingDown,
    spinner: 'plane',
    color: 'emerald',
    title: 'Cheapest Flight Finder',
    desc: 'Instantly highlights the absolute lowest fare available for your route and dates.'
  },
  {
    Icon: AlertCircle,
    spinner: 'cube',
    color: 'yellow',
    title: 'Book Now or Wait',
    desc: 'Smart price analysis tells you whether to buy today or hold off for a better deal.'
  },
  {
    Icon: History,
    spinner: 'bookmark',
    color: 'purple',
    title: 'Search History',
    desc: 'Auto-tracks past searches so you can re-run them and spot price changes instantly.'
  },
  {
    Icon: Heart,
    spinner: 'heart',
    color: 'red',
    title: 'Favorite Flights',
    desc: 'Save specific flights with one click to monitor and compare them from your profile.'
  },
  {
    Icon: MessageSquare,
    spinner: 'robot',
    color: 'blue',
    title: 'AI Travel Assistant',
    desc: 'Chat 24/7 to get packing guides, destination insights, airline comparisons, and more.'
  }
];

/* ─── Feature spinner (pure CSS) ────────────── */
const colorMap = {
  sky:    { text: 'text-skyAccent-light',   bg: 'bg-skyAccent/10',     border: 'border-skyAccent/20',     glow: 'rgba(14,165,233,0.15)' },
  emerald:{ text: 'text-emeraldAccent-light',bg: 'bg-emeraldAccent/10',border: 'border-emeraldAccent/20', glow: 'rgba(16,185,129,0.15)' },
  yellow: { text: 'text-yellow-400',         bg: 'bg-yellow-500/10',    border: 'border-yellow-500/20',    glow: 'rgba(245,158,11,0.15)' },
  purple: { text: 'text-purple-400',         bg: 'bg-purple-500/10',    border: 'border-purple-500/20',    glow: 'rgba(168,85,247,0.15)' },
  red:    { text: 'text-red-400',            bg: 'bg-red-500/10',       border: 'border-red-500/20',       glow: 'rgba(239,68,68,0.15)'  },
  blue:   { text: 'text-blue-400',           bg: 'bg-blue-500/10',      border: 'border-blue-500/20',      glow: 'rgba(59,130,246,0.15)' }
};

const FeatureCard = ({ Icon, color, title, desc, index }) => {
  const { text, bg, border, glow } = colorMap[color] || colorMap.sky;
  return (
    <MouseTiltCard glowColor={glow} className="h-full">
      <div className={`glass-panel p-6 border ${border} text-left flex flex-col gap-4 h-full group hover:shadow-lg transition-shadow duration-300`}>
        {/* Animated icon container */}
        <div className={`relative w-14 h-14 rounded-xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          style={{ animation: 'glow-pulse 3s ease-in-out infinite', animationDelay: `${index * 0.5}s` }}
        >
          <Icon className={`w-7 h-7 ${text}`} />
          {/* Subtle rotation ring */}
          <div
            className={`absolute inset-0 rounded-xl border ${border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            style={{ animation: 'feature-spin 6s linear infinite' }}
          />
        </div>
        <h3 className={`text-lg font-bold text-white group-hover:${text} transition-colors duration-200`}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-grow">{desc}</p>
        <div className={`flex items-center gap-1 text-xs font-semibold ${text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          Learn more <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </MouseTiltCard>
  );
};

/* ─── Stats data ─────────────────────────────── */
const stats = [
  { target: 50000, suffix: '+', label: 'Flights Indexed', icon: Plane,     color: 'text-skyAccent-light' },
  { target: 11,    suffix: '',  label: 'Global Cities',   icon: Globe,     color: 'text-emeraldAccent-light' },
  { target: 100,   suffix: '%', label: 'AI-Powered',      icon: Zap,       color: 'text-yellow-400' },
  { target: 3,     suffix: '',  label: 'Travel Classes',  icon: Star,      color: 'text-purple-400' }
];

/* ─── Destination data ───────────────────────── */
const destinations = [
  { name: 'Dubai',    price: 360, image: 'https://images.unsplash.com/photo-1465153696025-241215b9f4d0?auto=format&fit=crop&w=600&q=80' },
  { name: 'London',   price: 480, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tokyo',    price: 790, image: 'https://images.unsplash.com/photo-1526481280691-3c061aebac80?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paris',    price: 420, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { name: 'Istanbul', price: 390, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sydney',   price: 950, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80' }
];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();

  const [from, setFrom]               = useState('');
  const [to, setTo]                   = useState('');
  const [departureDate, setDeparture] = useState('');
  const [returnDate, setReturn]       = useState('');
  const [passengers, setPassengers]   = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate) return;
    let q = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departureDate=${departureDate}&passengers=${passengers}`;
    if (returnDate) q += `&returnDate=${returnDate}`;
    navigate(`/search${q}`);
  };

  const handleDestClick = (name) => {
    setFrom('Karachi');
    setTo(name);
    setDeparture('2026-08-12');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Hero stagger variants */
  const heroContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const heroChild = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="space-y-28 pb-20">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative pt-8 min-h-[540px]">

        {/* Floating travel icons — absolute positioned, pointer-events:none */}
        <FloatingIcons />

        {/* Hero airplane fly-through */}
        <div className="hero-airplane" aria-hidden="true">
          <PlaneTakeoff className="w-12 h-12 text-skyAccent" />
        </div>

        {/* Extra background glow orbs for hero */}
        <div
          className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-0 -z-10 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
          aria-hidden="true"
        />

        {/* Hero two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* ── Left Column: Text + CTA ── */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="space-y-7 text-left"
          >
            {/* Badge */}
            <motion.div variants={heroChild}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-skyAccent-light tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-skyAccent-light animate-pulse" />
                Next-Gen AI Flight Advisor
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={heroChild}
              className="text-5xl sm:text-6xl font-extrabold tracking-tight font-sans leading-tight"
            >
              Find the Best <br />
              Flight Deals with{' '}
              <span className="text-gradient-dual">AI</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p variants={heroChild} className="text-slate-300 text-lg leading-relaxed max-w-xl">
              Compare ticket rates, analyze real-time pricing trends, and receive smart booking
              recommendations backed by Google Gemini AI.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={heroChild} className="flex items-center gap-4">
              <button
                onClick={() => navigate('/search')}
                className="glass-btn-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide shadow-xl shadow-skyAccent/25"
              >
                Start Searching
              </button>
              <button
                onClick={() => navigate('/register')}
                className="glass-btn-secondary px-6 py-3.5 text-sm flex items-center gap-2"
              >
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={heroChild} className="flex items-center gap-6 pt-2">
              {[
                { label: '50K+ Flights', color: 'text-skyAccent-light' },
                { label: 'Gemini AI', color: 'text-emeraldAccent-light' },
                { label: 'Free Forever', color: 'text-purple-400' }
              ].map(({ label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Column: SVG Globe ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <HeroGlobe className="w-[360px] h-[360px]" />
          </motion.div>
        </div>

        {/* ── Search Bar Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 max-w-5xl mx-auto glass-panel p-6 sm:p-8 border border-white/10 relative"
        >
          {/* Subtle top gradient border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-skyAccent/40 to-transparent rounded-t-2xl" />

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* From */}
            <div className="md:col-span-3 space-y-2 text-left">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider flex items-center gap-1.5 ml-1">
                <MapPin className="w-3.5 h-3.5 text-skyAccent" /> From
              </label>
              <input type="text" placeholder="Origin (e.g. Karachi)" value={from} onChange={e => setFrom(e.target.value)} required className="w-full glass-input" />
            </div>
            {/* To */}
            <div className="md:col-span-3 space-y-2 text-left">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider flex items-center gap-1.5 ml-1">
                <MapPin className="w-3.5 h-3.5 text-emeraldAccent" /> To
              </label>
              <input type="text" placeholder="Destination (e.g. Dubai)" value={to} onChange={e => setTo(e.target.value)} required className="w-full glass-input" />
            </div>
            {/* Depart */}
            <div className="md:col-span-2 space-y-2 text-left">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider flex items-center gap-1.5 ml-1">
                <Calendar className="w-3.5 h-3.5 text-skyAccent" /> Depart
              </label>
              <input type="date" value={departureDate} onChange={e => setDeparture(e.target.value)} required className="w-full glass-input" />
            </div>
            {/* Return */}
            <div className="md:col-span-2 space-y-2 text-left">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider flex items-center gap-1.5 ml-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Return
              </label>
              <input type="date" value={returnDate} onChange={e => setReturn(e.target.value)} className="w-full glass-input" />
            </div>
            {/* Pax */}
            <div className="md:col-span-1 space-y-2 text-left">
              <label className="text-xs font-medium uppercase text-slate-400 tracking-wider flex items-center gap-1.5 ml-1">
                <Users className="w-3.5 h-3.5 text-skyAccent" /> Pax
              </label>
              <input type="number" min="1" max="9" value={passengers} onChange={e => setPassengers(parseInt(e.target.value))} required className="w-full glass-input py-3 text-center" />
            </div>
            {/* Search button */}
            <div className="md:col-span-1">
              <button type="submit" className="w-full glass-btn-primary py-3.5 px-0 flex items-center justify-center shadow-xl shadow-skyAccent/30">
                <Search className="w-5 h-5 text-navy-950 font-bold" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Animated Flight Path ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <FlightPathSVG from={from || 'Your City'} to={to || 'Destination'} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          ANIMATED STATS ROW
      ══════════════════════════════════════════ */}
      <section>
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ target, suffix, label, icon: IconComp, color }, i) => (
              <div
                key={label}
                className="glass-panel p-6 border border-white/5 text-center stat-card-hover relative overflow-hidden group"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-skyAccent/5 group-hover:to-emeraldAccent/5 transition-all duration-500 rounded-2xl" />
                <IconComp className={`w-6 h-6 ${color} mx-auto mb-3`} />
                <p className={`text-3xl font-black ${color}`}>
                  <AnimatedCounter target={target} suffix={suffix} duration={1600} />
                </p>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="space-y-14">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emeraldAccent/10 border border-emeraldAccent/20 text-xs font-semibold text-emeraldAccent-light tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" /> Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3">Smart Travel Analytics</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Packed with industry-leading tools designed to maximize savings and simplify trip planning.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={index * 0.08}>
              <FeatureCard {...feat} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <ScrollReveal animation="scale-in">
        <div className="glass-panel border border-skyAccent/20 p-10 text-center space-y-6 relative overflow-hidden">
          {/* Background gradient mesh */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #0ea5e9 100%)',
              backgroundSize: '200% 200%',
              animation: 'mesh-shift 6s ease infinite'
            }}
          />
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold text-white">Ready to Find Your Perfect Flight?</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Join thousands of travelers using FareWise AI to save on every booking.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="glass-btn-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide shadow-2xl shadow-skyAccent/30"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/search')}
                className="glass-btn-secondary px-6 py-3.5 text-sm"
              >
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ══════════════════════════════════════════
          POPULAR DESTINATIONS
      ══════════════════════════════════════════ */}
      <section className="space-y-14">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-skyAccent/10 border border-skyAccent/20 text-xs font-semibold text-skyAccent-light tracking-wide uppercase">
              <Globe className="w-3.5 h-3.5" /> Popular Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3">Explore Top Cities</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Click any destination to pre-fill your search. Prices updated from live flight data.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, index) => (
            <ScrollReveal key={index} animation="scale-in" delay={index * 0.07}>
              <MouseTiltCard
                glowColor="rgba(14,165,233,0.1)"
                className="h-full cursor-pointer"
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDestClick(dest.name)}
                  className="glass-panel overflow-hidden border border-white/5 group hover:border-skyAccent/20 h-full"
                >
                  {/* Image with parallax-style hover zoom */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={`${dest.name} skyline`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                    {/* City name */}
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white tracking-wide">{dest.name}</h3>
                    </div>
                    {/* Hover CTA badge */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <span className="px-2.5 py-1 rounded-lg bg-skyAccent text-navy-950 text-[10px] font-black uppercase tracking-wider">
                        Search →
                      </span>
                    </div>
                  </div>

                  {/* Price footer */}
                  <div className="p-4 flex justify-between items-center bg-navy-900/30">
                    <span className="text-slate-400 text-sm flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-skyAccent-light" />
                      Starting Price
                    </span>
                    <span className="text-lg font-extrabold text-emeraldAccent-light">
                      from ${dest.price}
                    </span>
                  </div>
                </motion.div>
              </MouseTiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
