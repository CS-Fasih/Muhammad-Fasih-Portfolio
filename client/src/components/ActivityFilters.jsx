import { ACTIVITY_CATEGORIES } from '../lib/activity';

export default function ActivityFilters({ selected, onChange, disabled = false }) {
  return (
    <nav className="activity-filters" aria-label="Filter activities by category">
      <ul className="activity-filters__list">
        {ACTIVITY_CATEGORIES.map(({ value, label }) => (
          <li key={value}>
            <button
              className={`activity-filters__button${selected === value ? ' active' : ''}`}
              type="button"
              aria-pressed={selected === value}
              onClick={() => onChange(value)}
              disabled={disabled}
            >
              {label.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
