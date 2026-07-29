import React, { useRef, useEffect } from 'react';
import { Plane, MapPin, Compass, Globe, Ticket } from 'lucide-react';

/**
 * FloatingIcons — Floating travel-themed icons that gently react to mouse movement.
 * Uses CSS transforms only. Mouse parallax via requestAnimationFrame.
 */
const ICONS = [
  { Icon: Plane,    color: '#0ea5e9', size: 22, top: '8%',  left: '5%',  delay: 0,    depth: 0.02, floatDelay: '0s' },
  { Icon: Globe,    color: '#10b981', size: 20, top: '15%', left: '88%', delay: 0.3,  depth: 0.015, floatDelay: '0.8s' },
  { Icon: MapPin,   color: '#38bdf8', size: 18, top: '70%', left: '6%',  delay: 0.6,  depth: 0.025, floatDelay: '1.4s' },
  { Icon: Compass,  color: '#0ea5e9', size: 24, top: '60%', left: '90%', delay: 0.9,  depth: 0.018, floatDelay: '2.1s' },
  { Icon: Ticket,   color: '#10b981', size: 16, top: '38%', left: '3%',  delay: 1.2,  depth: 0.012, floatDelay: '0.5s' },
  { Icon: Plane,    color: '#34d399', size: 16, top: '82%', left: '80%', delay: 0.4,  depth: 0.02,  floatDelay: '1.8s' },
];

const FloatingIcons = () => {
  const containerRef = useRef(null);
  const iconRefs = useRef([]);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const tick = () => {
      iconRefs.current.forEach((el, i) => {
        if (!el) return;
        const icon = ICONS[i];
        const tx = mouseRef.current.x * icon.depth * 100;
        const ty = mouseRef.current.y * icon.depth * 100;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {ICONS.map(({ Icon, color, size, top, left, delay, floatDelay }, i) => (
        <div
          key={i}
          ref={(el) => (iconRefs.current[i] = el)}
          className="absolute"
          style={{
            top,
            left,
            opacity: 0,
            animation: `icon-float-in 0.8s ease-out ${delay}s forwards, icon-float 5s ease-in-out ${floatDelay} infinite`,
            willChange: 'transform'
          }}
        >
          <div
            className="p-2.5 rounded-xl border"
            style={{
              background: `${color}12`,
              borderColor: `${color}30`,
              boxShadow: `0 0 20px ${color}20`
            }}
          >
            <Icon style={{ color, width: size, height: size }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
