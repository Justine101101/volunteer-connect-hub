import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const EventsSection = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(3)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  const fallbackImg = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop";

  return (
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

        {events.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            No events scheduled right now. Check back soon!
          </div>
        ) : (
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
                    src={event.image_url || fallbackImg}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3">{event.title}</h3>
                  <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{new Date(event.starts_at).toLocaleString()}</div>
                    {event.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{event.location}</div>}
                    {event.capacity && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Capacity: {event.capacity}</div>}
                  </div>
                  <Link to="/auth" state={{ mode: "signup" }}>
                    <Button size="sm" className="w-full">Join Event</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
