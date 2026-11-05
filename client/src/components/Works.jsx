import useScrollReveal from '../hooks/useScrollReveal';
import ProjectFigure from './ProjectFigure';
import projects from '../data/projects';

export default function Works() {
  const sectionRef = useScrollReveal(0.2);

  return (
    <section className="section works" id="work" ref={sectionRef}>
      <div className="container">
        <header className="section-head reveal">
          <h2>Selected work</h2>
          <p className="section-head__note">Each diagram shows how the project works</p>
        </header>

        <div className="projects">
          {projects.map((project, index) => (
            <article className="project" key={project.id}>
              <div className="project__figure reveal">
                <div className="project__clip">
                  <ProjectFigure id={project.figure} />
                </div>
              </div>

              <div className="project__info reveal">
                <p className="project__meta">
                  <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{project.category}</span>
                </p>
                <h3 className="project__title">{project.title}</h3>
                <p className="project__desc">{project.description}</p>
                {project.note && <p className="project__note">{project.note}</p>}

                <dl className="project__stack">
                  <dt>Stack</dt>
                  <dd>{project.stack}</dd>
                </dl>

                <div className="project__links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                      Source on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                      Live site
                    </a>
                  )}
                  {project.isClosedSource && <span className="project__private">Private repository</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
