import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Experience from '../components/Experience';
import Works from '../components/Works';
import OtherProjects from '../components/OtherProjects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import CursorGlow from '../components/CursorGlow';

export default function HomePage() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
    return () => document.body.classList.remove('theme-dark');
  }, []);

  return (
    <div className="site">
      <CursorGlow />
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Works />
        <OtherProjects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
