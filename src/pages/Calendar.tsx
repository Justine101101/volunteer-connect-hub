import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalendarSection from "@/components/landing/CalendarSection";

const CalendarPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-8">
      <CalendarSection />
    </main>
    <Footer />
  </div>
);

export default CalendarPage;
