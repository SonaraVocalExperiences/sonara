/**
 * Page-level scroll behavior, imported once from Layout.astro. Listeners go on `document` or
 * `window`, so they survive ClientRouter swaps.
 */

const root = document.documentElement;
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

// The reader taking over (wheel, touch, scroll keys) ends an anchor's smooth scroll in place. Only
// while one is running: calling scrollTo on every wheel event of an ordinary scroll cuts Safari's
// momentum scrolling short on every frame, which reads as jitter. A click on an in-page link starts
// the window, and it ends once scrolling has been idle for 150ms.
let anchorScrolling = false;
let idleTimer: ReturnType<typeof setTimeout>;

const untilIdle = () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => (anchorScrolling = false), 150);
};

const stopSmoothScroll = () => {
  if (!anchorScrolling) return;
  anchorScrolling = false;
  scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
};

document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('a[href^="#"]')) return;
  anchorScrolling = true;
  untilIdle();
});
addEventListener('scroll', () => anchorScrolling && untilIdle(), { passive: true });
addEventListener('wheel', stopSmoothScroll, { passive: true });
addEventListener('touchstart', stopSmoothScroll, { passive: true });

// Flags tabbing so focus scrolling stays instant (see global.css). Focus inside the video iframe is
// invisible to the page's CSS, so :focus-visible can't tell. The flag lasts until a pointer press or
// another key.
addEventListener(
  'keydown',
  (e) => {
    root.toggleAttribute('data-tabbing', e.key === 'Tab');
    if (scrollKeys.has(e.key)) stopSmoothScroll();
  },
  true
);
addEventListener('pointerdown', () => root.removeAttribute('data-tabbing'), true);

// A language switch swaps the page in place; keep the reader where they were.
let scrollBeforeSwap = 0;
document.addEventListener('astro:before-preparation', () => (scrollBeforeSwap = scrollY));
document.addEventListener('astro:after-swap', () => scrollTo({ top: scrollBeforeSwap, behavior: 'instant' }));
