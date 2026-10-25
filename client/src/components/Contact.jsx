import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import portfolioContent from '../data/portfolio';

const { contact } = portfolioContent;

export default function Contact() {
  const sectionRef = useScrollReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
        setStatus(contact.sentMessage);
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setStatus(result.error || result.message || contact.errorFallback);
      }
    } catch {
      setStatus(`${contact.unavailablePrefix}${contact.email}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="contact__heading reveal">
          <h2>{contact.title}</h2>
          <p>{contact.description} <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </div>

        <form className="contact__form reveal" onSubmit={handleSubmit}>
          <div className="contact__honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{contact.fields.honeypot}</label>
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
          <input
            type="text"
            name="name"
            placeholder={contact.fields.name}
            aria-label={contact.fields.name}
            className="contact__input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={contact.fields.email}
            aria-label={contact.fields.email}
            className="contact__input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder={contact.fields.subject}
            aria-label={contact.fields.subject}
            className="contact__input full-width"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder={contact.fields.message}
            aria-label={contact.fields.message}
            className="contact__textarea full-width"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <div className="full-width contact__submit">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? contact.sendingLabel : contact.submitLabel}
            </button>
          </div>
          {status && <div className="contact__success full-width" role="status" aria-live="polite">{status}</div>}
        </form>
      </div>
    </section>
  );
}
