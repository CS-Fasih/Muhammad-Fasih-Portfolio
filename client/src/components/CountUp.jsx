import { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from '../hooks/useMotion';

// Counts from zero to the number at the start of `value` once it is on screen.
// Anything after the digits ("rd" in "3rd") is kept as a suffix.
export default function CountUp({ value, duration = 1600 }) {
  const match = /^(\d+)(.*)$/.exec(String(value));
  const end = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const [ref, inView] = useInView(0.6);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!match || !inView) return undefined;
    if (prefersReducedMotion()) {
      const frame = window.requestAnimationFrame(() => setShown(end));
      return () => window.cancelAnimationFrame(frame);
    }

    let frame = 0;
    const started = performance.now();
    const step = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      setShown(Math.round(end * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
    // `match` is derived from `value`, which is what actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, end, duration]);

  if (!match) return <span>{value}</span>;

  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden="true">{shown}{suffix}</span>
    </span>
  );
}
