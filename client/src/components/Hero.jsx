import { useEffect, useState } from 'react';
import OrbitStage from './OrbitStage';
import Marquee from './Marquee';
import { prefersReducedMotion, usePointerVars } from '../hooks/useMotion';
import { buildList, contactLinks, currentRole, heroFacts, marqueeItems } from '../data/profile';

function scrollToId(event, id) {
  const section = document.getElementById(id);
  if (!section) return;
  event.preventDefault();
  window.scrollTo({ top: Math.max(section.offsetTop - 70, 0), behavior: 'smooth' });
}

// Cycles through the phrases that finish "I build ...".
function Rotator({ phrases }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % phrases.length), 2400);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  return (
    <span className="rotator">
      <span className="sr-only">{phrases.join(', ')}.</span>
      <span className="rotator__word" key={index} aria-hidden="true">{phrases[index]}</span>
    </span>
  );
}

export default function Hero() {
  const heroRef = usePointerVars();

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__status">
            <span className="hero__pulse" aria-hidden="true" />
            {currentRole.title}, {currentRole.organization}
          </p>

          <h1 className="hero__name" aria-label="Muhammad Fasih">
            <span className="hero__line" aria-hidden="true">
              <span className="stereo" data-text="Muhammad">Muhammad</span>
            </span>
            <span className="hero__line" aria-hidden="true">
              <span className="stereo" data-text="Fasih">Fasih</span>
            </span>
          </h1>

          <p className="hero__build">
            I build <Rotator phrases={buildList} />
          </p>

          <p className="hero__intro">
            I research and build AR/VR systems at NED. Before that I spent three months as an XR
            Engineer at AIDL, making VR and AR simulations in WorldViz Vizard. I also work on
            computer vision, Linux tooling and web apps.
          </p>

          <div className="hero__actions">
            <a href="#work" className="btn" data-magnetic onClick={(event) => scrollToId(event, 'work')}>
              See my work
              <svg className="btn__icon btn__icon--down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
            <a href={contactLinks.resume} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" data-magnetic>
              R&eacute;sum&eacute; (PDF)
              <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>

            <ul className="hero__social">
              <li>
                <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.64V21h-4V9.75Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href={`mailto:${contactLinks.email}`} aria-label="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <OrbitStage fact={heroFacts[0]} />
      </div>

      <Marquee items={marqueeItems} />
    </section>
  );
}
