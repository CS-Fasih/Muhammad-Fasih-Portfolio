import { Link, useLocation } from 'react-router-dom';
import LocalTime from './LocalTime';

const links = [
  { label: 'GitHub', href: 'https://github.com/CS-Fasih' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/muhammad-fasih-19f' },
  { label: 'Email', href: 'mailto:muhammadfasih146@gmail.com' },
];

export default function Footer() {
  const location = useLocation();
  const year = new Date().getFullYear();

  const backToTop = (event) => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <p className="footer__name">Muhammad Fasih</p>
          <p className="footer__muted">Research Scholar &amp; AR/VR Systems Developer, NED</p>
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
                className="text-link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/activity" className="text-link">Activity</Link>
          </li>
        </ul>

        <div className="footer__col footer__end">
          <p className="footer__muted">© {year} Muhammad Fasih</p>
          <Link to="/#home" className="text-link" onClick={backToTop}>Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
