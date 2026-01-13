import HeroSection from './components/HeroSection';
import WelcomeModal from './components/WelcomeModal';
import FeaturedServicesBar from './components/FeaturedServicesBar';
import AboutUsSection from './components/AboutUsSection';
import ServicesSection from './components/ServicesSection';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import TestimonialsSection from './components/TestimonialsSection';
import LocationSection from './components/LocationSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <WelcomeModal />
      <HeroSection />
      <FeaturedServicesBar />
      <AboutUsSection />
      <ServicesSection />
      <BeforeAfterGallery />
      <TestimonialsSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}