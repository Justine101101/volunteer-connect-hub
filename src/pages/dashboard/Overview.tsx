import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ListChecks, Bell, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ joined: 0, upcoming: 0, completed: 0, unread: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: regs }, { data: notifs }, { data: upcoming }] = await Promise.all([
        supabase.from("event_registrations").select("id, status, event_id, events(starts_at)").eq("user_id", user.id),
        supabase.from("notifications").select("id").eq("user_id", user.id).eq("read", false),
        supabase.from("events").select("id, title, starts_at, location, image_url").eq("status", "published").gte("starts_at", new Date().toISOString()).order("starts_at").limit(3),
      ]);
      const joined = regs?.length ?? 0;
      const completed = regs?.filter((r) => r.status === "completed").length ?? 0;
      const upcomingCount = regs?.filter((r: any) => r.events?.starts_at && new Date(r.events.starts_at) > new Date()).length ?? 0;
      setStats({ joined, upcoming: upcomingCount, completed, unread: notifs?.length ?? 0 });
      setRecentEvents(upcoming ?? []);
    };
    load();
  }, [user]);

  const cards = [
    { label: "Events Joined", value: stats.joined, icon: ListChecks, color: "from-primary/20 to-primary/5" },
    { label: "Upcoming", value: stats.upcoming, icon: CalendarDays, color: "from-accent/20 to-accent/5" },
    { label: "Completed", value: stats.completed, icon: Award, color: "from-secondary/30 to-secondary/5" },
    { label: "Notifications", value: stats.unread, icon: Bell, color: "from-primary/20 to-accent/10" },
  ];

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your volunteer activities.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-gradient-to-br ${c.color} border-0`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{c.label}</p>
                      <p className="text-3xl font-extrabold mt-1">{c.value}</p>
                    </div>
                    <c.icon className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Link to="/dashboard/events"><Button size="sm" variant="outline">Browse all</Button></Link>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No upcoming events. Check back soon!</p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((e) => (
                  <Link key={e.id} to="/dashboard/events" className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(e.starts_at).toLocaleString()} · {e.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
