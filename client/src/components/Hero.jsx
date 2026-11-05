import { useCallback, useEffect, useRef, useState } from 'react';
import HeroCanvas from './HeroCanvas';
import { SHAPE_NAMES } from '../lib/heroShapes';
import { currentRole, heroRoles, stats } from '../data/profile';

const ROLE_INTERVAL_MS = 2600;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function CountUp({ end, suffix = '', duration = 1600 }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? end : 0));
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.round(eased * end));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      <span className="hero-stat__suffix">{suffix}</span>
    </span>
  );
}

function scrollToId(event, id) {
  const section = document.getElementById(id);
  if (!section) return;
  event.preventDefault();
  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
  window.scrollTo({ top: Math.max(section.offsetTop - navbarHeight, 0), behavior: 'smooth' });
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setRoleIndex((index) => (index + 1) % heroRoles.length);
    }, ROLE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const handleShapeChange = useCallback((index) => setShapeIndex(index), []);

  return (
    <section className="hero" id="home">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__aurora hero__aurora--one" />
        <div className="hero__aurora hero__aurora--two" />
        <div className="hero__aurora hero__aurora--three" />
        <div className="hero__floor" />
        <div className="hero__vignette" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy">
          <a href="#experience" className="hero__status" onClick={(event) => scrollToId(event, 'experience')}>
            <span className="pulse-dot" aria-hidden="true" />
            <span className="hero__status-label">Now</span>
            <span className="hero__status-text">
              {currentRole.title} · {currentRole.organization}
            </span>
            <svg className="hero__status-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <h1 className="hero__title">
            <span className="hero__line"><span>Building</span></span>
            <span className="hero__line"><span><span className="text-gradient">immersive worlds</span></span></span>
            <span className="hero__line"><span>&amp; intelligent systems.</span></span>
          </h1>

          <p className="hero__rotator">
            <span className="hero__rotator-prefix">Currently working on</span>
            <span className="sr-only">{heroRoles.join(', ')}</span>
            <span className="hero__rotator-window" aria-hidden="true">
              <span key={heroRoles[roleIndex]} className="hero__rotator-word">
                {heroRoles[roleIndex]}
              </span>
            </span>
          </p>

          <p className="hero__lede">
            I&apos;m Muhammad Fasih, a software engineer from Karachi. I research and build AR/VR
            systems at NED, after working as an XR Engineer at AIDL. I also ship AI, full-stack, and
            security software.
          </p>

          <div className="hero__actions">
            <a href="#work" className="x-btn x-btn--primary" onClick={(event) => scrollToId(event, 'work')}>
              Explore my work
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="/Muhammad_Fasih_Resume.pdf" target="_blank" rel="noopener noreferrer" className="x-btn x-btn--ghost">
              Download résumé
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hud">
            <span className="hud__corner hud__corner--tl" />
            <span className="hud__corner hud__corner--tr" />
            <span className="hud__corner hud__corner--bl" />
            <span className="hud__corner hud__corner--br" />
            <span className="hud__label hud__label--tl">Spatial view · 01</span>
            <span className="hud__label hud__label--br">
              <span className="pulse-dot pulse-dot--small" /> Tracking
            </span>
            <span className="hud__label hud__label--bl" key={shapeIndex}>
              Mesh: {SHAPE_NAMES[shapeIndex]}
            </span>
          </div>
          <HeroCanvas onShapeChange={handleShapeChange} />
          <span className="hero__chip hero__chip--one">Vizard</span>
          <span className="hero__chip hero__chip--two">Python</span>
          <span className="hero__chip hero__chip--three">Blender</span>
        </div>
      </div>

      <div className="container">
        <dl className="hero__stats">
          {stats.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <dt className="hero-stat__label">{stat.label}</dt>
              <dd className="hero-stat__value">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#about" className="hero__scroll" onClick={(event) => scrollToId(event, 'about')} aria-label="Scroll to About">
        <span className="hero__scroll-track"><span className="hero__scroll-thumb" /></span>
      </a>
    </section>
  );
}
