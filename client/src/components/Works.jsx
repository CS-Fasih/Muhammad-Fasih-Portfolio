import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';
import projects from '../data/projects';

const arrow = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Works() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
  const total = String(projects.length).padStart(2, '0');

  return (
    <section className="section works" id="work" ref={sectionRef}>
      <div className="container" ref={pointerRef}>
        <header className="section-head section-head--split reveal">
          <div>
            <span className="eyebrow">03 · Selected work</span>
            <h2>
              Things I&apos;ve <em>shipped</em>.
            </h2>
          </div>
          <p>
            Projects across AI, security, and full-stack development, each one built, documented, and
            deployed rather than left as a demo.
          </p>
        </header>

        <div className="work-list">
          {projects.map((project, index) => {
            const number = String(index + 1).padStart(2, '0');
            return (
              <article className="work-card spot reveal" key={project.id}>
                <div className="work-card__media tilt">
                  <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />
                  <span className="work-card__shine" aria-hidden="true" />
                  <span className="work-card__number" aria-hidden="true">
                    {number}
                    <small>/{total}</small>
                  </span>
                </div>

                <div className="work-card__body">
                  <p className="work-card__category">
                    {project.category}
                    {project.isFyp && <span className="badge badge--accent">Final Year Project</span>}
                  </p>
                  <h3 className="work-card__title">{project.title}</h3>
                  <p className="work-card__desc">{project.description}</p>

                  <ul className="chip-list">
                    {project.techStack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  <div className="work-card__links">
                    {project.isClosedSource ? (
                      <span className="link-pill link-pill--muted">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                        Closed source
                      </span>
                    ) : project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="link-pill">
                        GitHub {arrow}
                      </a>
                    ) : null}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-pill link-pill--accent">
                        Live demo {arrow}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
