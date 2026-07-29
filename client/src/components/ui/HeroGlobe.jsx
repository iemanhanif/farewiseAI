import React from 'react';

/**
 * HeroGlobe — A decorative SVG globe for the hero section.
 * Lightweight: pure SVG with CSS animation for rotation.
 * No canvas, no Three.js.
 */
const HeroGlobe = ({ className = '' }) => {
  return (
    <div className={`relative select-none ${className}`} aria-hidden="true">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full hero-globe-glow" />

      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="hg-body" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#1c4a6e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0b1a35" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#070a13" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="hg-highlight" cx="30%" cy="25%" r="45%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <filter id="hg-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="hg-dot-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="hg-clip">
            <circle cx="160" cy="160" r="140" />
          </clipPath>
        </defs>

        {/* Globe body */}
        <circle cx="160" cy="160" r="140" fill="url(#hg-body)" />
        
        {/* Hemisphere highlight */}
        <circle cx="160" cy="160" r="140" fill="url(#hg-highlight)" />

        {/* Globe border */}
        <circle cx="160" cy="160" r="140" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.35" filter="url(#hg-glow)" />

        {/* Latitude lines — clipped to globe */}
        <g clipPath="url(#hg-clip)" style={{ animation: 'globe-lines-spin 12s linear infinite' }}>
          {[-100, -60, -20, 20, 60, 100].map((offset, i) => {
            const y = 160 + offset;
            const maxR = 140;
            const rx = Math.sqrt(Math.max(0, maxR * maxR - offset * offset));
            return (
              <ellipse
                key={`lat-${i}`}
                cx="160"
                cy={y}
                rx={rx}
                ry={rx * 0.28}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.7"
                strokeOpacity={i === 2 || i === 3 ? 0.35 : 0.15}
                strokeDasharray={i === 2 || i === 3 ? 'none' : '4 3'}
              />
            );
          })}

          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((angle, i) => {
            const radians = (angle * Math.PI) / 180;
            const rx = Math.abs(Math.cos(radians)) * 140;
            return (
              <ellipse
                key={`lng-${i}`}
                cx="160"
                cy="160"
                rx={rx}
                ry="140"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.7"
                strokeOpacity="0.12"
              />
            );
          })}

          {/* Continent-like landmass blobs (simplified) */}
          <ellipse cx="130" cy="120" rx="38" ry="28" fill="#0ea5e9" fillOpacity="0.07" />
          <ellipse cx="195" cy="145" rx="28" ry="20" fill="#10b981" fillOpacity="0.06" />
          <ellipse cx="155" cy="195" rx="22" ry="14" fill="#0ea5e9" fillOpacity="0.05" />
          <ellipse cx="100" cy="175" rx="16" ry="12" fill="#10b981" fillOpacity="0.05" />
          <ellipse cx="220" cy="110" rx="14" ry="18" fill="#0ea5e9" fillOpacity="0.06" />
        </g>

        {/* City dots (not clipped so they glow over edge) */}
        {/* Dubai */}
        <circle cx="200" cy="150" r="5" fill="#10b981" filter="url(#hg-dot-glow)" style={{ animation: 'city-pulse 2.4s ease-in-out infinite' }} />
        {/* London */}
        <circle cx="135" cy="110" r="4.5" fill="#0ea5e9" filter="url(#hg-dot-glow)" style={{ animation: 'city-pulse 2.4s ease-in-out 0.6s infinite' }} />
        {/* Tokyo */}
        <circle cx="240" cy="130" r="4" fill="#38bdf8" filter="url(#hg-dot-glow)" style={{ animation: 'city-pulse 2.4s ease-in-out 1.1s infinite' }} />
        {/* Istanbul */}
        <circle cx="175" cy="120" r="3.5" fill="#10b981" filter="url(#hg-dot-glow)" style={{ animation: 'city-pulse 2.4s ease-in-out 1.8s infinite' }} />
        {/* NY */}
        <circle cx="90" cy="140" r="4" fill="#0ea5e9" filter="url(#hg-dot-glow)" style={{ animation: 'city-pulse 2.4s ease-in-out 0.3s infinite' }} />

        {/* Animated flight arc: London → Dubai */}
        <path
          d="M 135 110 Q 165 85 200 150"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="0"
          fill="none"
          filter="url(#hg-glow)"
          style={{ animation: 'arc-dash 3.5s ease-in-out 0.5s infinite' }}
        />
        {/* Flight arc: Istanbul → Tokyo */}
        <path
          d="M 175 120 Q 210 90 240 130"
          stroke="#10b981"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="90"
          strokeDashoffset="0"
          fill="none"
          filter="url(#hg-glow)"
          style={{ animation: 'arc-dash 3.5s ease-in-out 1.5s infinite' }}
        />

        {/* Equator */}
        <ellipse cx="160" cy="160" rx="140" ry="38" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.4" />

        {/* Atmosphere ring */}
        <circle cx="160" cy="160" r="148" fill="none" stroke="#0ea5e9" strokeWidth="6" strokeOpacity="0.05" />
        <circle cx="160" cy="160" r="154" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeOpacity="0.03" />
      </svg>
    </div>
  );
};

export default HeroGlobe;
