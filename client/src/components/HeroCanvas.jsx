import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const HOLD_MS = 5200;
const MORPH_MS = 1900;

function buildSphere(count) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = GOLDEN * i;
    points[i * 3] = Math.cos(theta) * radius;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return points;
}

function buildTorus(count) {
  const points = new Float32Array(count * 3);
  const major = 0.74;
  const minor = 0.3;
  for (let i = 0; i < count; i += 1) {
    const u = (TAU * i) / count;
    const v = ((TAU * i * 29) / count) % TAU;
    points[i * 3] = (major + minor * Math.cos(v)) * Math.cos(u);
    points[i * 3 + 1] = minor * Math.sin(v);
    points[i * 3 + 2] = (major + minor * Math.cos(v)) * Math.sin(u);
  }
  return points;
}

function buildHelix(count) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const strand = i % 3;
    const t = (i / count) * 2 - 1;
    const angle = t * Math.PI * 3.2;
    let x;
    let z;
    if (strand < 2) {
      const phase = strand === 0 ? 0 : Math.PI;
      x = Math.cos(angle + phase) * 0.5;
      z = Math.sin(angle + phase) * 0.5;
    } else {
      // Rungs between the two strands.
      const rungT = Math.round(t * 14) / 14;
      const rungAngle = rungT * Math.PI * 3.2;
      const mix = ((i * 0.6180339) % 1) * 2 - 1;
      x = Math.cos(rungAngle) * 0.5 * mix;
      z = Math.sin(rungAngle) * 0.5 * mix;
    }
    points[i * 3] = x;
    points[i * 3 + 1] = t * 1.15;
    points[i * 3 + 2] = z;
  }
  return points;
}

function buildField(count) {
  const points = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i += 1) {
    const col = i % side;
    const row = Math.floor(i / side);
    const x = (col / (side - 1) - 0.5) * 2.1;
    const z = (row / (side - 1) - 0.5) * 2.1;
    const d = Math.sqrt(x * x + z * z);
    points[i * 3] = x;
    points[i * 3 + 1] = Math.cos(d * 4.2) * 0.22 * (1.2 - d * 0.5) - 0.1;
    points[i * 3 + 2] = z;
  }
  return points;
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function HeroCanvas({ onShapeChange }) {
  const canvasRef = useRef(null);
  const shapeCallback = useRef(onShapeChange);

  useEffect(() => {
    shapeCallback.current = onShapeChange;
  }, [onShapeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const count = isSmall ? 520 : 900;
    const shapes = [buildSphere(count), buildTorus(count), buildHelix(count), buildField(count)];
    const tilts = [0.32, 0.55, 0.12, 0.62];
    const current = new Float32Array(shapes[0]);
    const delays = new Float32Array(count);
    for (let i = 0; i < count; i += 1) delays[i] = ((i * 0.7548776) % 1) * 0.35;

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      pointerX: 0,
      pointerY: 0,
      smoothX: 0,
      smoothY: 0,
      from: 0,
      to: 0,
      phaseStart: performance.now(),
      morphing: false,
      tilt: tilts[0],
      visible: true,
      frame: 0,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * state.dpr));
      canvas.height = Math.max(1, Math.round(rect.height * state.dpr));
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };

    const drawRing = (radius, cx, cy, scale, rotY, rotX, ringTilt, alpha, dash) => {
      context.beginPath();
      const segments = 96;
      for (let s = 0; s <= segments; s += 1) {
        const a = (s / segments) * TAU;
        const x = Math.cos(a) * radius;
        const flatZ = Math.sin(a) * radius;
        // Tilt the ring on its own axis before applying the scene rotation.
        const y = -flatZ * Math.sin(ringTilt);
        const z = flatZ * Math.cos(ringTilt);
        const x2 = x * Math.cos(rotY) - z * Math.sin(rotY);
        const z2 = x * Math.sin(rotY) + z * Math.cos(rotY);
        const y3 = y * Math.cos(rotX) - z2 * Math.sin(rotX);
        const z3 = y * Math.sin(rotX) + z2 * Math.cos(rotX);
        const perspective = 2.6 / (2.6 + z3);
        const px = cx + x2 * scale * perspective;
        const py = cy + y3 * scale * perspective;
        if (s === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.setLineDash(dash);
      context.strokeStyle = `rgba(255, 140, 100, ${alpha})`;
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);
    };

    const render = (now) => {
      const { width, height } = state;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;

      // Morph timeline.
      const elapsed = now - state.phaseStart;
      let progress = 1;
      if (state.morphing) {
        progress = Math.min(elapsed / MORPH_MS, 1);
        if (progress >= 1) {
          state.morphing = false;
          state.from = state.to;
          state.phaseStart = now;
        }
      } else if (elapsed > HOLD_MS && !reduceMotion.matches) {
        state.to = (state.from + 1) % shapes.length;
        state.morphing = true;
        state.phaseStart = now;
        progress = 0;
        shapeCallback.current?.(state.to);
      }

      const fromShape = shapes[state.from];
      const toShape = shapes[state.to];
      const targetTilt = state.morphing
        ? tilts[state.from] + (tilts[state.to] - tilts[state.from]) * easeInOut(progress)
        : tilts[state.from];
      state.tilt = targetTilt;

      for (let i = 0; i < count; i += 1) {
        const local = state.morphing
          ? easeInOut(Math.min(Math.max((progress - delays[i]) / (1 - 0.35), 0), 1))
          : 1;
        const index = i * 3;
        if (state.morphing) {
          current[index] = fromShape[index] + (toShape[index] - fromShape[index]) * local;
          current[index + 1] = fromShape[index + 1] + (toShape[index + 1] - fromShape[index + 1]) * local;
          current[index + 2] = fromShape[index + 2] + (toShape[index + 2] - fromShape[index + 2]) * local;
        } else {
          current[index] = fromShape[index];
          current[index + 1] = fromShape[index + 1];
          current[index + 2] = fromShape[index + 2];
        }
      }

      state.smoothX += (state.pointerX - state.smoothX) * 0.05;
      state.smoothY += (state.pointerY - state.smoothY) * 0.05;

      const rotY = (reduceMotion.matches ? 0.6 : now * 0.00016) + state.smoothX * 0.6;
      const rotX = state.tilt + state.smoothY * 0.35;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.36;

      drawRing(1.32, cx, cy, scale, rotY * 0.6, rotX, 1.15, 0.16, [2, 6]);
      drawRing(1.5, cx, cy, scale, -rotY * 0.4, rotX, -0.5, 0.1, []);

      context.globalCompositeOperation = 'lighter';
      for (let i = 0; i < count; i += 1) {
        const index = i * 3;
        const x = current[index];
        const y = current[index + 1];
        const z = current[index + 2];
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const perspective = 2.6 / (2.6 + z2);
        const px = cx + x1 * scale * perspective;
        const py = cy + y2 * scale * perspective;
        const depth = (1 - z2) / 2; // 0 (far) .. 1 (near)
        const size = 0.8 + depth * 2.1;
        const alpha = 0.26 + depth * 0.74;
        // Warm gradient: gold at the top of the shape, red at the bottom.
        const heat = Math.min(Math.max((1 + y) / 2, 0), 1);
        const r = 255;
        const g = Math.round(70 + (1 - heat) * 120);
        const b = Math.round(70 + (1 - heat) * 40);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        context.fillRect(px - size / 2, py - size / 2, size, size);
      }
      context.globalCompositeOperation = 'source-over';
    };

    const loop = (now) => {
      render(now);
      if (state.visible && !document.hidden && !reduceMotion.matches) {
        state.frame = window.requestAnimationFrame(loop);
      } else {
        state.frame = 0;
      }
    };

    const start = () => {
      if (!state.frame) state.frame = window.requestAnimationFrame(loop);
    };

    const handlePointer = (event) => {
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleVisibility = () => {
      if (!document.hidden) start();
    };

    const handleMotionChange = () => {
      if (reduceMotion.matches) render(performance.now());
      else start();
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) render(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) start();
    });
    intersection.observe(canvas);

    window.addEventListener('pointermove', handlePointer, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    reduceMotion.addEventListener('change', handleMotionChange);

    if (reduceMotion.matches) render(performance.now());
    else start();

    return () => {
      window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', handlePointer);
      document.removeEventListener('visibilitychange', handleVisibility);
      reduceMotion.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
