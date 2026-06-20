import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Contact() {
  const sectionRef = useScrollReveal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('Something went wrong. Please try again or email me directly.');
      }
    } catch {
      setStatus('Server unavailable. Please email me at muhammadfasih146@gmail.com');
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
            Have a project in mind or want to collaborate? Send me a message and I'll
            get back to you as soon as possible.
          </p>
        </div>

        <form className="contact__form reveal" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="contact__input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="contact__input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="contact__input full-width"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
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
          {status && <div className="contact__success full-width">{status}</div>}
        </form>
      </div>
    </section>
  );
}
