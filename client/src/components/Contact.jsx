import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

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
        setStatus('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      } else {
        setStatus(result.error || result.message || 'Something went wrong. Please try again or email me directly.');
      }
    } catch {
      setStatus('Server unavailable. Please email me at muhammadfasihofficial@proton.me');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="contact__heading reveal">
          <h2>Contact</h2>
          <p>
            Have a project in mind or want to collaborate? Send me a message or reach 
            out directly at <strong>+92 3710236798</strong>, and I'll get back to you 
            as soon as possible.
          </p>
        </div>

        <form className="contact__form reveal" onSubmit={handleSubmit}>
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
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            aria-label="Your Name"
            className="contact__input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            aria-label="Your Email"
            className="contact__input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            aria-label="Subject"
            className="contact__input full-width"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            aria-label="Your Message"
            className="contact__textarea full-width"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <div className="full-width contact__submit">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {status && <div className="contact__success full-width" role="status" aria-live="polite">{status}</div>}
        </form>
      </div>
    </section>
  );
}
