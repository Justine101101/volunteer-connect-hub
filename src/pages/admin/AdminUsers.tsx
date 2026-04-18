import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, ShieldOff, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data: profs } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(profs ?? []);
    const { data: rls } = await supabase.from("user_roles").select("*");
    const m: Record<string, string[]> = {};
    (rls ?? []).forEach((r: any) => { (m[r.user_id] ||= []).push(r.role); });
    setRoles(m);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (userId: string, status: string) => {
    await supabase.from("profiles").update({ status }).eq("user_id", userId);
    toast({ title: `Volunteer ${status}` });
    load();
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast({ title: "Admin removed" });
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast({ title: "Admin granted" });
    }
    load();
  };

  const filtered = users.filter((u) =>
    [u.first_name, u.last_name, u.email, u.city].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout variant="admin" title="User Management">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="space-y-2">
          {filtered.map((u) => {
            const isAdmin = roles[u.user_id]?.includes("admin");
            return (
              <Card key={u.id}>
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-semibold">{u.first_name} {u.last_name}</p>
                    <p className="text-xs text-muted-foreground">{u.email} {u.city && `· ${u.city}`}</p>
                  </div>
                  <Badge variant={u.status === "approved" ? "default" : u.status === "rejected" ? "destructive" : "secondary"}>{u.status}</Badge>
                  {isAdmin && <Badge className="bg-accent text-accent-foreground">Admin</Badge>}
                  <div className="flex gap-1">
                    {u.status !== "approved" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(u.user_id, "approved")}><Check className="h-3.5 w-3.5" /></Button>
                    )}
                    {u.status !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(u.user_id, "rejected")}><X className="h-3.5 w-3.5" /></Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => toggleAdmin(u.user_id, isAdmin)}>
                      {isAdmin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No users found.</CardContent></Card>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
