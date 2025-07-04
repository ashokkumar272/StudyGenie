import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.6,
  direction = 'up',
  distance = 20,
  ...props 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'fade':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'fade':
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      whileInView={getAnimatePosition()}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Higher-order component for easy use
export const withAnimation = (Component, animationProps = {}) => {
  return function AnimatedComponent(props) {
    return (
      <AnimatedSection {...animationProps}>
        <Component {...props} />
      </AnimatedSection>
    );
  };
};

// Pre-configured animation variants
export const fadeIn = (delay = 0) => ({
  direction: 'fade',
  delay,
  duration: 0.8
});

export const slideUp = (delay = 0) => ({
  direction: 'up',
  delay,
  distance: 30,
  duration: 0.6
});

export const slideLeft = (delay = 0) => ({
  direction: 'left',
  delay,
  distance: 40,
  duration: 0.7
});

export const slideRight = (delay = 0) => ({
  direction: 'right',
  delay,
  distance: 40,
  duration: 0.7
});

export const staggerChildren = (staggerDelay = 0.1) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    staggerChildren: staggerDelay,
    delayChildren: 0.2
  }
});

export const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default AnimatedSection;