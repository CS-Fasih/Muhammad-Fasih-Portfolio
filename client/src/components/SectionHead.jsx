// Numbered heading shared by every homepage section. Each word of the title rises
// into place when the header scrolls into view (the parent adds .visible).
export default function SectionHead({ index, title, note, children }) {
  const words = title.split(' ');

  return (
    <header className="shead reveal">
      <p className="shead__index" aria-hidden="true">
        <span>{index}</span>
      </p>
      <h2 className="shead__title" aria-label={title}>
        {words.map((word, position) => (
          <span className="shead__word" key={`${word}-${position}`} aria-hidden="true">
            <span style={{ '--i': position }}>{word}</span>
          </span>
        ))}
      </h2>
      {note && <p className="shead__note">{note}</p>}
      {children}
    </header>
  );
}
