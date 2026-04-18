import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, ListChecks, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, regs: 0, completed: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ count: users }, { count: events }, { count: regs }, { count: completed }, { data: evs }] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("events").select("title, id, event_registrations(count)").limit(5),
      ]);
      setStats({ users: users ?? 0, events: events ?? 0, regs: regs ?? 0, completed: completed ?? 0 });
      setChartData((evs ?? []).map((e: any) => ({ name: e.title?.slice(0, 14) ?? "Event", participants: e.event_registrations?.[0]?.count ?? 0 })));
    };
    load();
  }, []);

  const cards = [
    { label: "Total Volunteers", value: stats.users, icon: Users, color: "from-primary/20 to-primary/5" },
    { label: "Events", value: stats.events, icon: CalendarDays, color: "from-accent/20 to-accent/5" },
    { label: "Registrations", value: stats.regs, icon: ListChecks, color: "from-secondary/30 to-secondary/5" },
    { label: "Completed", value: stats.completed, icon: TrendingUp, color: "from-primary/20 to-accent/10" },
  ];

  return (
    <DashboardLayout variant="admin" title="Admin Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-gradient-to-br ${c.color} border-0`}>
                <CardContent className="p-5 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p className="text-3xl font-extrabold mt-1">{c.value}</p>
                  </div>
                  <c.icon className="h-6 w-6 text-primary" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Event Participation</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="participants" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
