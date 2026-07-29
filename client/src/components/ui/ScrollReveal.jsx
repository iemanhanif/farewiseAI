import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const variants = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  'slide-left': {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  'slide-right': {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 }
  }
};

const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.55,
  className = '',
  once = true,
  threshold = 0.12
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[animation] || variants['fade-up']}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScrollRevealGroup = ({
  children,
  stagger = 0.1,
  animation = 'fade-up',
  duration = 0.5,
  baseDelay = 0,
  className = '',
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.08 });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) =>
        child ? (
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants[animation] || variants['fade-up']}
            transition={{
              duration,
              delay: baseDelay + index * stagger,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {child}
          </motion.div>
        ) : null
      )}
    </div>
  );
};

export default ScrollReveal;
