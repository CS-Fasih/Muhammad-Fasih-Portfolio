import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import certifications from '../data/certifications';

const PAGE_SIZE = 8;
const categories = ['All', ...new Set(certifications.map((cert) => cert.category))];

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
        <header className="section-head reveal">
          <h2>Certifications</h2>
          <a
            href="https://www.linkedin.com/in/muhammad-fasih-19f/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link section-head__note"
          >
            Verify on LinkedIn
          </a>
        </header>

        <div className="tabs tabs--wrap reveal" role="group" aria-label="Filter certifications by category">
          {categories.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab ${activeTab === tab ? 'is-active' : ''}`}
              aria-pressed={activeTab === tab}
              onClick={() => selectTab(tab)}
            >
              {tab}
              <sup>
                {tab === 'All' ? certifications.length : certifications.filter((cert) => cert.category === tab).length}
              </sup>
            </button>
          ))}
        </div>

        <div className="reveal">
          <ul className="cert-table" key={activeTab}>
            {visible.map((cert, index) => (
              <li className="cert-table__row" key={cert.id} style={{ '--i': index % PAGE_SIZE }}>
                <span className="cert-table__title">{cert.title}</span>
                <span className="cert-table__provider">{cert.provider}</span>
                <span className="cert-table__date">{cert.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {filtered.length > PAGE_SIZE && (
          <button type="button" className="text-link certs__toggle" onClick={() => setExpanded((open) => !open)}>
            {expanded ? 'Show fewer' : `Show all ${filtered.length}`}
          </button>
        )}
      </div>
    </section>
  );
}
