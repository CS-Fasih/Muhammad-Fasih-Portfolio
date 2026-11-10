import useScrollReveal from '../hooks/useScrollReveal';
import { clamp, prefersReducedMotion, useScrollEffect } from '../hooks/useMotion';
import SectionHead from './SectionHead';
import ProjectFigure from './ProjectFigure';
import projects from '../data/projects';

// The cards are sticky and pile up as the page scrolls. Each one shrinks a little
// while the next slides over it, which reads as a stack with depth.
function setStackDepth(node) {
  const cards = node.children;
  const still = prefersReducedMotion();
  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];
    const next = cards[i + 1];
    let covered = 0;
    if (next && !still && window.getComputedStyle(card).position === 'sticky') {
      const rect = card.getBoundingClientRect();
      covered = clamp((rect.bottom - next.getBoundingClientRect().top) / rect.height);
    }
    card.style.setProperty('--covered', covered.toFixed(3));
  }
}

export default function Works() {
  const sectionRef = useScrollReveal(0.15);
  const stackRef = useScrollEffect(setStackDepth);

  return (
    <section className="section works" id="work" ref={sectionRef}>
      <div className="container">
        <SectionHead index="03" title="Selected work" note="Each diagram shows how the project works" />

        <div className="stack" ref={stackRef}>
          {projects.map((project, index) => (
            <article className="pcard" key={project.id} style={{ '--i': index }} data-tone={index % 3}>
              <div className="pcard__body">
                <div className="pcard__figure reveal">
                  <ProjectFigure id={project.figure} />
                </div>

                <div className="pcard__info">
                  <p className="pcard__meta">
                    <span className="pcard__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="pcard__category">{project.category}</span>
                  </p>
                  <h3 className="pcard__title">{project.title}</h3>
                  <p className="pcard__desc">{project.description}</p>
                  {project.note && <p className="pcard__note">{project.note}</p>}

                  <ul className="tags" aria-label="Stack">
                    {project.stack.split(', ').map((tool) => (
                      <li className="tag" key={tool}>{tool}</li>
                    ))}
                  </ul>

                  <div className="pcard__links">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
                        Source on GitHub
                        <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
                        Live site
                        <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </a>
                    )}
                    {project.isClosedSource && (
                      <span className="pcard__private">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        Private repository
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
