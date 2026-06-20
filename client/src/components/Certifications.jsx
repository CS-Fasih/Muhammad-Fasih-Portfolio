import useScrollReveal from '../hooks/useScrollReveal';
import certifications from '../data/certifications';

const providerColors = {
  MasterDev: { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', text: '#e94560' },
  Educative: { bg: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)', text: '#ffffff' },
  LinkedIn: { bg: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)', text: '#ffffff' },
  Google: { bg: 'linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 100%)', text: '#ffffff' },
  Udemy: { bg: 'linear-gradient(135deg, #a435f0 0%, #7c1fa0 100%)', text: '#ffffff' },
  Meta: { bg: 'linear-gradient(135deg, #0668e1 0%, #1877f2 100%)', text: '#ffffff' },
};

export default function Certifications() {
  const sectionRef = useScrollReveal();

  return (
    <section className="certifications" id="certifications" ref={sectionRef}>
      <div className="container">
        <div className="certifications__heading reveal">
          <h2>Certifications</h2>
        </div>

        <div className="cert-grid reveal">
          {certifications.map((cert) => {
            const colors = providerColors[cert.provider] || {
              bg: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
              text: '#fff',
            };

            return (
              <div className="cert-card" key={cert.id}>
                <div className="cert-card__title">{cert.title}</div>
                <div
                  className="cert-card__image"
                  style={{ background: colors.bg }}
                >
                  <span
                    className="cert-card__provider-logo"
                    style={{ color: colors.text }}
                  >
                    {cert.provider}
                  </span>
                </div>
                <div className="cert-card__meta">
                  <span className="cert-card__date">{cert.date}</span>
                  <span className="cert-card__provider-name">{cert.provider}</span>
                  <span className="cert-card__skills">
                    {cert.skills.length} skill{cert.skills.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="cert-card__desc">{cert.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
