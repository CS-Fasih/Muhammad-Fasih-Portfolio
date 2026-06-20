import useScrollReveal from '../hooks/useScrollReveal';
import projects from '../data/projects';

export default function Works() {
  const sectionRef = useScrollReveal();

  return (
    <section className="works" id="work" ref={sectionRef}>
      <div className="container">
        <div className="works__heading reveal">
          <h2>My Work</h2>
          <p>
            A selection of projects spanning full-stack web development, AI/ML systems,
            and cyber security tools — all deployed and documented.
          </p>
        </div>

        {projects.map((project) => (
          <div className="project-card reveal" key={project.id}>
            <div className="project-card__image">
              <img src={project.image} alt={project.title} loading="lazy" />
            </div>

            <div className="project-card__info">
              <div className="project-card__category">{project.category}</div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>

              <div className="project-card__tech">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="project-card__author">
                <div className="project-card__avatar">MF</div>
                <div className="project-card__author-info">
                  <span className="project-card__author-name">Muhammad Fasih</span>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__author-url"
                  >
                    {project.githubUrl.replace('https://github.com/', 'github.com/')}
                  </a>
                </div>
              </div>

              {(project.githubUrl || project.liveUrl) && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '10px 28px', fontSize: '12px' }}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
