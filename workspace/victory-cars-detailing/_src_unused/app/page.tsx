import HeroSection from '@/app/components/HeroSection';
import FeaturedServicesBar from '@/app/components/FeaturedServicesBar';
import AboutUsSection from '@/app/components/AboutUsSection';
import ServicesSection from '@/app/components/ServicesSection';
import BeforeAfterGallery from '@/app/components/BeforeAfterGallery';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import LocationSection from '@/app/components/LocationSection';
import ContactSection from '@/app/components/ContactSection';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <main>
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
