import { useEffect, useState } from 'react';
import portfolioContent from '../data/portfolio';

const { hero } = portfolioContent;

const HERO_SLIDES = [
  '/images/hero-slide-urban.webp',
  '/images/hero-slide-datacenter.webp',
  '/images/hero-slide-processor.webp',
  '/images/hero-slide-neural.webp',
  '/images/hero-slide-vault.webp',
];

const HERO_SLIDE_INTERVAL_MS = 6000;

export default function Hero() {
  const [slideState, setSlideState] = useState({ active: 0, previous: null });

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timerId;

    const advanceSlide = () => {
      setSlideState(({ active }) => ({
        active: (active + 1) % HERO_SLIDES.length,
        previous: active,
      }));
    };

    const syncTimer = () => {
      window.clearInterval(timerId);
      timerId = undefined;

      if (!motionPreference.matches && !document.hidden) {
        timerId = window.setInterval(advanceSlide, HERO_SLIDE_INTERVAL_MS);
      }
    };

    syncTimer();
    document.addEventListener('visibilitychange', syncTimer);
    motionPreference.addEventListener('change', syncTimer);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', syncTimer);
      motionPreference.removeEventListener('change', syncTimer);
    };
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero__slider" aria-hidden="true">
        {HERO_SLIDES.map((src, index) => {
          const stateClass = index === slideState.active
            ? 'is-active'
            : index === slideState.previous
              ? 'is-previous'
              : '';

          return (
            <img
              key={src}
              src={src}
              alt=""
              className={`hero__slide ${stateClass}`}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          );
        })}
      </div>

      <div className="container">
        <div className="hero__content">
          <div className="hero__text">
            <h1>
              {hero.headline.map((line, index) => (
                <span key={line}>{line}{index < hero.headline.length - 1 && <br />}</span>
              ))}
            </h1>
            <p>{hero.summary}</p>
            <p className="hero__status">{hero.status}</p>
            <div className="hero__buttons">
              <a href="#contact" className="btn-primary" onClick={handleCTAClick}>
                {hero.primaryAction}
              </a>
              <a
                href="/Muhammad_Fasih_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white"
              >
                {hero.secondaryAction}
              </a>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
