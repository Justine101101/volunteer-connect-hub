import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Community Park Cleanup",
    date: "Apr 15, 2026",
    location: "Riverside Park",
    volunteers: 24,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop",
    category: "Environment",
  },
  {
    id: 2,
    title: "Youth Mentoring Workshop",
    date: "Apr 22, 2026",
    location: "Community Center",
    volunteers: 15,
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=250&fit=crop",
    category: "Education",
  },
  {
    id: 3,
    title: "Food Drive Campaign",
    date: "May 1, 2026",
    location: "Downtown Hall",
    volunteers: 40,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop",
    category: "Charity",
  },
];

const EventsSection = () => (
  <section id="events" className="section-padding">
    <div className="container-narrow">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Upcoming <span className="gradient-text">Events</span>
          </h2>
          <p className="text-muted-foreground">Find an event that resonates with you and make an impact.</p>
        </div>
        <Link to="/events">
          <Button variant="outline">View All Events</Button>
        </Link>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                {event.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-3">{event.title}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{event.date}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{event.location}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{event.volunteers} volunteers</div>
              </div>
              <Button size="sm" className="w-full">Join Event</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
