import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsSection from "@/components/landing/EventsSection";

const Events = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-8">
      <EventsSection />
    </main>
    <Footer />
  </div>
);

export default Events;
