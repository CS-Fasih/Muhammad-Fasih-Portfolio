import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

const scrollToSection = (sectionId, behavior = 'smooth') => {
  const section = document.getElementById(sectionId);
  if (!section) return false;
  window.scrollTo({ top: Math.max(section.offsetTop - 64, 0), behavior });
  return true;
};

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isActivityPage = location.pathname === '/activity';
  const menuButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen);

    const handleEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Background after the first scroll, hide while scrolling down, track the current section.
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }

      if (!isHomePage) return;
      const probe = y + window.innerHeight * 0.35;
      let current = '';
      sections.forEach((section) => {
        const node = document.getElementById(section.id);
        if (node && node.offsetTop <= probe) current = section.id;
      });
      setActiveSection(current);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage || !location.hash) return undefined;
    const sectionId = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => scrollToSection(sectionId));
    return () => window.cancelAnimationFrame(frame);
  }, [isHomePage, location.hash]);

  const handleNavClick = (event, sectionId) => {
    setMenuOpen(false);
    if (!isHomePage) return;
    event.preventDefault();
    if (sectionId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToSection(sectionId);
  };

  const navClass = [
    'navbar',
    scrolled || !isHomePage ? 'navbar--solid' : '',
    hidden && !menuOpen ? 'navbar--hidden' : '',
    menuOpen ? 'navbar--open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navClass} id="navbar" aria-label="Primary navigation">
        <div className="container navbar__inner">
          <Link to="/#home" className="navbar__logo" onClick={(event) => handleNavClick(event, 'home')}>
            Muhammad Fasih
          </Link>

          <div className="navbar__links">
            {sections.map((section) => (
              <Link
                key={section.id}
                to={`/#${section.id}`}
                className={`navbar__link ${isHomePage && activeSection === section.id ? 'active' : ''}`}
                aria-current={isHomePage && activeSection === section.id ? 'location' : undefined}
                onClick={(event) => handleNavClick(event, section.id)}
              >
                {section.label}
              </Link>
            ))}
            <Link
              to="/activity"
              className={`navbar__link ${isActivityPage ? 'active' : ''}`}
              aria-current={isActivityPage ? 'page' : undefined}
            >
              Activity
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="navbar__menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <div
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <nav className="container mobile-nav__inner" aria-label="Mobile navigation">
          {[{ id: 'home', label: 'Home' }, ...sections].map((section, index) => (
            <Link
              key={section.id}
              to={`/#${section.id}`}
              className={`mobile-nav__link ${isHomePage && activeSection === section.id ? 'active' : ''}`}
              tabIndex={menuOpen ? undefined : -1}
              style={{ '--i': index }}
              onClick={(event) => handleNavClick(event, section.id)}
            >
              {section.label}
            </Link>
          ))}
          <Link
            to="/activity"
            className={`mobile-nav__link ${isActivityPage ? 'active' : ''}`}
            tabIndex={menuOpen ? undefined : -1}
            style={{ '--i': sections.length + 1 }}
            onClick={() => setMenuOpen(false)}
          >
            Activity
          </Link>
          <p className="mobile-nav__foot" style={{ '--i': sections.length + 2 }}>
            <a href="mailto:muhammadfasih146@gmail.com" tabIndex={menuOpen ? undefined : -1}>
              muhammadfasih146@gmail.com
            </a>
          </p>
        </nav>
      </div>
    </>
  );
}
