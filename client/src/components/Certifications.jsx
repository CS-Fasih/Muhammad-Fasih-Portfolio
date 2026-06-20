import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import certifications from '../data/certifications';

/* ── Provider brand colors ── */
const providerColors = {
  MasterDev: '#e8192c',
  Educative: '#1a1a4e',
  LinkedIn: '#0A66C2',
  Google: '#4285F4',
  Udemy: '#A435F0',
  Meta: '#0668E1',
  HP: '#0096D6',
  Simplilearn: '#FF6F20',
  DataCamp: '#03EF62',
  'UC Davis': '#002855',
  'Frontend Masters': '#c02d28',
};

/* ── Unique categories from data ── */
const categories = [...new Set(certifications.map((c) => c.category))];

export default function Certifications() {
  const sectionRef = useScrollReveal();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', ...categories];

  const filtered =
    activeTab === 'All'
      ? certifications
      : certifications.filter((c) => c.category === activeTab);

  return (
    <section className="certifications" id="certifications" ref={sectionRef}>
      <div className="container">
        <div className="certifications__heading reveal">
          <h2>Certifications</h2>
          <p className="certifications__count">
            {certifications.length} professional certifications from industry leaders
          </p>
        </div>

        {/* Category Tabs */}
        <div className="cert-tabs reveal">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`cert-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'All' && (
                <span className="cert-tab__count">{certifications.length}</span>
              )}
              {tab !== 'All' && (
                <span className="cert-tab__count">
                  {certifications.filter((c) => c.category === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Compact Cert List */}
        <div className="cert-list reveal">
          {filtered.map((cert) => (
            <div className="cert-row" key={cert.id}>
              <div
                className="cert-row__accent"
                style={{
                  background: providerColors[cert.provider] || '#999',
                }}
              />
              <div className="cert-row__content">
                <div className="cert-row__main">
                  <h4 className="cert-row__title">{cert.title}</h4>
                  <div className="cert-row__meta">
                    <span
                      className="cert-row__provider"
                      style={{
                        color: providerColors[cert.provider] || '#999',
                      }}
                    >
                      {cert.provider}
                    </span>
                    <span className="cert-row__date">{cert.date}</span>
                  </div>
                </div>
                <div className="cert-row__skills">
                  {cert.skills.map((skill) => (
                    <span key={skill} className="cert-row__skill">
                      {skill}
                    </span>
                  ))}
                </div>
                <a
                  href="https://www.linkedin.com/in/muhammad-fasih-19f/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-row__linkedin"
                  aria-label="View on LinkedIn"
                  title="View on LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
