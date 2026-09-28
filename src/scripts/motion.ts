// Site-wide motion: scroll reveals, count-up numbers, and cursor spotlights.
// Everything degrades to static content without JS or with reduced motion.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canObserve = 'IntersectionObserver' in window;

// --- Reveal on scroll: [data-reveal] (optional style="--reveal-delay: 120") ---
const revealed = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion || !canObserve) {
  revealed.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  revealed.forEach((el) => io.observe(el));
}

// --- Count-up numbers: <span data-count="4000" data-prefix="" data-suffix="+"> ---
const counters = document.querySelectorAll<HTMLElement>('[data-count]');
if (!reduceMotion && canObserve && counters.length) {
  const format = new Intl.NumberFormat('en-US');
  const render = (el: HTMLElement, value: number) => {
    el.textContent = `${el.dataset.prefix ?? ''}${format.format(value)}${el.dataset.suffix ?? ''}`;
  };
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      render(el, Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  // The observer's first report says whether each number starts on screen, so
  // nothing needs a layout read up front. Off-screen numbers reset to zero and
  // count up when they arrive; on-screen ones count up right away.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.intersectionRatio >= 0.6) {
          run(el);
          io.unobserve(el);
        } else if (!el.dataset.primed) {
          el.dataset.primed = 'true';
          render(el, 0);
        }
      }
    },
    { threshold: [0, 0.6] }
  );
  counters.forEach((el) => io.observe(el));
}

// --- Spotlight: [data-spotlight] gets --mx/--my for a cursor-following glow ---
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    el.addEventListener(
      'pointermove',
      (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });
}
