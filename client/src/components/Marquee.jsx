// A band of words that scrolls sideways forever. The list is rendered twice so the
// loop has no seam; the copy is hidden from screen readers.
export default function Marquee({ items, variant = 'solid', reverse = false }) {
  return (
    <div className={`marquee marquee--${variant}${reverse ? ' marquee--reverse' : ''}`}>
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul className="marquee__list" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <li className="marquee__item" key={item}>
                <span>{item}</span>
                <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12 6.6-.9 11.1-5.4 12-12Z" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
