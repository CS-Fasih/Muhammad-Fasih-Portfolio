import useScrollReveal from '../hooks/useScrollReveal';
import projects from '../data/projects';
import portfolioContent from '../data/portfolio';

const { work } = portfolioContent;

export default function Works() {
  const sectionRef = useScrollReveal();

  return (
    <section className="works" id="work" ref={sectionRef}>
      <div className="container">
        <div className="works__heading reveal">
          <h2>{work.title}</h2>
          <p>{work.description}</p>
        </div>

        {projects.map((project) => (
          <article className="project-card reveal" key={project.id}>
            <div className={`project-card__image${project.image ? '' : ' project-card__image--placeholder'}`}>
              {project.image ? (
                <img src={project.image} alt={project.title} loading="lazy" />
              ) : (
                <div className="project-card__image-note" role="img" aria-label={`${project.title}: ${work.missingImageLabel}`}>
                  {work.missingImageLabel}
                </div>
              )}
            </div>

            <div className="project-card__info">
              <div className="project-card__category">
                {project.category}
                {project.isFyp && (
                  <span className="project-card__fyp-tag">
                    &nbsp;&nbsp;&mdash;&nbsp;&nbsp;{work.finalYearProjectLabel}
                  </span>
                )}
              </div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>

              {project.recognition && (
                <p className="project-card__recognition">
                  <span>{work.awardLabel}</span>
                  {project.recognition}
                </p>
              )}

              {project.highlights && (
                <ul className="project-card__highlights">
                  {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              )}

              <div className="project-card__tech">
                {project.techStack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="project-card__author">
                <div className="project-card__avatar" aria-hidden="true">{work.authorMark}</div>
                <div className="project-card__author-info">
                  <span className="project-card__author-name">{work.authorName}</span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__author-url"
                    >
                      {project.githubUrl}
                    </a>
                  )}
                </div>
              </div>

              {(project.githubUrl || project.liveUrl || project.isClosedSource || project.linksTodo) && (
                <div className="project-card__links">
                  {project.isClosedSource ? (
                    <span className="project-card__closed-source">{work.closedSourceLabel}</span>
                  ) : project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      {work.githubLinkLabel}
                    </a>
                  ) : null}
                  {project.linksTodo && <span className="project-card__todo">{work.missingLinkLabel}</span>}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary project-card__live-link"
                    >
                      {work.liveLinkLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
