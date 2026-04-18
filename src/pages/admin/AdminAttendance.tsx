import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ClipboardCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminAttendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [regs, setRegs] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("event_registrations")
      .select("*, events(title, starts_at), profiles!event_registrations_user_id_fkey(first_name, last_name, email)")
      .order("created_at", { ascending: false });
    // fallback if join fails
    if (!data) {
      const { data: alt } = await supabase.from("event_registrations").select("*, events(title, starts_at)").order("created_at", { ascending: false });
      setRegs(alt ?? []);
    } else {
      setRegs(data);
    }
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("event_registrations").update({ status }).eq("id", id);
    toast({ title: `Marked ${status}` });
    load();
  };

  const checkIn = async (r: any) => {
    await supabase.from("attendance").insert({ registration_id: r.id, event_id: r.event_id, user_id: r.user_id, marked_by: user?.id });
    await supabase.from("event_registrations").update({ status: "completed" }).eq("id", r.id);
    toast({ title: "Checked in" });
    load();
  };

  return (
    <DashboardLayout variant="admin" title="Attendance & Approvals">
      <div className="space-y-2">
        {regs.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold">{r.profiles?.first_name} {r.profiles?.last_name} <span className="text-muted-foreground font-normal text-xs">({r.profiles?.email})</span></p>
                <p className="text-xs text-muted-foreground">{r.events?.title} · {r.events?.starts_at && new Date(r.events.starts_at).toLocaleString()}</p>
              </div>
              <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : r.status === "completed" ? "secondary" : "outline"}>{r.status}</Badge>
              <div className="flex gap-1">
                {r.status === "pending" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "approved")}><Check className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}><X className="h-3.5 w-3.5" /></Button>
                  </>
                )}
                {r.status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => checkIn(r)}><ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Check In</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {regs.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No registrations yet.</CardContent></Card>}
      </div>
    </DashboardLayout>
  );
};

export default AdminAttendance;
