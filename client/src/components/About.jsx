import useScrollReveal from '../hooks/useScrollReveal';
import { clamp, prefersReducedMotion, useScrollEffect } from '../hooks/useMotion';
import SectionHead from './SectionHead';
import CountUp from './CountUp';
import { aboutText, focusAreas, numbers } from '../data/profile';

const words = aboutText.split(' ');

const icons = {
  xr: (
    <>
      <path d="M6 18h36a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-9l-4-6h-10l-4 6H6a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z" />
      <path className="icon-move" d="M10 25h9M29 25h9" />
      <path d="M14 18v-4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4" />
    </>
  ),
  ai: (
    <>
      <path d="M4 14V8a4 4 0 0 1 4-4h6M34 4h6a4 4 0 0 1 4 4v6M44 34v6a4 4 0 0 1-4 4h-6M14 44H8a4 4 0 0 1-4-4v-6" />
      <path d="M10 24s5-9 14-9 14 9 14 9-5 9-14 9-14-9-14-9Z" />
      <circle className="icon-move" cx="24" cy="24" r="4" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="7" width="42" height="34" rx="5" />
      <path d="M3 16h42M9 11.5h.01M14 11.5h.01M19 11.5h.01" />
      <path className="icon-move" d="m19 24-5 5 5 5M29 24l5 5-5 5" />
    </>
  ),
  sys: (
    <>
      <rect x="3" y="7" width="42" height="34" rx="5" />
      <path d="m12 18 7 6-7 6" />
      <path className="icon-move" d="M24 31h12" />
    </>
  ),
};

// Words darken one after another as the paragraph moves up the screen.
function setReadingProgress(node, viewport) {
  if (prefersReducedMotion()) {
    node.style.setProperty('--p', '1.1');
    return;
  }
  const rect = node.getBoundingClientRect();
  const start = viewport * 0.86;
  const end = viewport * 0.32;
  const progress = (start - rect.top) / (start - end + rect.height * 0.6);
  node.style.setProperty('--p', clamp(progress, 0, 1.1).toFixed(3));
}

export default function About() {
  const sectionRef = useScrollReveal();
  const textRef = useScrollEffect(setReadingProgress);

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container">
        <SectionHead index="01" title="About" note="Software engineer, based in Karachi" />

        <p className="about__text" ref={textRef} aria-label={aboutText}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} aria-hidden="true" style={{ '--w': (index / words.length).toFixed(3) }}>
              {word}{' '}
            </span>
          ))}
        </p>

        <h3 className="about__sub reveal">What I work on</h3>
        <ul className="focus">
          {focusAreas.map((area, index) => (
            <li className="focus__card reveal" key={area.id} data-spot style={{ '--d': index }}>
              <svg className="focus__icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {icons[area.id]}
              </svg>
              <span className="focus__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h4 className="focus__name">{area.title}</h4>
              <p className="focus__desc">{area.description}</p>
              <ul className="tags" aria-label="Tools">
                {area.tools.split(', ').map((tool) => (
                  <li className="tag" key={tool}>{tool}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <dl className="stats reveal">
          {numbers.map((item) => (
            <div className="stats__item" key={item.label}>
              <dt className="stats__label">{item.label}</dt>
              <dd className="stats__value"><CountUp value={item.value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
