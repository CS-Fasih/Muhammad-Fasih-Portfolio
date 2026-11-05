import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' };

export default function Contact() {
  const sectionRef = useScrollReveal();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setStatusType('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          website: formData.website,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        setStatus("Thanks, your message is on its way. I'll reply by email.");
        setStatusType('success');
        setFormData(EMPTY_FORM);
      } else {
        setStatus(result.error || result.message || 'That did not go through. Please try again or email me directly.');
        setStatusType('error');
      }
    } catch {
      setStatus('The server is not responding. Please email me at muhammadfasihofficial@proton.me');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact" id="contact" ref={sectionRef}>
      <div className="container">
        <header className="section-head reveal">
          <h2>Contact</h2>
          <p className="section-head__note">Karachi time, UTC+5</p>
        </header>

        <div className="contact__lead reveal">
          <p className="contact__prompt">For research, XR or software work, email is best:</p>
          <a href="mailto:muhammadfasih146@gmail.com" className="contact__email">
            muhammadfasih146@gmail.com
          </a>
        </div>

        <div className="contact__grid">
          <dl className="contact__details reveal">
            <div>
              <dt>Phone</dt>
              <dd><a href="tel:+923710236798" className="text-link">+92 371 0236798</a></dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a href="https://linkedin.com/in/muhammad-fasih-19f" target="_blank" rel="noopener noreferrer" className="text-link">
                  muhammad-fasih-19f
                </a>
              </dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href="https://github.com/CS-Fasih" target="_blank" rel="noopener noreferrer" className="text-link">
                  CS-Fasih
                </a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Karachi, Pakistan</dd>
            </div>
          </dl>

          <form className="form reveal" onSubmit={handleSubmit}>
            <p className="form__title">Or leave a message here</p>
            <div className="contact__honeypot" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input
                id="contact-website"
                type="text"
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="form__row">
              <label className="form__field">
                <span>Name</span>
                <input type="text" name="name" value={formData.name} onChange={handleChange} autoComplete="name" required />
              </label>
              <label className="form__field">
                <span>Email</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
              </label>
            </div>
            <label className="form__field">
              <span>Subject</span>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
            </label>
            <label className="form__field">
              <span>Message</span>
              <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />
            </label>

            <div className="form__footer">
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Sending' : 'Send message'}
              </button>
              <p className={`form__status ${statusType ? `is-${statusType}` : ''}`} role="status" aria-live="polite">
                {status}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
