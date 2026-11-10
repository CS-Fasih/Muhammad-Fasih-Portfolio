import { Link, useLocation } from 'react-router-dom';
import LocalTime from './LocalTime';
import { clamp, useScrollEffect } from '../hooks/useMotion';
import { contactLinks, currentRole } from '../data/profile';

const links = [
  { label: 'GitHub', href: contactLinks.github },
  { label: 'LinkedIn', href: contactLinks.linkedin },
  { label: 'Email', href: `mailto:${contactLinks.email}` },
];

// The big name slides in from the side as the footer comes into view.
function setFooterProgress(node, viewport) {
  const rect = node.getBoundingClientRect();
  node.style.setProperty('--p', clamp((viewport - rect.top) / Math.max(rect.height, 1)).toFixed(3));
}

export default function Footer() {
  const location = useLocation();
  const year = new Date().getFullYear();
  const footerRef = useScrollEffect(setFooterProgress);

  const backToTop = (event) => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" ref={footerRef}>
      <div className="container footer__inner">
        <div className="footer__col">
          <p className="footer__name">Muhammad Fasih</p>
          <p className="footer__muted">{currentRole.title}, {currentRole.organization}</p>
        </div>

        <div className="footer__col">
          <p className="footer__muted">Karachi, Pakistan</p>
          <p className="footer__muted">
            Local time <LocalTime />
          </p>
        </div>

        <ul className="footer__col footer__links">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/activity" className="link">Activity</Link>
          </li>
        </ul>

        <div className="footer__col footer__end">
          <p className="footer__muted">&copy; {year} Muhammad Fasih</p>
          <Link to="/#home" className="link" onClick={backToTop}>Back to top</Link>
        </div>
      </div>

      <p className="footer__giant" aria-hidden="true">
        <span className="stereo" data-text="Muhammad Fasih">Muhammad Fasih</span>
      </p>
    </footer>
  );
}
