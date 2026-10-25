import useScrollReveal from '../hooks/useScrollReveal';
import services from '../data/services';
import portfolioContent from '../data/portfolio';

const { about } = portfolioContent;

function ServiceIcon({ id }) {
  const common = {
    width: 60,
    height: 60,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (id === 1) return <svg {...common}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
  if (id === 2) return <svg {...common}><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.92L12 10v2" /><circle cx="12" cy="16" r="4" /><path d="M8 16H4M20 16h-4M12 20v2M4 4l4 4M20 4l-4 4" /></svg>;
  if (id === 3) return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (id === 4) return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" /></svg>;
  return <svg {...common}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><polyline points="13 2 13 9 20 9" /><path d="M10 13h4M10 17h4" /></svg>;
}

export default function About() {
  const sectionRef = useScrollReveal();

  const handleViewProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('work');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__heading reveal">
        <h2>{about.title}</h2>
      </div>

      <div className="container">
        <div className="services-grid reveal">
          {services.map((service) => (
            <div className="service-item" key={service.id}>
              <div className="service-item__icon"><ServiceIcon id={service.id} /></div>
              <span className="service-item__label">{service.title}</span>
            </div>
          ))}
        </div>

        <div className="about__intro reveal">
          <div className="about__intro-left">
            <h3>
              {about.introductionTitle}<br />
              {about.introductionSubtitle}
            </h3>
            {about.introduction.slice(0, 1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <div className="about__intro-center">
            <img
              src="/images/about-photo.png"
              alt={about.introductionImageAlt}
            />
          </div>

          <div className="about__intro-right">
            {about.introduction.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <a href="#work" className="btn-primary" onClick={handleViewProjects}>{about.viewProjectsAction}</a>
          </div>
        </div>

        <div className="profile-grid reveal">
          <section className="profile-section" aria-labelledby="profile-experience-title">
            <h3 className="profile-section__heading" id="profile-experience-title">{about.experienceTitle}</h3>
            <div className="profile-timeline">
              {about.experience.map((entry) => (
                <article className="profile-entry" key={`${entry.role}-${entry.organization}`}>
                  <p className="profile-entry__period">{entry.period}</p>
                  <h4 className="profile-entry__title">{entry.role}</h4>
                  {entry.url ? (
                    <a className="profile-entry__organization" href={entry.url} target="_blank" rel="noopener noreferrer">
                      {entry.organization}
                    </a>
                  ) : (
                    <p className="profile-entry__organization">{entry.organization}</p>
                  )}
                  <p className="profile-entry__description">{entry.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="profile-section" aria-labelledby="profile-education-title">
            <h3 className="profile-section__heading" id="profile-education-title">{about.educationTitle}</h3>
            <div className="profile-timeline">
              {about.education.map((entry) => (
                <article className="profile-entry" key={`${entry.title}-${entry.date}`}>
                  <p className="profile-entry__period">{entry.date}</p>
                  <h4 className="profile-entry__title">{entry.title}</h4>
                  <p className="profile-entry__organization">{entry.institution}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="profile-section profile-skills reveal" aria-labelledby="profile-skills-title">
          <h3 className="profile-section__heading" id="profile-skills-title">{about.skillsTitle}</h3>
          <div className="profile-skills__grid">
            {about.skillGroups.map((group) => (
              <div className="profile-skill-group" key={group.title}>
                <h4 className="profile-skill-group__title">{group.title}</h4>
                <ul className="profile-skill-group__list">
                  {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <h3 className="profile-section__heading profile-capabilities__heading">{about.capabilitiesTitle}</h3>
        <div className="numbered-list reveal">
          {about.capabilities.map((capability) => (
            <div className="numbered-item" key={capability.number}>
              <div className="numbered-item__number">{capability.number}</div>
              <div className="numbered-item__title">{capability.title}</div>
              <div className="numbered-item__divider" />
              <div className="numbered-item__desc">{capability.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
