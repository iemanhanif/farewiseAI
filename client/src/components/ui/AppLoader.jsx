import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AppLoader — Lightweight CSS-only loading screen shown for 1.5s on first mount.
 * Uses SVG globe + CSS airplane orbit. No Three.js/canvas — pure CSS animations.
 * Fades out smoothly after 1.5s or when onComplete is called.
 */
const AppLoader = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
    }, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="app-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, #0b132b 0%, #070a13 100%)'
          }}
        >
          {/* Morphing background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="loader-orb loader-orb--sky" />
            <div className="loader-orb loader-orb--emerald" />
          </div>

          {/* Globe + airplane orbit assembly */}
          <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
            {/* SVG Globe */}
            <svg
              viewBox="0 0 120 120"
              className="w-28 h-28 absolute"
              style={{ animation: 'globe-spin 8s linear infinite' }}
            >
              <defs>
                <radialGradient id="globe-grad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0b132b" stopOpacity="0.05" />
                </radialGradient>
                <filter id="globe-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <clipPath id="globe-clip">
                  <circle cx="60" cy="60" r="52" />
                </clipPath>
              </defs>

              {/* Globe body */}
              <circle cx="60" cy="60" r="52" fill="url(#globe-grad)" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.6" filter="url(#globe-glow)" />

              {/* Latitude lines */}
              {[-30, 0, 30].map((lat, i) => {
                const y = 60 + (lat / 90) * 50;
                const rx = Math.sqrt(Math.max(0, 52 * 52 - (y - 60) * (y - 60)));
                return <ellipse key={i} cx="60" cy={y} rx={rx} ry={rx * 0.22} fill="none" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.25" clipPath="url(#globe-clip)" />;
              })}

              {/* Longitude lines */}
              {[0, 45, 90, 135].map((lng, i) => (
                <ellipse key={i} cx="60" cy="60" rx={52 * Math.abs(Math.cos((lng * Math.PI) / 180))} ry="52" fill="none" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.2" clipPath="url(#globe-clip)" />
              ))}

              {/* Glowing city dots */}
              <circle cx="60" cy="35" r="3" fill="#10b981" filter="url(#globe-glow)" />
              <circle cx="82" cy="55" r="2.5" fill="#0ea5e9" filter="url(#globe-glow)" />
              <circle cx="40" cy="68" r="2" fill="#10b981" filter="url(#globe-glow)" />
              <circle cx="70" cy="72" r="2" fill="#38bdf8" filter="url(#globe-glow)" />
            </svg>

            {/* Orbiting airplane ring */}
            <div
              className="absolute"
              style={{
                width: 160,
                height: 160,
                animation: 'plane-orbit 2.8s linear infinite',
                transformOrigin: 'center'
              }}
            >
              <div
                className="absolute"
                style={{ top: 0, left: '50%', transform: 'translateX(-50%) translateY(-12px)' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#0ea5e9">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Brand + progress */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center space-y-4"
          >
            <h1 className="text-2xl font-bold tracking-tight text-white">
              FareWise<span className="text-skyAccent">.AI</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
              Initializing your travel advisor
            </p>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0ea5e9, #10b981)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppLoader;
