import { useEffect, useRef } from 'react';
import { hasFinePointer, prefersReducedMotion } from '../hooks/useMotion';

// Pointer extras for mouse users. The native cursor stays; a ring trails behind it,
// cards marked data-spot get a light that follows the pointer, and elements marked
// data-magnetic lean towards it.
export default function Cursor() {
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !hasFinePointer() || prefersReducedMotion()) return undefined;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let frame = 0;
    let magnet = null;
    let started = false;

    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      ring.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)`;
      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      frame = settled ? 0 : window.requestAnimationFrame(tick);
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = '';
      magnet = null;
    };

    const handleMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!started) {
        started = true;
        current.x = target.x;
        current.y = target.y;
        ring.classList.add('is-ready');
      }
      if (!frame) frame = window.requestAnimationFrame(tick);

      const element = event.target instanceof Element ? event.target : null;
      const interactive = element?.closest('a, button, [data-cursor]');
      ring.classList.toggle('is-link', Boolean(interactive));
      ring.dataset.label = interactive?.getAttribute('data-cursor') || '';

      const spot = element?.closest('[data-spot]');
      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty('--sx', `${(event.clientX - rect.left).toFixed(0)}px`);
        spot.style.setProperty('--sy', `${(event.clientY - rect.top).toFixed(0)}px`);
      }

      const nextMagnet = element?.closest('[data-magnetic]') || null;
      if (nextMagnet !== magnet) releaseMagnet();
      magnet = nextMagnet;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        magnet.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
      }
    };

    const handleLeave = () => {
      ring.classList.remove('is-ready');
      started = false;
      releaseMagnet();
    };
    const handleDown = () => ring.classList.add('is-down');
    const handleUp = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      releaseMagnet();
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return <div className="cursor-ring" ref={ringRef} aria-hidden="true" />;
}
