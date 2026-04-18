import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

const MyEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("event_registrations")
      .select("*, events(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRegs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cancel = async (id: string) => {
    const { error } = await supabase.from("event_registrations").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Registration cancelled" }); load(); }
  };

  return (
    <DashboardLayout title="My Events">
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : regs.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">You haven't joined any events yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {regs.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.events?.title}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span>{r.events?.starts_at && new Date(r.events.starts_at).toLocaleString()}</span>
                    {r.events?.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.events.location}</span>}
                  </div>
                </div>
                <Badge className={statusColor[r.status] ?? ""}>{r.status}</Badge>
                {r.status === "pending" && (
                  <Button size="icon" variant="ghost" onClick={() => cancel(r.id)}><X className="h-4 w-4" /></Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyEvents;
