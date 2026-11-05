import { Link, useLocation } from 'react-router-dom';
import { currentRole } from '../data/profile';

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/CS-Fasih',
    icon: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/muhammad-fasih-19f',
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:muhammadfasih146@gmail.com',
    icon: (
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    ),
  },
];

const quickLinks = [
  { label: 'About', sectionId: 'about' },
  { label: 'Experience', sectionId: 'experience' },
  { label: 'Work', sectionId: 'work' },
  { label: 'Contact', sectionId: 'contact' },
];

export default function Footer() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleSectionClick = (event, sectionId) => {
    if (location.pathname !== '/') return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
    window.scrollTo({
      top: Math.max(section.offsetTop - navbarHeight, 0),
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/#home" onClick={(event) => handleSectionClick(event, 'home')} className="footer__logo">
              Muhammad <span>Fasih</span>
            </Link>
            <p className="footer__desc">
              Software engineer building AR/VR, AI, and full-stack systems from Karachi, Pakistan.
            </p>
            <p className="footer__now">
              <span className="pulse-dot pulse-dot--small" aria-hidden="true" />
              {currentRole.title} · {currentRole.organization}
            </p>
          </div>

          <nav className="footer__column" aria-label="Footer">
            <h2 className="footer__title">Explore</h2>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.sectionId}>
                  <Link to={`/#${link.sectionId}`} onClick={(event) => handleSectionClick(event, link.sectionId)}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><Link to="/activity">My Activity</Link></li>
            </ul>
          </nav>

          <div className="footer__column">
            <h2 className="footer__title">Connect</h2>
            <div className="footer__social">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="footer__social-icon"
                  aria-label={link.label}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{link.icon}</svg>
                </a>
              ))}
            </div>
            <a className="footer__mail" href="mailto:muhammadfasih146@gmail.com">muhammadfasih146@gmail.com</a>
          </div>
        </div>

        <p className="footer__wordmark" aria-hidden="true">FASIH</p>

        <div className="footer__bottom">
          <span>© {currentYear} Muhammad Fasih</span>
          <span>Designed &amp; built in Karachi</span>
        </div>
      </div>
    </footer>
  );
}
