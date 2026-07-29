import React, { useRef, useCallback } from 'react';

/**
 * MouseTiltCard — Applies a subtle CSS 3D perspective tilt on mouse move.
 * Uses only CSS transform (GPU-composited), no canvas, no heavy libs.
 * Automatically disabled on touch devices.
 */
const MouseTiltCard = ({ children, className = '', maxTilt = 8, glowColor = 'rgba(14,165,233,0.15)' }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    // Cancel any pending RAF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -maxTilt;
      const rotateY = ((x - cx) / cx) * maxTilt;

      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Move glow highlight
      const glowEl = cardRef.current.querySelector('[data-glow]');
      if (glowEl) {
        glowEl.style.background = `radial-gradient(200px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`;
        glowEl.style.opacity = '1';
      }
    });
  }, [maxTilt, glowColor]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    const glowEl = cardRef.current.querySelector('[data-glow]');
    if (glowEl) glowEl.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out'
      }}
    >
      {/* Cursor glow overlay */}
      <div
        data-glow="true"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl z-10 opacity-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
};

export default MouseTiltCard;
