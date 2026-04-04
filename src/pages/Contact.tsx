import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/landing/ContactSection";

const Contact = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-8">
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default Contact;
