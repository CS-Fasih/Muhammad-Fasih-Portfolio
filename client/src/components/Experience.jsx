import useScrollReveal from '../hooks/useScrollReveal';
import { clamp, useScrollEffect } from '../hooks/useMotion';
import SectionHead from './SectionHead';
import { experience } from '../data/profile';

// How far the page has read down the timeline, written to --p for the red line.
function setLineProgress(node, viewport) {
  const rect = node.getBoundingClientRect();
  node.style.setProperty('--p', clamp((viewport * 0.6 - rect.top) / rect.height).toFixed(3));
}

export default function Experience() {
  const sectionRef = useScrollReveal();
  const listRef = useScrollEffect(setLineProgress);

  return (
    <section className="section experience" id="experience" ref={sectionRef}>
      <div className="container">
        <SectionHead index="02" title="Experience" note="Work and education, newest first" />

        <ol className="timeline" ref={listRef}>
          {experience.map((item) => (
            <li className={`tl reveal${item.current ? ' tl--current' : ''}`} key={item.id}>
              <div className="tl__when">
                <span className="tl__kind">{item.kind}</span>
                <span className="tl__period">{item.period}</span>
              </div>

              <span className="tl__node" aria-hidden="true" />

              <div className="tl__card" data-spot>
                {item.current && (
                  <span className="tl__now">
                    <span className="tl__now-dot" aria-hidden="true" />
                    Current
                  </span>
                )}
                <h3 className="tl__role">{item.role}</h3>
                <p className="tl__org">
                  {item.organization}, {item.location}
                </p>
                <p className="tl__summary">{item.summary}</p>
                {item.points.length > 0 && (
                  <ul className="tl__points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.tools && (
                  <ul className="tags" aria-label="Tools">
                    {item.tools.split(', ').map((tool) => (
                      <li className="tag" key={tool}>{tool}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
