import useScrollReveal from '../hooks/useScrollReveal';
import { experience } from '../data/profile';

export default function Experience() {
  const sectionRef = useScrollReveal();

  return (
    <section className="section experience" id="experience" ref={sectionRef}>
      <div className="container">
        <header className="section-head reveal">
          <h2>Experience</h2>
          <p className="section-head__note">Work and education, newest first</p>
        </header>

        <ol className="cv">
          {experience.map((item) => (
            <li className="cv__row reveal" key={item.id}>
              <div className="cv__when">
                <span>{item.period}</span>
                {item.current && <span className="cv__current">Current</span>}
              </div>
              <div className="cv__what">
                <h3 className="cv__role">{item.role}</h3>
                <p className="cv__org">
                  {item.organization}, {item.location}
                </p>
              </div>
              <div className="cv__detail">
                <p>{item.summary}</p>
                {item.points.length > 0 && (
                  <ul className="cv__points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.tools && <p className="cv__tools">{item.tools}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
