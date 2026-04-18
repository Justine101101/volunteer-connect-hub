import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminReports = () => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      const [{ count: total }, { count: completed }, { count: pending }, { count: events }] = await Promise.all([
        supabase.from("event_registrations").select("id", { count: "exact", head: true }),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);
      setStats({ total, completed, pending, events });
    };
    load();
  }, []);

  const exportCSV = async () => {
    const { data } = await supabase
      .from("event_registrations")
      .select("*, events(title, starts_at, location), profiles!event_registrations_user_id_fkey(first_name, last_name, email)");
    const rows = [["Volunteer", "Email", "Event", "Date", "Location", "Status"]];
    (data ?? []).forEach((r: any) => {
      rows.push([
        `${r.profiles?.first_name ?? ""} ${r.profiles?.last_name ?? ""}`.trim(),
        r.profiles?.email ?? "",
        r.events?.title ?? "",
        r.events?.starts_at ?? "",
        r.events?.location ?? "",
        r.status,
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vms-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout variant="admin" title="Reports">
      <div className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Registrations", value: stats.total ?? 0 },
            { label: "Completed", value: stats.completed ?? 0 },
            { label: "Pending", value: stats.pending ?? 0 },
            { label: "Events", value: stats.events ?? 0 },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-extrabold mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Export Data</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Download a CSV of all event registrations and participation data.</p>
            <Button onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Download CSV</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
