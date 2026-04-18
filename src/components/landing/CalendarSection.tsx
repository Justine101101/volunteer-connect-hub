import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CalendarSection = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, title, starts_at")
      .eq("status", "published")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(8)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  const highlightDates = events.map((e) => new Date(e.starts_at));

  return (
    <section id="calendar" className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Event <span className="gradient-text">Calendar</span>
          </h2>
          <p className="text-muted-foreground">Plan ahead and never miss an opportunity to help.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ event: highlightDates }}
              modifiersClassNames={{ event: "bg-primary/20 text-primary font-bold rounded-md" }}
              className="rounded-lg"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-3">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Upcoming Events
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events.</p>
            ) : (
              events.map((e) => {
                const d = new Date(e.starts_at);
                return (
                  <div key={e.id} className="glass-card p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs text-primary font-semibold">{d.toLocaleString("default", { month: "short" })}</span>
                      <span className="text-lg font-bold text-primary leading-none">{d.getDate()}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{e.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
