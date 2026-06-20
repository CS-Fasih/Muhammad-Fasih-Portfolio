import useScrollReveal from '../hooks/useScrollReveal';
import services from '../data/services';

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
      {/* Heading */}
      <div className="about__heading reveal">
        <h2>About Me</h2>
      </div>

      {/* Services Grid */}
      <div className="container">
        <div className="services-grid reveal">
          {services.map((service) => (
            <div className="service-item" key={service.id}>
              <div
                className="service-item__icon"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
              <span className="service-item__label">{service.title}</span>
            </div>
          ))}
        </div>

        {/* About Intro (3-column) */}
        <div className="about__intro reveal">
          <div className="about__intro-left">
            <h3>
              Welcome — I'm<br />
              Muhammad Fasih,<br />
              Software Engineer
            </h3>
            <p>
              A fresh CS graduate from Dawood University of Engineering & Technology, Karachi.
              I specialize in building production-ready, full-stack web applications and
              intelligent AI systems. My work spans MERN stack development, microservices
              architecture, computer vision, and endpoint security tools.
            </p>
          </div>

          <div className="about__intro-center">
            <img
              src="/images/about-photo.png"
              alt="Developer workspace"
            />
          </div>

          <div className="about__intro-right">
            <p>
              With 22+ public repositories and 428+ GitHub contributions, I've built
              everything from multi-model AI assistants analyzing satellite imagery to
              real-time endpoint security daemons in C/POSIX. I believe in shipping
              deployable, well-documented software — not just demos.
            </p>
            <p>
              My toolkit includes React, Node.js, Python, C, Docker, PyTorch,
              and PostgreSQL. I'm passionate about compilers, distributed systems,
              and solving complex problems with clean architecture.
            </p>
            <a href="#work" className="btn-primary" onClick={handleViewProjects}>
              View All Projects
            </a>
          </div>
        </div>

        {/* Numbered List */}
        <div className="numbered-list reveal">
          <div className="numbered-item">
            <div className="numbered-item__number">01</div>
            <div className="numbered-item__title">
              Full-Stack<br />Development
            </div>
            <div className="numbered-item__divider"></div>
            <div className="numbered-item__desc">
              MERN stack, .NET, REST APIs, microservices, Docker, real-time WebSocket systems, and cloud deployment on Heroku & Vercel.
            </div>
          </div>

          <div className="numbered-item">
            <div className="numbered-item__number">02</div>
            <div className="numbered-item__title">
              AI & Machine<br />Learning
            </div>
            <div className="numbered-item__divider"></div>
            <div className="numbered-item__desc">
              Computer vision with YOLO & EfficientNet, LLM integration via OpenAI & NVIDIA NIM, evolutionary algorithms, and knowledge graphs.
            </div>
          </div>

          <div className="numbered-item">
            <div className="numbered-item__number">03</div>
            <div className="numbered-item__title">
              Security &<br />Systems
            </div>
            <div className="numbered-item__divider"></div>
            <div className="numbered-item__desc">
              Endpoint security daemons, log analysis, credential redaction, C/POSIX programming, compiler design, and multi-threaded networking.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
