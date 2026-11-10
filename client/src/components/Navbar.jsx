import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contactLinks } from '../data/profile';

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
  window.scrollTo({ top: Math.max(section.offsetTop - 70, 0), behavior });
  return true;
};

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isActivityPage = location.pathname === '/activity';
  const menuButtonRef = useRef(null);
  const linksRef = useRef(null);
  const progressRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hovered, setHovered] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const current = isActivityPage ? 'activity' : activeSection;
  const highlighted = hovered || current;

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

  // Bar background after the first scroll, hide while scrolling down, page progress,
  // and which section is on screen.
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('--scroll', max > 0 ? (y / max).toFixed(4) : '0');
      setScrolled(y > 12);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 480);
        lastY = y;
      }

      if (!isHomePage) return;
      const probe = y + window.innerHeight * 0.35;
      let next = '';
      sections.forEach((section) => {
        const node = document.getElementById(section.id);
        if (node && node.offsetTop <= probe) next = section.id;
      });
      setActiveSection(next);
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

  // Slide the dark pill under whichever link is hovered or current.
  const placeIndicator = useCallback(() => {
    const list = linksRef.current;
    if (!list) return;
    const target = highlighted ? list.querySelector(`[data-nav="${highlighted}"]`) : null;
    if (!target) {
      list.style.setProperty('--pill-o', '0');
      return;
    }
    list.style.setProperty('--pill-x', `${target.offsetLeft}px`);
    list.style.setProperty('--pill-w', `${target.offsetWidth}px`);
    list.style.setProperty('--pill-o', '1');
  }, [highlighted]);

  useLayoutEffect(() => {
    placeIndicator();
  }, [placeIndicator]);

  useEffect(() => {
    window.addEventListener('resize', placeIndicator);
    document.fonts?.ready.then(placeIndicator).catch(() => {});
    return () => window.removeEventListener('resize', placeIndicator);
  }, [placeIndicator]);

  const handleNavClick = (event, sectionId) => {
    setMenuOpen(false);
    if (!isHomePage) return;
    event.preventDefault();
    if (sectionId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToSection(sectionId);
  };

  const navClass = [
    'nav',
    scrolled || !isHomePage ? 'nav--solid' : '',
    hidden && !menuOpen ? 'nav--hidden' : '',
    menuOpen ? 'nav--open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div className="progress" ref={progressRef} aria-hidden="true" />

      <header className={navClass} id="navbar">
        <div className="nav__bar">
          <Link
            to="/#home"
            className="nav__logo"
            aria-label="Muhammad Fasih, home"
            onClick={(event) => handleNavClick(event, 'home')}
          >
            <span className="nav__mark" aria-hidden="true">MF</span>
            <span className="nav__name">Muhammad Fasih</span>
          </Link>

          <nav
            className="nav__links"
            ref={linksRef}
            aria-label="Primary navigation"
            onMouseLeave={() => setHovered('')}
          >
            <span className="nav__pill" aria-hidden="true" />
            {sections.map((section) => (
              <Link
                key={section.id}
                to={`/#${section.id}`}
                data-nav={section.id}
                className={`nav__link${highlighted === section.id ? ' is-on' : ''}`}
                aria-current={isHomePage && activeSection === section.id ? 'location' : undefined}
                onMouseEnter={() => setHovered(section.id)}
                onFocus={() => setHovered(section.id)}
                onBlur={() => setHovered('')}
                onClick={(event) => handleNavClick(event, section.id)}
              >
                {section.label}
              </Link>
            ))}
            <Link
              to="/activity"
              data-nav="activity"
              className={`nav__link${highlighted === 'activity' ? ' is-on' : ''}`}
              aria-current={isActivityPage ? 'page' : undefined}
              onMouseEnter={() => setHovered('activity')}
              onFocus={() => setHovered('activity')}
              onBlur={() => setHovered('')}
            >
              Activity
            </Link>
          </nav>

          <a href={`mailto:${contactLinks.email}`} className="btn btn--sm nav__cta" data-magnetic>
            Let&rsquo;s talk
            <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className="nav__menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="nav__menu-icon" aria-hidden="true"><i /><i /></span>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav__inner" aria-label="Mobile navigation">
          {[{ id: 'home', label: 'Home' }, ...sections].map((section, index) => (
            <Link
              key={section.id}
              to={`/#${section.id}`}
              className={`mobile-nav__link${isHomePage && activeSection === section.id ? ' active' : ''}`}
              tabIndex={menuOpen ? undefined : -1}
              style={{ '--i': index }}
              onClick={(event) => handleNavClick(event, section.id)}
            >
              <span className="mobile-nav__index" aria-hidden="true">{String(index).padStart(2, '0')}</span>
              {section.label}
            </Link>
          ))}
          <Link
            to="/activity"
            className={`mobile-nav__link${isActivityPage ? ' active' : ''}`}
            tabIndex={menuOpen ? undefined : -1}
            style={{ '--i': sections.length + 1 }}
            onClick={() => setMenuOpen(false)}
          >
            <span className="mobile-nav__index" aria-hidden="true">{String(sections.length + 1).padStart(2, '0')}</span>
            Activity
          </Link>
          <p className="mobile-nav__foot" style={{ '--i': sections.length + 2 }}>
            <a href={`mailto:${contactLinks.email}`} tabIndex={menuOpen ? undefined : -1}>
              {contactLinks.email}
            </a>
          </p>
        </nav>
      </div>
    </>
  );
}
