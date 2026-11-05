import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';
import certifications from '../data/certifications';

const PAGE_SIZE = 6;

const providerColors = {
  'Frontend Masters': '#ff5a5f',
  Educative: '#8b8bff',
  LinkedIn: '#3d9bff',
  Google: '#5b9bff',
  Udemy: '#b77bff',
  Meta: '#4d8dff',
  HP: '#33b5ff',
  Simplilearn: '#ff8a3d',
  DataCamp: '#3ef08a',
  'UC Davis': '#ffc46b',
};

const categories = [...new Set(certifications.map((cert) => cert.category))];

export default function Certifications() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
  const [activeTab, setActiveTab] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const tabs = ['All', ...categories];
  const filtered = activeTab === 'All'
    ? certifications
    : certifications.filter((cert) => cert.category === activeTab);
  const visibleCertifications = filtered.slice(0, visibleCount);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="section certs" id="certifications" ref={sectionRef}>
      <div className="container" ref={pointerRef}>
        <header className="section-head section-head--split reveal">
          <div>
            <span className="eyebrow">04 · Certifications</span>
            <h2>
              Always <em>learning</em>.
            </h2>
          </div>
          <div className="certs__intro">
            <p>
              {certifications.length} certifications from Meta, Google, Udemy, LinkedIn, Frontend Masters,
              and others.
            </p>
            <a
              href="https://www.linkedin.com/in/muhammad-fasih-19f/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-pill"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
              </svg>
              Verify on LinkedIn
            </a>
          </div>
        </header>

        <div className="filter-bar reveal" role="group" aria-label="Filter certifications by category">
          {tabs.map((tab) => {
            const count = tab === 'All'
              ? certifications.length
              : certifications.filter((cert) => cert.category === tab).length;
            return (
              <button
                key={tab}
                type="button"
                className={`filter-chip ${activeTab === tab ? 'is-active' : ''}`}
                aria-pressed={activeTab === tab}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
                <span className="filter-chip__count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="reveal">
          <div className="certs__grid" key={activeTab}>
            {visibleCertifications.map((cert, index) => {
              const color = providerColors[cert.provider] || '#a1a1aa';
              return (
                <article
                  className="cert-tile spot"
                  key={cert.id}
                  style={{ '--provider': color, '--i': index % PAGE_SIZE }}
                >
                  <div className="cert-tile__head">
                    <span className="cert-tile__provider">{cert.provider}</span>
                    <span className="cert-tile__date">{cert.date}</span>
                  </div>
                  <h3 className="cert-tile__title">{cert.title}</h3>
                  <ul className="chip-list chip-list--small">
                    {cert.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>

        {visibleCount < filtered.length && (
          <div className="certs__more">
            <button
              type="button"
              className="x-btn x-btn--ghost"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Show more ({filtered.length - visibleCount} left)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
