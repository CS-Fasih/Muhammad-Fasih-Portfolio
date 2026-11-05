import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import otherProjects from '../data/otherProjects';

const categories = ['All', ...new Set(otherProjects.map((project) => project.category))];

export default function OtherProjects() {
  const sectionRef = useScrollReveal();
  const [active, setActive] = useState('All');

  const visible = active === 'All'
    ? otherProjects
    : otherProjects.filter((project) => project.category === active);

  return (
    <section className="section archive" id="other-projects" ref={sectionRef}>
      <div className="container">
        <header className="section-head reveal">
          <h2>Other projects</h2>
          <div className="tabs" role="group" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`tab ${active === category ? 'is-active' : ''}`}
                aria-pressed={active === category}
                onClick={() => setActive(category)}
              >
                {category}
                <sup>
                  {category === 'All'
                    ? otherProjects.length
                    : otherProjects.filter((project) => project.category === category).length}
                </sup>
              </button>
            ))}
          </div>
        </header>

        <div className="index reveal">
          <div className="index__head" aria-hidden="true">
            <span>Project</span>
            <span>About</span>
            <span>Area</span>
            <span>Built with</span>
          </div>
          <ul key={active}>
            {visible.map((project, index) => (
              <li key={project.id} style={{ '--i': index }}>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="index__row">
                  <span className="index__title">{project.title}</span>
                  <span className="index__desc">{project.description}</span>
                  <span className="index__cat">{project.category}</span>
                  <span className="index__stack">{project.techStack.join(', ')}</span>
                  <span className="index__arrow" aria-hidden="true">↗</span>
                  <span className="sr-only">(GitHub, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
