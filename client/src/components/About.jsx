import useScrollReveal from '../hooks/useScrollReveal';
import services from '../data/services';

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
      {/* Heading */}
      <div className="about__heading reveal">
        <h2>About Me</h2>
      </div>

      {/* Services Grid */}
      <div className="container">
        <div className="services-grid reveal">
          {services.map((service) => (
            <div className="service-item" key={service.id}>
              <div className="service-item__icon"><ServiceIcon id={service.id} /></div>
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
