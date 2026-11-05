import { useEffect, useRef } from 'react';

// Delegated pointer effects for a section:
// - `.spot` elements get --mx / --my so CSS can draw a light that follows the cursor.
// - `.tilt` elements get --rx / --ry for a small 3D tilt.
export default function usePointerEffects() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tilted = null;

    const resetTilt = () => {
      if (!tilted) return;
      tilted.style.setProperty('--rx', '0deg');
      tilted.style.setProperty('--ry', '0deg');
      tilted = null;
    };

    const handleMove = (event) => {
      const spot = event.target.closest?.('.spot');
      if (spot && root.contains(spot)) {
        const rect = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        spot.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }

      const tilt = event.target.closest?.('.tilt');
      if (tilt !== tilted) resetTilt();
      if (tilt && root.contains(tilt) && !reduceMotion.matches) {
        const rect = tilt.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
        tilted = tilt;
      }
    };

    root.addEventListener('pointermove', handleMove, { passive: true });
    root.addEventListener('pointerleave', resetTilt);
    return () => {
      root.removeEventListener('pointermove', handleMove);
      root.removeEventListener('pointerleave', resetTilt);
    };
  }, []);

  return ref;
}
