import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';
import { currentRole, experience, focusAreas } from '../data/profile';

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function FocusIcon({ id }) {
  if (id === 'xr') {
    return (
      <svg {...iconProps}>
        <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h13A2.5 2.5 0 0 1 21 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-3.7l-1.8-2.2h-2l-1.8 2.2H5.5A2.5 2.5 0 0 1 3 14.5Z" />
        <circle cx="8.2" cy="11.4" r="1.6" />
        <circle cx="15.8" cy="11.4" r="1.6" />
      </svg>
    );
  }
  if (id === 'ai') {
    return (
      <svg {...iconProps}>
        <rect x="6" y="6" width="12" height="12" rx="2.5" />
        <path d="M10 10h4v4h-4zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    );
  }
  if (id === 'web') {
    return (
      <svg {...iconProps}>
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" />
      </svg>
    );
  }
  return (
    <svg {...iconProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function About() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
  const previous = experience.find((item) => item.id === 'aidl');
  const education = experience.find((item) => item.education);

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container" ref={pointerRef}>
        <header className="section-head reveal">
          <span className="eyebrow">01 · About</span>
          <h2>
            Engineer by training, <em>builder</em> by habit.
          </h2>
        </header>

        <div className="bento">
          <article className="bento__card bento__card--intro spot reveal">
            <p className="bento__lead">
              I&apos;m a Computer Science graduate from Karachi who likes taking ideas all the way to
              working software, whether that is a VR simulation, a vision model, or a production web app.
            </p>
            <p>
              My recent work is in extended reality. At AIDL I built interactive VR and AR simulations
              with WorldViz Vizard and Python. Now, at NED, I research and develop AR/VR systems.
            </p>
            <p>
              Before XR, I built a multi-model satellite-imagery assistant for my final year project,
              endpoint security tools in C, and full-stack products on the MERN stack.
            </p>
          </article>

          <figure className="bento__card bento__card--photo reveal" style={{ '--d': '80ms' }}>
            <img src="/images/about-photo.png" alt="Muhammad Fasih's development workspace" loading="lazy" />
            <figcaption>
              <span className="pulse-dot pulse-dot--small" aria-hidden="true" /> Karachi, Pakistan
            </figcaption>
          </figure>

          <article className="bento__card bento__card--now spot reveal" style={{ '--d': '120ms' }}>
            <span className="bento__kicker">
              <span className="pulse-dot pulse-dot--small" aria-hidden="true" /> Now
            </span>
            <h3>{currentRole.title}</h3>
            <p>
              {currentRole.organization} · since {currentRole.since}
            </p>
          </article>

          <article className="bento__card bento__card--prev spot reveal" style={{ '--d': '160ms' }}>
            <span className="bento__kicker">Previously</span>
            <h3>{previous.role}</h3>
            <p>AIDL · {previous.period.replace(' — ', ' – ')}</p>
          </article>

          <article className="bento__card bento__card--edu spot reveal" style={{ '--d': '200ms' }}>
            <span className="bento__kicker">Education</span>
            <h3>BS Computer Science</h3>
            <p>DUET Karachi · {education.period.replace(' — ', ' – ')}</p>
          </article>

          <article className="bento__card bento__card--fun spot reveal" style={{ '--d': '240ms' }}>
            <span className="bento__kicker">Off the keyboard</span>
            <h3>Competitive chess</h3>
            <p>Rated around 2200. It shapes how I think about edge cases.</p>
          </article>
        </div>

        <div className="focus">
          <div className="focus__head reveal">
            <h3>What I work on</h3>
            <p>Four areas I keep coming back to, ordered by what I&apos;m doing right now.</p>
          </div>
          <div className="focus__grid">
            {focusAreas.map((area, index) => (
              <article
                className="focus-card spot reveal"
                key={area.id}
                style={{ '--d': `${index * 90}ms` }}
              >
                <div className="focus-card__top">
                  <span className="focus-card__icon">
                    <FocusIcon id={area.id} />
                  </span>
                  <span className="focus-card__index">0{index + 1}</span>
                </div>
                <h4>{area.title}</h4>
                <p>{area.description}</p>
                <ul className="chip-list">
                  {area.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
