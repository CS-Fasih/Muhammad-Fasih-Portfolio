import { useEffect, useRef, useState } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const prefersReducedMotion = () => window.matchMedia(REDUCED).matches;
export const hasFinePointer = () => window.matchMedia(FINE_POINTER).matches;
export const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Writes the pointer position to --mx / --my (each -1..1, eased) on the element.
// CSS uses the two variables for parallax, so nothing re-renders.
export function usePointerVars() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasFinePointer() || prefersReducedMotion()) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      node.style.setProperty('--mx', current.x.toFixed(4));
      node.style.setProperty('--my', current.y.toFixed(4));
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : window.requestAnimationFrame(tick);
    };

    const handleMove = (event) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return ref;
}

// Calls `compute(node, viewportHeight)` on scroll and resize, once per frame.
export function useScrollEffect(compute) {
  const ref = useRef(null);
  const computeRef = useRef(compute);

  useEffect(() => {
    computeRef.current = compute;
  }, [compute]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      computeRef.current(node, window.innerHeight);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return ref;
}

// True once the element has scrolled into view. Stays true afterwards.
export function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
