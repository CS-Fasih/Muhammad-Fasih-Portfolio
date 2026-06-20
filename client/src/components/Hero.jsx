import { useEffect, useRef, useState } from 'react';

function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const start = performance.now();
            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * end));
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [end, duration]);

  return <span ref={ref}>{count}+</span>;
}

export default function Hero() {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
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
      <img
        src="/images/hero-bg.png"
        alt="Dark urban landscape"
        className="hero__bg"
      />

      <div className="container">
        <div className="hero__content">
          <div className="hero__text">
            <h1>
              I Build<br />
              Modern &<br />
              Robust Systems
            </h1>
            <p>
              Full-stack developer & AI engineer from Karachi, Pakistan. Engineering
              robust web applications, intelligent AI systems, and security tools
              across the entire stack.
            </p>
            <a href="#contact" className="btn-primary" onClick={handleCTAClick}>
              Get In Touch
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-number">
                <CountUp end={428} />
                <span></span>
              </div>
              <p>GitHub contributions<br />in the last year</p>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-number">
                <CountUp end={22} duration={1200} />
                <span></span>
              </div>
              <p>Public<br />repositories</p>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-number">
                <CountUp end={25} duration={1200} />
                <span></span>
              </div>
              <p>Professional<br />certifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="hero__indicators">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`hero__dot ${activeDot === i ? 'active' : ''}`} />
        ))}
      </div>

      {/* Play Button → Links to GitHub */}
      <a
        href="https://github.com/CS-Fasih"
        target="_blank"
        rel="noopener noreferrer"
        className="hero__play"
        aria-label="Visit GitHub profile"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </a>
    </section>
  );
}
