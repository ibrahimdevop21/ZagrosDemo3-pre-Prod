/**
 * Zagros v3 — scroll-reveal helper.
 *
 * Adds `data-revealed` to elements with `data-reveal` once they cross
 * 15% into the viewport. One-shot. Reduced-motion: the CSS in motion.css
 * gates the visible effect, so the helper can run safely.
 */
export function observeReveal(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-revealed', ''));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/**
 * Count-up helper for the By-the-numbers section. Animates 0 → target
 * over 400ms ease-out when the element enters view. Reduced-motion
 * skips and shows final value immediately.
 *
 * Duration matches --motion-slow (400ms). The motion brief caps every
 * duration at ≤450ms, and the count-up is the single 'slow' delight
 * on the site — used here and only here.
 */
export function observeCountUp(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-count-target]');
  if (!targets.length) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      const suffix = el.dataset.countSuffix ?? '';
      el.textContent = (el.dataset.countTarget ?? '') + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.countTarget ?? '0', 10);
        const suffix = el.dataset.countSuffix ?? '';
        const start = performance.now();
        const duration = 400;

        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => observer.observe(el));
}
