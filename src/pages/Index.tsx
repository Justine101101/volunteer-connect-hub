import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import EventsSection from "@/components/landing/EventsSection";
import CalendarSection from "@/components/landing/CalendarSection";
import ContactSection from "@/components/landing/ContactSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <CalendarSection />
      <CTASection />
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default Index;
