import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * AnimatedCounter — counts from 0 to target using requestAnimationFrame
 * when element enters the viewport. Pure JS, no heavy dependencies.
 */
const AnimatedCounter = ({
  target,
  prefix = '',
  suffix = '',
  duration = 1800,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      setDisplayed(Math.round(easedProgress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayed.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
