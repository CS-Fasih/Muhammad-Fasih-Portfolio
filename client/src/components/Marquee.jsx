import { marquee } from '../data/profile';

function Row({ hidden = false }) {
  return (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {marquee.map((item) => (
        <li key={item} className="marquee__item">
          <span className="marquee__spark" aria-hidden="true">✦</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" role="region" aria-label="Tools and technologies">
      <div className="marquee__track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
