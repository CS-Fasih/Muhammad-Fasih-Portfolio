import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import usePointerEffects from '../hooks/usePointerEffects';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' };

export default function Contact() {
  const sectionRef = useScrollReveal();
  const pointerRef = usePointerEffects();
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
        setStatus("Message sent successfully! I'll get back to you soon.");
        setStatusType('success');
        setFormData(EMPTY_FORM);
      } else {
        setStatus(result.error || result.message || 'Something went wrong. Please try again or email me directly.');
        setStatusType('error');
      }
    } catch {
      setStatus('Server unavailable. Please email me at muhammadfasihofficial@proton.me');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact" id="contact" ref={sectionRef}>
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact__layout" ref={pointerRef}>
        <div className="contact__intro reveal">
          <span className="eyebrow">05 · Contact</span>
          <h2>
            Let&apos;s build something people can <em>step into</em>.
          </h2>
          <p>
            Research collaboration, an XR or AI project, or a full-stack build: send a message and
            I&apos;ll get back to you as soon as I can.
          </p>

          <ul className="contact__channels">
            <li>
              <a href="mailto:muhammadfasih146@gmail.com" className="channel spot">
                <span className="channel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <span className="channel__text">
                  <span className="channel__label">Email</span>
                  muhammadfasih146@gmail.com
                </span>
              </a>
            </li>
            <li>
              <a href="tel:+923710236798" className="channel spot">
                <span className="channel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="channel__text">
                  <span className="channel__label">Phone</span>
                  +92 371 0236798
                </span>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/muhammad-fasih-19f" target="_blank" rel="noopener noreferrer" className="channel spot">
                <span className="channel__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
                  </svg>
                </span>
                <span className="channel__text">
                  <span className="channel__label">LinkedIn</span>
                  in/muhammad-fasih-19f
                </span>
              </a>
            </li>
          </ul>
        </div>

        <form className="contact-form spot reveal" style={{ '--d': '120ms' }} onSubmit={handleSubmit}>
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

          <div className="field">
            <input id="contact-name" type="text" name="name" placeholder=" " className="field__input" value={formData.name} onChange={handleChange} autoComplete="name" required />
            <label htmlFor="contact-name" className="field__label">Your name</label>
          </div>
          <div className="field">
            <input id="contact-email" type="email" name="email" placeholder=" " className="field__input" value={formData.email} onChange={handleChange} autoComplete="email" required />
            <label htmlFor="contact-email" className="field__label">Your email</label>
          </div>
          <div className="field field--full">
            <input id="contact-subject" type="text" name="subject" placeholder=" " className="field__input" value={formData.subject} onChange={handleChange} required />
            <label htmlFor="contact-subject" className="field__label">Subject</label>
          </div>
          <div className="field field--full">
            <textarea id="contact-message" name="message" placeholder=" " className="field__input field__input--area" value={formData.message} onChange={handleChange} required />
            <label htmlFor="contact-message" className="field__label">Your message</label>
          </div>

          <div className="contact-form__footer">
            <button type="submit" className="x-btn x-btn--primary" disabled={loading}>
              {loading ? 'Sending…' : 'Send message'}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
              </svg>
            </button>
          </div>
          <div className={`contact-form__status ${statusType ? `is-${statusType}` : ''}`} role="status" aria-live="polite">
            {status}
          </div>
        </form>
      </div>
    </section>
  );
}
