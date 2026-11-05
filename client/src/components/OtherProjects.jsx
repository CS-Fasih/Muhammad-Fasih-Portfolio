import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';
import otherProjects from '../data/otherProjects';

const categories = ['All', ...new Set(otherProjects.map((project) => project.category))];

export default function OtherProjects() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
  const [active, setActive] = useState('All');

  const visible = active === 'All'
    ? otherProjects
    : otherProjects.filter((project) => project.category === active);

  return (
    <section className="section archive" id="other-projects" ref={sectionRef}>
      <div className="container" ref={pointerRef}>
        <header className="section-head section-head--split reveal">
          <div>
            <span className="eyebrow">More projects</span>
            <h2>
              The <em>archive</em>.
            </h2>
          </div>
          <p>
            Smaller builds and coursework across web, AI, systems programming, compilers, and games.
          </p>
        </header>

        <div className="filter-bar reveal" role="group" aria-label="Filter projects by category">
          {categories.map((category) => {
            const count = category === 'All'
              ? otherProjects.length
              : otherProjects.filter((project) => project.category === category).length;
            return (
              <button
                key={category}
                type="button"
                className={`filter-chip ${active === category ? 'is-active' : ''}`}
                aria-pressed={active === category}
                onClick={() => setActive(category)}
              >
                {category}
                <span className="filter-chip__count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="reveal">
          <div className="archive__grid" key={active}>
            {visible.map((project, index) => (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="archive-card spot"
                key={project.id}
                style={{ '--i': index }}
              >
                <div className="archive-card__top">
                  <span className="archive-card__category">{project.category}</span>
                  <svg className="archive-card__arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </div>
                <h3 className="archive-card__title">{project.title}</h3>
                <p className="archive-card__desc">{project.description}</p>
                <ul className="chip-list chip-list--small">
                  {project.techStack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <span className="sr-only">(opens GitHub in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
