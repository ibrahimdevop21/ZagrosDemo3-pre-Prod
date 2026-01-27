import { motion } from 'framer-motion';
import { useState, useMemo, memo, useEffect } from 'react';

/**
 * Optimized Auto-Scrolling Logo Carousel
 * Smooth continuous motion with hardware acceleration
 */

// Memoized logo item to prevent re-renders during animation
const LogoItem = memo(({ logo }) => (
  <div
    className="flex-shrink-0 w-40 h-24 flex items-center justify-center"
    style={{ transform: 'translateZ(0)' }}
  >
    <img
      src={logo.src}
      alt={logo.alt}
      width="160"
      height="96"
      className="w-full h-full object-contain"
      loading="lazy"
      draggable="false"
    />
  </div>
), (prevProps, nextProps) => {
  // Only re-render if src changes (not alt text)
  return prevProps.logo.src === nextProps.logo.src;
});

LogoItem.displayName = 'LogoItem';

export default function LogoCarousel({ logos = [], speed = 20 }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  // Detect RTL direction from document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dir = document.documentElement.getAttribute('dir');
      setIsRTL(dir === 'rtl');
    }
  }, []);

  // Stable logo IDs to prevent animation restart on language change
  const logoIds = useMemo(() => logos.map(l => l.id || l.src).join(','), [logos]);
  
  // Triple logos for truly seamless infinite loop
  const duplicatedLogos = useMemo(() => [...logos, ...logos, ...logos], [logoIds]);
  
  // Calculate pixel-based animation distance (avoids percentage recalc)
  // Animate through 1 set of logos for seamless infinite loop
  // RTL reverses the direction, so we need to flip the sign
  const animationDistance = useMemo(() => {
    // Each logo: 160px width + 48px gap = 208px per item
    const itemWidth = 208;
    // Animate through 1 complete set (1/3 of tripled logos)
    const distance = logos.length * itemWidth;
    // In RTL, animation should go positive (right to left visually)
    return isRTL ? distance : -distance;
  }, [logos.length, isRTL]);

  return (
    <div className="relative overflow-hidden py-8 border-y border-yellow-400/20">
      {/* Gradient overlays for premium fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-12 items-center"
        animate={isPaused ? {} : { x: animationDistance }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedLogos.map((logo, index) => (
          <LogoItem
            key={`${logo.id || logo.src}-${index}`}
            logo={logo}
          />
        ))}
      </motion.div>
    </div>
  );
}
