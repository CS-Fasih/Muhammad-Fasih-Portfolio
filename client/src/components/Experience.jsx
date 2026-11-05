import { useEffect, useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';
import { experience } from '../data/profile';

// Fills the timeline rail as the reader scrolls through it.
function useTimelineProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
      node.style.setProperty('--progress', progress.toFixed(4));
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

export default function Experience() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
  const timelineRef = useTimelineProgress();

  return (
    <section className="section experience" id="experience" ref={sectionRef}>
      <div className="container experience__layout" ref={pointerRef}>
        <header className="section-head experience__head reveal">
          <span className="eyebrow">02 · Experience</span>
          <h2>
            From code to <em>spatial</em> computing.
          </h2>
          <p>
            A short path so far, moving steadily toward AR/VR: university projects in AI and systems,
            an XR engineering role in industry, and now research.
          </p>
        </header>

        <div className="timeline" ref={timelineRef}>
          <span className="timeline__rail" aria-hidden="true">
            <span className="timeline__fill" />
          </span>
          <ol className="timeline__list">
            {experience.map((item, index) => (
              <li
                key={item.id}
                className={`timeline__item reveal ${item.current ? 'is-current' : ''}`}
                style={{ '--d': `${index * 80}ms` }}
              >
                <span className="timeline__node" aria-hidden="true" />
                <article className="timeline-card spot">
                  <div className="timeline-card__meta">
                    <span className="timeline-card__period">{item.period}</span>
                    {item.current && (
                      <span className="badge badge--live">
                        <span className="pulse-dot pulse-dot--small" aria-hidden="true" /> Current
                      </span>
                    )}
                    {item.duration && <span className="badge">{item.duration}</span>}
                    {item.education && <span className="badge">Education</span>}
                  </div>
                  <h3 className="timeline-card__role">{item.role}</h3>
                  <p className="timeline-card__org">
                    {item.organization}
                    <span aria-hidden="true"> · </span>
                    <span className="timeline-card__location">{item.location}</span>
                  </p>
                  <p className="timeline-card__summary">{item.summary}</p>
                  {item.points.length > 0 && (
                    <ul className="timeline-card__points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  <ul className="chip-list">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
