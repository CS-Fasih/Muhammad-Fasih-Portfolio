import { useState, useEffect } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const sections = ['home', 'about', 'work', 'certifications', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 70;
      const top = el.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="navbar" id="navbar">
        <div className="container">
          <a href="#home" className="navbar__logo" onClick={(e) => handleNavClick(e, 'home')}>
            a<span>v</span>o
          </a>

          <div className="navbar__links">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`navbar__link ${activeSection === section ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, section)}
              >
                {section === 'certifications' ? 'CERTS' : section.toUpperCase()}
              </a>
            ))}
          </div>

          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav__links">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`mobile-nav__link ${activeSection === section ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, section)}
            >
              {section === 'certifications' ? 'CERTIFICATIONS' : section.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
