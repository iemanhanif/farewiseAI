import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * FlightPathSVG — Lightweight pure-SVG animated curved flight path.
 * Uses CSS stroke-dashoffset animation (GPU composited, zero JS overhead).
 *
 * @param {string} from - origin city label
 * @param {string} to - destination city label
 * @param {string} color - stroke color (default sky blue)
 */
const FlightPathSVG = ({ from = 'Origin', to = 'Destination', color = '#0ea5e9', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label={`Flight path from ${from} to ${to}`}
      >
        {/* Defs for glow filter */}
        <defs>
          <filter id="glow-fp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint background arc */}
        <path
          d="M 40 95 Q 200 10 360 95"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="6 5"
          fill="none"
        />

        {/* Animated main arc */}
        <path
          d="M 40 95 Q 200 10 360 95"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="450"
          strokeDashoffset={isInView ? '0' : '450'}
          fill="none"
          filter="url(#glow-fp)"
          style={{
            transition: isInView ? 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' : 'none',
            willChange: 'stroke-dashoffset'
          }}
        />

        {/* Origin dot — pulsing */}
        <circle cx="40" cy="95" r="5" fill={color} filter="url(#glow-dot)" />
        <circle
          cx="40"
          cy="95"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          style={{
            animation: 'svg-pulse 2s ease-in-out infinite',
            transformOrigin: '40px 95px'
          }}
        />

        {/* Destination dot — pulsing with delay */}
        <circle cx="360" cy="95" r="5" fill="#10b981" filter="url(#glow-dot)" />
        <circle
          cx="360"
          cy="95"
          r="10"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          style={{
            animation: 'svg-pulse 2s ease-in-out 0.5s infinite',
            transformOrigin: '360px 95px'
          }}
        />

        {/* Animated airplane along the path */}
        <g
          style={{
            offsetPath: "path('M 40 95 Q 200 10 360 95')",
            offsetRotate: 'auto',
            animation: isInView ? 'fly-along-path 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s forwards' : 'none',
            opacity: isInView ? 1 : 0
          }}
        >
          {/* Simple airplane glyph */}
          <g transform="translate(-8, -8)">
            <path
              d="M8 0 L10 5 L16 5 L16 7 L10 7 L8.5 12 L12 12 L12 14 L5 14 L5 12 L8 12 L6 7 L0 7 L0 5 L6 5 Z"
              fill={color}
              opacity="0.9"
              transform="rotate(-45, 8, 7)"
            />
          </g>
        </g>

        {/* City labels */}
        <text
          x="40"
          y="115"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          {from}
        </text>
        <text
          x="360"
          y="115"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
        >
          {to}
        </text>
      </svg>
    </div>
  );
};

export default FlightPathSVG;
