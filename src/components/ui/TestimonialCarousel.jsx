import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Testimonial Carousel
 * Auto-rotating with manual controls
 */

export default function TestimonialCarousel({ testimonials = [], autoPlayInterval = 6000, isArabic = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  if (!testimonials.length) return null;

  const current = testimonials[currentIndex];

  return (
    <div className="relative">
      {/* Testimonial Display */}
      <div className="relative min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
          >
            <div className="bg-bg-surface rounded-[var(--radius-2xl)] p-8 md:p-12 shadow-[var(--shadow-lg)] border border-border-muted">
              <div className={`space-y-6 ${isArabic ? 'text-right' : ''}`}>
                {/* Quote Icon */}
                <div className={`text-text-brand opacity-20 ${isArabic ? 'flex justify-end' : ''}`}>
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Quote */}
                <p className="text-text-primary text-xl md:text-2xl leading-relaxed font-normal">
                  {current.quote}
                </p>

                {/* Author */}
                <div className={`pt-6 border-t border-border-muted ${isArabic ? 'text-right' : ''}`}>
                  <p className="font-semibold text-text-primary text-lg">{current.author}</p>
                  <p className="text-sm text-text-secondary mt-1">{current.role}</p>
                  <p className={`text-xs text-text-tertiary mt-1 flex items-center gap-1.5 ${isArabic ? 'justify-end' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {current.location}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full bg-bg-surface hover:bg-bg-surface-hover border border-border-default hover:border-border-brand transition-all duration-[var(--duration-fast)] shadow-sm hover:shadow-md"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-[var(--duration-normal)] ${
                index === currentIndex
                  ? 'w-8 bg-bg-brand'
                  : 'w-2 bg-border-default hover:bg-border-brand'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-bg-surface hover:bg-bg-surface-hover border border-border-default hover:border-border-brand transition-all duration-[var(--duration-fast)] shadow-sm hover:shadow-md"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
