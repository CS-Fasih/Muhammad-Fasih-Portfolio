import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import SectionHead from './SectionHead';
import certifications from '../data/certifications';

const PAGE_SIZE = 8;
const categories = ['All', ...new Set(certifications.map((cert) => cert.category))];
const countFor = (category) => (category === 'All'
  ? certifications.length
  : certifications.filter((cert) => cert.category === category).length);

export default function Certifications() {
  const sectionRef = useScrollReveal();
  const [activeTab, setActiveTab] = useState('All');
  const [expanded, setExpanded] = useState(false);

  const filtered = activeTab === 'All'
    ? certifications
    : certifications.filter((cert) => cert.category === activeTab);
  const visible = expanded ? filtered : filtered.slice(0, PAGE_SIZE);

  const selectTab = (tab) => {
    setActiveTab(tab);
    setExpanded(false);
  };

  return (
    <section className="section certs" id="certifications" ref={sectionRef}>
      <div className="container">
        <SectionHead index="05" title="Certifications" note={`${certifications.length} completed courses`} />

        <div className="certs__layout">
          <aside className="certs__side reveal">
            <div className="pills pills--stack" role="group" aria-label="Filter certifications by category">
              {categories.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`pill${activeTab === tab ? ' is-active' : ''}`}
                  aria-pressed={activeTab === tab}
                  onClick={() => selectTab(tab)}
                >
                  {tab}
                  <span className="pill__count">{countFor(tab)}</span>
                </button>
              ))}
            </div>
            <a
              href="https://www.linkedin.com/in/muhammad-fasih-19f/"
              target="_blank"
              rel="noopener noreferrer"
              className="link certs__verify"
            >
              Verify on LinkedIn
            </a>
          </aside>

          <div className="certs__main reveal">
            <ul className="cert-list" key={activeTab}>
              {visible.map((cert, index) => (
                <li className="cert" key={cert.id} style={{ '--i': index % PAGE_SIZE }}>
                  <span className="cert__title">{cert.title}</span>
                  <span className="cert__provider">{cert.provider}</span>
                  <span className="cert__date">{cert.date}</span>
                </li>
              ))}
            </ul>

            {filtered.length > PAGE_SIZE && (
              <button type="button" className="btn btn--sm btn--ghost certs__toggle" onClick={() => setExpanded((open) => !open)}>
                {expanded ? 'Show fewer' : `Show all ${filtered.length}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
