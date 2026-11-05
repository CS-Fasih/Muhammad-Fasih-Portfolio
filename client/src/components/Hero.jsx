import { useEffect, useRef } from 'react';
import LocalTime from './LocalTime';
import { heroFacts } from '../data/profile';

function scrollToId(event, id) {
  const section = document.getElementById(id);
  if (!section) return;
  event.preventDefault();
  window.scrollTo({ top: Math.max(section.offsetTop - 64, 0), behavior: 'smooth' });
}

// Moves the portrait a little slower than the page while the hero is on screen.
function useParallax(strength = 0.06, limit = 30) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const shift = Math.min(window.scrollY * strength, limit);
      node.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.15)`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
    };
  }, [strength, limit]);

  return ref;
}

export default function Hero() {
  const portraitRef = useParallax();

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero__meta">
          <span>Software engineer</span>
          <span>Karachi, Pakistan</span>
          <span className="hero__clock">
            <LocalTime /> PKT
          </span>
        </div>

        <div className="hero__main">
          <div className="hero__text">
            <h1 className="hero__name">
              <span className="hero__line"><span>Muhammad</span></span>
              <span className="hero__line"><span>Fasih</span></span>
            </h1>

            <p className="hero__intro">
              I research and build AR/VR systems at NED. Before that I spent three months as an XR
              Engineer at AIDL, making VR and AR simulations in WorldViz Vizard. I also work on
              computer vision, Linux tooling and web apps.
            </p>

            <div className="hero__links">
              <a href="#work" className="text-link" onClick={(event) => scrollToId(event, 'work')}>
                Selected work
              </a>
              <a href="/Muhammad_Fasih_Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-link">
                Résumé (PDF)
              </a>
              <a href="mailto:muhammadfasih146@gmail.com" className="text-link">
                Email
              </a>
            </div>
          </div>

          <figure className="hero__portrait">
            <div className="hero__portrait-frame">
              <img
                ref={portraitRef}
                src="/images/about-photo.png"
                alt="Muhammad Fasih"
                width="885"
                height="1140"
                fetchPriority="high"
              />
            </div>
          </figure>
        </div>

        <dl className="hero__facts">
          {heroFacts.map((fact) => (
            <div className="hero__fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                <span className="hero__fact-value">{fact.value}</span>
                <span className="hero__fact-detail">{fact.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
