import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { id: 'home', label: 'Home', desktop: false },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'certifications', label: 'Certs', mobileLabel: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

const scrollToSection = (sectionId, behavior = 'smooth') => {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
  window.scrollTo({
    top: Math.max(section.offsetTop - navbarHeight, 0),
    behavior,
  });
  return true;
};

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isActivityPage = location.pathname === '/activity';
  const hamburgerRef = useRef(null);
  const progressRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isHomePage ? 'home' : '');
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen);

    const handleEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        window.requestAnimationFrame(() => hamburgerRef.current?.focus());
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  // Scroll state: transparent bar at the top, progress bar, active section.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      setAtTop(scrollY < 24);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      }

      if (!isHomePage) return;
      const probe = scrollY + 120;
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(sections[index].id);
        if (section && section.offsetTop <= probe) {
          setActiveSection(sections[index].id);
          break;
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
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
    const frame = window.requestAnimationFrame(() => {
      scrollToSection(sectionId, 'smooth');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isHomePage, location.hash]);

  const handleNavClick = (event, sectionId) => {
    setMenuOpen(false);
    if (!isHomePage) return;

    event.preventDefault();
    scrollToSection(sectionId);
  };

  const renderSectionLink = (section, mobile = false, index = 0) => (
    <Link
      key={section.id}
      to={`/#${section.id}`}
      className={`${mobile ? 'mobile-nav__link' : 'navbar__link'} ${
        isHomePage && activeSection === section.id ? 'active' : ''
      }`}
      onClick={(event) => handleNavClick(event, section.id)}
      aria-current={isHomePage && activeSection === section.id ? 'location' : undefined}
      tabIndex={mobile && !menuOpen ? -1 : undefined}
      style={mobile ? { '--i': index } : undefined}
    >
      {mobile && <span className="mobile-nav__index">0{index + 1}</span>}
      {mobile ? section.mobileLabel || section.label : section.label}
    </Link>
  );

  const navClass = [
    'navbar',
    isHomePage && atTop && !menuOpen ? 'navbar--top' : '',
    menuOpen ? 'navbar--menu-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navClass} id="navbar" aria-label="Primary navigation">
        <div className="container navbar__inner">
          <Link
            to="/#home"
            className="navbar__logo"
            onClick={(event) => handleNavClick(event, 'home')}
            aria-label="Muhammad Fasih — homepage"
          >
            <span className="navbar__mark" aria-hidden="true">MF</span>
            <span className="navbar__name">
              Muhammad <span>Fasih</span>
            </span>
          </Link>

          <div className="navbar__links">
            {sections.filter((section) => section.desktop !== false).map((section) => renderSectionLink(section))}
          </div>

          <div className="navbar__actions">
            <Link
              to="/activity"
              className={`navbar__activity-cta ${isActivityPage ? 'active' : ''}`}
              aria-current={isActivityPage ? 'page' : undefined}
            >
              My Activity
            </Link>

            <button
              ref={hamburgerRef}
              type="button"
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <span className="navbar__progress" ref={progressRef} aria-hidden="true" />
      </nav>

      <button
        type="button"
        className={`mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => {
          setMenuOpen(false);
          window.requestAnimationFrame(() => hamburgerRef.current?.focus());
        }}
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
      />
      <aside
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav__links">
          {sections.map((section, index) => renderSectionLink(section, true, index))}
          <span className="mobile-nav__spacer" aria-hidden="true" />
          <Link
            to="/activity"
            className={`mobile-nav__activity-cta ${isActivityPage ? 'active' : ''}`}
            aria-current={isActivityPage ? 'page' : undefined}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            My Activity
          </Link>
        </div>
      </aside>
    </>
  );
}
