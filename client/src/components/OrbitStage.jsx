import { useEffect, useRef, useState } from 'react';
import LocalTime from './LocalTime';
import { hasFinePointer } from '../hooks/useMotion';

const TAU = Math.PI * 2;
const HOLD_MS = 5200;
const MORPH_MS = 2000;
const RED = '#f2331f';
const CYAN = '#14c4e4';

const frac = (value) => value - Math.floor(value);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Every shape leaves a hole in the middle, which is where the portrait sits.
function buildBands(count) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = TAU * frac(i * 0.7548776662);
    const spread = frac(i * 0.569840291);
    const radius = i % 5 < 2 ? 0.74 + spread * 0.07 : 0.9 + spread * 0.2;
    points[i * 3] = Math.cos(angle) * radius;
    points[i * 3 + 1] = (frac(i * 0.3247) - 0.5) * 0.02;
    points[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return points;
}

function buildGyro(count) {
  const points = new Float32Array(count * 3);
  const perRing = Math.ceil(count / 3);
  const radii = [1.04, 0.92, 0.8];
  const rolls = [0, 1.05, -1.05];
  for (let i = 0; i < count; i += 1) {
    const ring = i % 3;
    const angle = (TAU * Math.floor(i / 3)) / perRing;
    const x = Math.cos(angle) * radii[ring];
    const z = Math.sin(angle) * radii[ring];
    points[i * 3] = x * Math.cos(rolls[ring]);
    points[i * 3 + 1] = x * Math.sin(rolls[ring]);
    points[i * 3 + 2] = z;
  }
  return points;
}

function buildCoil(count) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const u = (TAU * i) / count;
    const v = u * 30;
    const radius = 0.92 + 0.15 * Math.cos(v);
    points[i * 3] = radius * Math.cos(u);
    points[i * 3 + 1] = 0.15 * Math.sin(v);
    points[i * 3 + 2] = radius * Math.sin(u);
  }
  return points;
}

function buildWave(count) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = TAU * frac(i * 0.7548776662);
    const spread = frac(i * 0.569840291);
    const radius = 0.76 + spread * 0.32;
    points[i * 3] = Math.cos(angle) * radius;
    points[i * 3 + 1] = Math.sin(angle * 5 + spread * 2.4) * 0.2 * (0.55 + spread * 0.6);
    points[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return points;
}

// The hero's centrepiece: a point cloud that orbits the portrait in 3D.
// Each point is drawn twice, in red and in cyan, pulled apart by its depth, the way a
// stereo image for 3D glasses is printed. Points behind the portrait go on one canvas
// and points in front of it on another, so the ring really passes around the photo.
export default function OrbitStage({ fact }) {
  const stageRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const backContext = back?.getContext('2d');
    const frontContext = front?.getContext('2d');
    if (!stage || !backContext || !frontContext) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = hasFinePointer();
    const count = window.matchMedia('(max-width: 768px)').matches ? 620 : 1000;
    const shapes = [buildBands(count), buildGyro(count), buildCoil(count), buildWave(count)];
    const current = new Float32Array(shapes[0]);
    const delays = new Float32Array(count);
    for (let i = 0; i < count; i += 1) delays[i] = frac(i * 0.7548776) * 0.35;

    const state = {
      size: 0,
      from: 0,
      to: 0,
      phaseStart: performance.now(),
      morphing: false,
      spin: 0.4,
      dragX: 0,
      dragY: 0,
      velocity: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      pointerX: 0,
      pointerY: 0,
      easedX: 0,
      easedY: 0,
      visible: true,
      frame: 0,
      lastTime: performance.now(),
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.size = rect.width;
      [[back, backContext], [front, frontContext]].forEach(([canvas, context]) => {
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };

    const paint = (context, red, cyan) => {
      context.clearRect(0, 0, state.size, state.size);
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = RED;
      context.fill(red);
      context.globalCompositeOperation = 'multiply';
      context.fillStyle = CYAN;
      context.fill(cyan);
    };

    const render = (now) => {
      const { size } = state;
      const delta = Math.min(now - state.lastTime, 64);
      state.lastTime = now;
      if (!size) return;

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
      }

      const fromShape = shapes[state.from];
      const toShape = shapes[state.to];
      if (state.morphing) {
        for (let i = 0; i < count * 3; i += 1) {
          const local = easeInOut(Math.min(Math.max((progress - delays[Math.floor(i / 3)]) / 0.65, 0), 1));
          current[i] = fromShape[i] + (toShape[i] - fromShape[i]) * local;
        }
      } else {
        current.set(fromShape);
      }

      if (!reduceMotion.matches) state.spin += delta * 0.00022;
      if (!state.dragging) {
        state.dragX += state.velocity;
        state.velocity *= 0.95;
        state.dragY *= 0.985;
      }
      state.easedX += (state.pointerX - state.easedX) * 0.06;
      state.easedY += (state.pointerY - state.easedY) * 0.06;

      const rotY = state.spin + state.dragX + state.easedX * 0.4;
      const rotX = Math.min(Math.max(0.44 + state.dragY + state.easedY * 0.24, -0.5), 1.3);
      const rotZ = -0.3;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const centre = size / 2;
      const scale = size * 0.4;
      const unit = size / 560;
      const separation = (5.5 + Math.abs(state.easedX) * 5) * unit;

      const paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < count; i += 1) {
        const index = i * 3;
        const x = current[index];
        const y = current[index + 1];
        const z = current[index + 2];
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = x1 * sinZ + y2 * cosZ;
        const perspective = 3.4 / (3.4 + z2);
        const px = centre + x3 * scale * perspective;
        const py = centre + y3 * scale * perspective;
        const shift = z2 * separation;
        const radius = (1 + (1 - z2) * 0.7) * (i % 41 === 0 ? 1.9 : 1) * Math.max(unit, 0.72);
        const offset = z2 < 0 ? 2 : 0;
        const red = paths[offset];
        const cyan = paths[offset + 1];
        red.moveTo(px - shift + radius, py);
        red.arc(px - shift, py, radius, 0, TAU);
        cyan.moveTo(px + shift + radius, py);
        cyan.arc(px + shift, py, radius, 0, TAU);
      }

      paint(backContext, paths[0], paths[1]);
      paint(frontContext, paths[2], paths[3]);
    };

    const loop = (now) => {
      render(now);
      const moving = !reduceMotion.matches || state.dragging || Math.abs(state.velocity) > 0.0005;
      state.frame = state.visible && !document.hidden && moving ? window.requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!state.frame) {
        state.lastTime = performance.now();
        state.frame = window.requestAnimationFrame(loop);
      }
    };

    const handleDown = (event) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.velocity = 0;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
      setTouched(true);
      start();
    };

    const handleMove = (event) => {
      if (!state.dragging) return;
      const dx = (event.clientX - state.lastX) * 0.008;
      const dy = (event.clientY - state.lastY) * 0.005;
      state.dragX += dx;
      state.dragY = Math.min(Math.max(state.dragY + dy, -0.7), 0.7);
      state.velocity = dx;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    };

    const handleUp = (event) => {
      if (!state.dragging) return;
      state.dragging = false;
      stage.classList.remove('is-dragging');
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };

    const handlePointer = (event) => {
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleVisibility = () => {
      if (!document.hidden) start();
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    resizeObserver.observe(stage);

    const intersection = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) start();
    });
    intersection.observe(stage);

    stage.addEventListener('pointerdown', handleDown);
    stage.addEventListener('pointermove', handleMove);
    stage.addEventListener('pointerup', handleUp);
    stage.addEventListener('pointercancel', handleUp);
    if (finePointer) window.addEventListener('pointermove', handlePointer, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    reduceMotion.addEventListener('change', start);

    render(performance.now());
    start();

    return () => {
      window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      stage.removeEventListener('pointerdown', handleDown);
      stage.removeEventListener('pointermove', handleMove);
      stage.removeEventListener('pointerup', handleUp);
      stage.removeEventListener('pointercancel', handleUp);
      window.removeEventListener('pointermove', handlePointer);
      document.removeEventListener('visibilitychange', handleVisibility);
      reduceMotion.removeEventListener('change', start);
    };
  }, []);

  return (
    <div className={`stage${touched ? ' is-touched' : ''}`} ref={stageRef} data-cursor="Drag">
      <div className="stage__halo" aria-hidden="true" />
      <canvas className="stage__canvas" ref={backRef} aria-hidden="true" />
      <div className="stage__portrait">
        <img
          src="/images/about-photo.webp"
          alt="Portrait of Muhammad Fasih"
          width="885"
          height="1140"
          fetchPriority="high"
          draggable="false"
        />
      </div>
      <canvas className="stage__canvas stage__canvas--front" ref={frontRef} aria-hidden="true" />

      <p className="chip chip--now">
        <span className="chip__label">{fact.label}</span>
        <span className="chip__value">{fact.detail}</span>
      </p>
      <p className="chip chip--place">
        <span className="chip__label">Karachi</span>
        <span className="chip__value"><LocalTime /> PKT</span>
      </p>
      <p className="stage__hint" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" /></svg>
        Drag to spin
      </p>
    </div>
  );
}
