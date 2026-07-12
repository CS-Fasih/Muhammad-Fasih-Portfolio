import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import OtherProjects from '../components/OtherProjects';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Works />
      <OtherProjects />
      <Certifications />
      <Contact />
      <Footer />
      <Chatbot />
    </>
  );
}
