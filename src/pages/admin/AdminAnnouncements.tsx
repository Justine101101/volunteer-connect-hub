import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    const { data: ann, error } = await supabase.from("announcements").insert({ title, body, created_by: user.id }).select().single();
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    // Notify every volunteer
    const { data: vols } = await supabase.from("user_roles").select("user_id").eq("role", "volunteer");
    if (vols && vols.length > 0) {
      const notifs = vols.map((v) => ({ user_id: v.user_id, title, body, link: "/dashboard" }));
      await supabase.from("notifications").insert(notifs);
    }
    setTitle(""); setBody("");
    toast({ title: "Announcement sent!", description: `${vols?.length ?? 0} volunteers notified.` });
    load();
  };

  return (
    <DashboardLayout variant="admin" title="Announcements">
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>New Announcement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={send} className="space-y-3">
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <Textarea placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
              <Button type="submit" className="gap-2"><Megaphone className="h-4 w-4" /> Send to all volunteers</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {items.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{a.title}</p>
                {a.body && <p className="text-sm text-muted-foreground mt-1">{a.body}</p>}
                <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnnouncements;
