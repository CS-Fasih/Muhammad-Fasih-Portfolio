import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import SectionHead from './SectionHead';
import otherProjects from '../data/otherProjects';

const categories = ['All', ...new Set(otherProjects.map((project) => project.category))];
const countFor = (category) => (category === 'All'
  ? otherProjects.length
  : otherProjects.filter((project) => project.category === category).length);

export default function OtherProjects() {
  const sectionRef = useScrollReveal();
  const [active, setActive] = useState('All');

  const visible = active === 'All'
    ? otherProjects
    : otherProjects.filter((project) => project.category === active);

  return (
    <section className="section archive" id="other-projects" ref={sectionRef}>
      <div className="container">
        <SectionHead index="04" title="Other projects" note="Smaller builds, coursework and experiments" />

        <div className="pills reveal" role="group" aria-label="Filter projects by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`pill${active === category ? ' is-active' : ''}`}
              aria-pressed={active === category}
              onClick={() => setActive(category)}
            >
              {category}
              <span className="pill__count">{countFor(category)}</span>
            </button>
          ))}
        </div>

        <ul className="archive__grid" key={active}>
          {visible.map((project, index) => (
            <li key={project.id} style={{ '--i': index }}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mini"
                data-spot
              >
                <span className="mini__top">
                  <span className="mini__cat">{project.category}</span>
                  <svg className="mini__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
                <span className="mini__title">{project.title}</span>
                <span className="mini__desc">{project.description}</span>
                <span className="mini__stack">{project.techStack.join(' / ')}</span>
                <span className="sr-only">(GitHub, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
