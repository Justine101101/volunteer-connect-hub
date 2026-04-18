import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BrowseEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: ev } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("starts_at", { ascending: true });
    setEvents(ev ?? []);

    if (user) {
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("user_id", user.id);
      setRegistrations(new Set((regs ?? []).map((r) => r.event_id)));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleJoin = async (eventId: string) => {
    if (!user) return;
    const { error } = await supabase.from("event_registrations").insert({ event_id: eventId, user_id: user.id });
    if (error) {
      toast({ title: "Failed to join", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!", description: "Awaiting admin approval." });
      setRegistrations(new Set([...registrations, eventId]));
    }
  };

  const filtered = events.filter((e) =>
    [e.title, e.location, e.description].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Browse Events">
      <div className="space-y-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading events...</p>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No events found.</CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                  {e.image_url && <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover" />}
                  <CardContent className="p-5 flex-1 flex flex-col gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{e.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{e.description}</p>
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><CalendarIcon className="h-3.5 w-3.5" /> {new Date(e.starts_at).toLocaleString()}</div>
                      {e.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>}
                      {e.capacity && <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Capacity: {e.capacity}</div>}
                    </div>
                    <div className="mt-auto pt-2">
                      {registrations.has(e.id) ? (
                        <Badge variant="secondary" className="w-full justify-center py-1.5">Already applied</Badge>
                      ) : (
                        <Button className="w-full" onClick={() => handleJoin(e.id)}>Join Event</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseEvents;
