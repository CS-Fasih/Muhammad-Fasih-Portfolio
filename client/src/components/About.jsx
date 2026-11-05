import { useCallback, useEffect, useRef, useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import PointCloud from './PointCloud';
import { SHAPE_NAMES } from '../lib/heroShapes';
import { aboutText, focusAreas, numbers } from '../data/profile';

const words = aboutText.split(' ');

// Words brighten one after another as the paragraph moves up the screen.
function useReadingProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.style.setProperty('--p', '1');
      return undefined;
    }
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.85;
      const end = viewport * 0.3;
      const progress = (start - rect.top) / (start - end + rect.height * 0.6);
      node.style.setProperty('--p', Math.min(Math.max(progress, 0), 1.05).toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return ref;
}

export default function About() {
  const sectionRef = useScrollReveal();
  const textRef = useReadingProgress();
  const [shape, setShape] = useState(0);
  const handleShape = useCallback((index) => setShape(index), []);

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container">
        <header className="section-head reveal">
          <h2>About</h2>
        </header>

        <p className="about__text" ref={textRef} aria-label={aboutText}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} aria-hidden="true" style={{ '--w': (index / words.length).toFixed(3) }}>
              {word}{' '}
            </span>
          ))}
        </p>

        <figure className="figure reveal">
          <div className="figure__stage">
            <PointCloud onShapeChange={handleShape} />
          </div>
          <figcaption className="figure__caption">
            <span className="figure__number">Fig. 1</span>
            <span>
              A point cloud drawn live with the Canvas 2D API. It morphs between four meshes; right
              now it is a <span className="figure__shape">{SHAPE_NAMES[shape]}</span>.
              <span className="figure__hint"> Drag to rotate it.</span>
            </span>
          </figcaption>
        </figure>

        <div className="focus">
          <h3 className="focus__title reveal">What I work on</h3>
          <ul className="focus__list">
            {focusAreas.map((area) => (
              <li className="focus__row reveal" key={area.id}>
                <span className="focus__name">{area.title}</span>
                <span className="focus__desc">{area.description}</span>
                <span className="focus__tools">{area.tools}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="numbers reveal">
          {numbers.map((item) => (
            <div className="numbers__item" key={item.label}>
              <dt className="numbers__label">{item.label}</dt>
              <dd className="numbers__value">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
