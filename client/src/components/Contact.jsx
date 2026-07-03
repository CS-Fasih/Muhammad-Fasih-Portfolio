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
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '58d59648-acea-47e1-ac3a-d1d20e31c419',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus(result.message || 'Something went wrong. Please try again or email me directly.');
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
