import useScrollReveal from '../hooks/useScrollReveal';
import { Link, useLocation } from 'react-router-dom';
import portfolioContent from '../data/portfolio';

const { footer } = portfolioContent;

function SocialIcon({ icon }) {
  const letter = { linkedin: 'in', fiverr: 'F', email: '@' }[icon];
  if (letter) return <span className="footer__social-letter" aria-hidden="true">{letter}</span>;

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default function Footer() {
  const sectionRef = useScrollReveal();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleSectionClick = (event, sectionId) => {
    if (location.pathname !== '/') return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
    window.scrollTo({
      top: Math.max(section.offsetTop - navbarHeight, 0),
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer" ref={sectionRef}>
      <div className="container">
        <div className="footer__grid reveal">
          <div className="footer__brand">
            <Link to="/#home" onClick={(event) => handleSectionClick(event, 'home')} className="navbar__logo footer__logo" aria-label={footer.homepageLabel}>
              {footer.firstName} <span>{footer.lastName}</span>
            </Link>
            <p className="footer__brand-desc">{footer.description}</p>
            <div className="footer__social">
              {footer.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="footer__social-icon"
                  aria-label={link.label}
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer__column">
            <h4>{footer.quickLinksTitle}</h4>
            <ul>
              {footer.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={link.sectionId ? (event) => handleSectionClick(event, link.sectionId) : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__contact">
            <h4 className="footer__title">{footer.contactTitle}</h4>
            <div className="footer__contact-item">
              <div className="footer__contact-icon"><EmailIcon /></div>
              <div className="footer__contact-text">
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__copyright">
          © {currentYear} {footer.copyrightName}.
        </div>
      </div>
    </footer>
  );
}
