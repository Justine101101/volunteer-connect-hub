import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminAudit = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => setLogs(data ?? []));
  }, []);

  return (
    <DashboardLayout variant="admin" title="Audit Logs">
      <div className="space-y-2 max-w-3xl">
        {logs.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No activity logged yet.</CardContent></Card>
        ) : (
          logs.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <ScrollText className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{l.action}</p>
                  <p className="text-xs text-muted-foreground">{l.entity_type} {l.entity_id} · {new Date(l.created_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAudit;
