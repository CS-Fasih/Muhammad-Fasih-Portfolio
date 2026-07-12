import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'work', label: 'WORK' },
  { id: 'certifications', label: 'CERTS', mobileLabel: 'CERTIFICATIONS' },
  { id: 'contact', label: 'CONTACT' },
];

const scrollToSection = (sectionId, behavior = 'smooth') => {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isHomePage ? 'home' : '');

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

  useEffect(() => {
    if (!isHomePage) {
      return undefined;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(sections[index].id);
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(sections[index].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const renderSectionLink = (section, mobile = false) => (
    <Link
      key={section.id}
      to={`/#${section.id}`}
      className={`${mobile ? 'mobile-nav__link' : 'navbar__link'} ${
        isHomePage && activeSection === section.id ? 'active' : ''
      }`}
      onClick={(event) => handleNavClick(event, section.id)}
      aria-current={isHomePage && activeSection === section.id ? 'location' : undefined}
      tabIndex={mobile && !menuOpen ? -1 : undefined}
    >
      {mobile ? section.mobileLabel || section.label : section.label}
    </Link>
  );

  return (
    <>
      <nav className="navbar" id="navbar" aria-label="Primary navigation">
        <div className="container">
          <Link
            to="/#home"
            className="navbar__logo"
            onClick={(event) => handleNavClick(event, 'home')}
            aria-label="Muhammad Fasih — homepage"
          >
            Muhammad <span>Fasih</span>
          </Link>

          <div className="navbar__links">
            {sections.map((section) => renderSectionLink(section))}
            <Link
              to="/activity"
              className={`navbar__activity-cta ${isActivityPage ? 'active' : ''}`}
              aria-current={isActivityPage ? 'page' : undefined}
            >
              My Activity
            </Link>
          </div>

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
            <span />
          </button>
        </div>
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
          {sections.map((section) => renderSectionLink(section, true))}
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
