import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const HOLD_MS = 5600;
const MORPH_MS = 2200;

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
      const rungAngle = (Math.round(t * 14) / 14) * Math.PI * 3.2;
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

function buildTerrain(count) {
  const points = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i += 1) {
    const x = ((i % side) / (side - 1) - 0.5) * 2.1;
    const z = (Math.floor(i / side) / (side - 1) - 0.5) * 2.1;
    const d = Math.sqrt(x * x + z * z);
    points[i * 3] = x;
    points[i * 3 + 1] = Math.cos(d * 4.2) * 0.22 * (1.2 - d * 0.5) - 0.1;
    points[i * 3 + 2] = z;
  }
  return points;
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// A small point-cloud renderer: four meshes that morph into each other.
// Drag with a mouse to rotate; touch devices just watch it turn.
export default function PointCloud({ onShapeChange, className = '' }) {
  const canvasRef = useRef(null);
  const shapeCallback = useRef(onShapeChange);

  useEffect(() => {
    shapeCallback.current = onShapeChange;
  }, [onShapeChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const count = window.matchMedia('(max-width: 768px)').matches ? 640 : 1100;
    const shapes = [buildSphere(count), buildTorus(count), buildHelix(count), buildTerrain(count)];
    const tilts = [0.32, 0.55, 0.12, 0.6];
    const current = new Float32Array(shapes[0]);
    const delays = new Float32Array(count);
    const marked = new Uint8Array(count);
    for (let i = 0; i < count; i += 1) {
      delays[i] = ((i * 0.7548776) % 1) * 0.35;
      marked[i] = (i * 0.618034) % 1 < 0.035 ? 1 : 0;
    }

    const state = {
      width: 0,
      height: 0,
      from: 0,
      to: 0,
      phaseStart: performance.now(),
      morphing: false,
      spin: 0.6,
      dragX: 0,
      dragY: 0,
      velocity: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      visible: true,
      frame: 0,
      lastTime: performance.now(),
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (now) => {
      const { width, height } = state;
      const delta = Math.min(now - state.lastTime, 64);
      state.lastTime = now;
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;

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
      for (let i = 0; i < count * 3; i += 1) {
        if (!state.morphing) {
          current[i] = fromShape[i];
        } else {
          const local = easeInOut(Math.min(Math.max((progress - delays[Math.floor(i / 3)]) / 0.65, 0), 1));
          current[i] = fromShape[i] + (toShape[i] - fromShape[i]) * local;
        }
      }

      if (!reduceMotion.matches) state.spin += delta * 0.00012;
      if (!state.dragging) {
        state.dragX += state.velocity;
        state.velocity *= 0.94;
      }

      const tilt = state.morphing
        ? tilts[state.from] + (tilts[state.to] - tilts[state.from]) * easeInOut(progress)
        : tilts[state.from];
      const rotY = state.spin + state.dragX;
      const rotX = Math.min(Math.max(tilt + state.dragY, -1.2), 1.2);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.38;

      for (let i = 0; i < count; i += 1) {
        const index = i * 3;
        const x = current[index];
        const y = current[index + 1];
        const z = current[index + 2];
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const perspective = 2.8 / (2.8 + z2);
        const depth = (1 - z2) / 2;
        const size = (0.7 + depth * 1.5) * (marked[i] ? 1.6 : 1);
        const alpha = 0.12 + depth * 0.78;
        context.fillStyle = marked[i]
          ? `rgba(229, 55, 44, ${Math.min(alpha + 0.15, 1)})`
          : `rgba(237, 235, 230, ${alpha})`;
        context.fillRect(cx + x1 * scale * perspective - size / 2, cy + y2 * scale * perspective - size / 2, size, size);
      }
    };

    const loop = (now) => {
      render(now);
      const keepGoing = state.visible && !document.hidden
        && (!reduceMotion.matches || state.dragging || Math.abs(state.velocity) > 0.0005);
      state.frame = keepGoing ? window.requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!state.frame) {
        state.lastTime = performance.now();
        state.frame = window.requestAnimationFrame(loop);
      }
    };

    const handleDown = (event) => {
      if (event.pointerType === 'touch') return;
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.velocity = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('is-dragging');
      start();
    };

    const handleMove = (event) => {
      if (!state.dragging) return;
      const dx = (event.clientX - state.lastX) * 0.008;
      const dy = (event.clientY - state.lastY) * 0.006;
      state.dragX += dx;
      state.dragY += dy;
      state.velocity = dx;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    };

    const handleUp = (event) => {
      if (!state.dragging) return;
      state.dragging = false;
      canvas.classList.remove('is-dragging');
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    const handleVisibility = () => {
      if (!document.hidden) start();
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) start();
    });
    intersection.observe(canvas);

    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerup', handleUp);
    canvas.addEventListener('pointercancel', handleUp);
    document.addEventListener('visibilitychange', handleVisibility);
    reduceMotion.addEventListener('change', start);

    render(performance.now());
    start();

    return () => {
      window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerup', handleUp);
      canvas.removeEventListener('pointercancel', handleUp);
      document.removeEventListener('visibilitychange', handleVisibility);
      reduceMotion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} className={`point-cloud ${className}`} aria-hidden="true" />;
}
