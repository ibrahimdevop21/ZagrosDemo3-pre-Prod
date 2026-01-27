import { motion } from 'framer-motion';

/**
 * Animated Section Wrapper
 * Provides professional entrance animations
 */

const variants = {
  hidden: { 
    opacity: 0, 
    y: 24 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1], // ease-in-out
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export function AnimatedSection({ children, stagger = false, delay = 0, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={stagger ? staggerContainer : variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = '' }) {
  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
