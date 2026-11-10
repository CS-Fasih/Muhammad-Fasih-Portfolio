import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Works from '../components/Works';
import OtherProjects from '../components/OtherProjects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import Cursor from '../components/Cursor';

export default function HomePage() {
  return (
    <div className="site">
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Works />
        <OtherProjects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <Cursor />
    </div>
  );
}
