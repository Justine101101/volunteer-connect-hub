import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    if (!user) return;
    const { data: adminRoles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    const adminIds = (adminRoles ?? []).map((r) => r.user_id);
    setAdmins(adminIds);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: true });
    setMessages(msgs ?? []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel("messages-" + user.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || admins.length === 0) return;
    await supabase.from("messages").insert({ sender_id: user.id, recipient_id: admins[0], body: text.trim() });
    setText("");
    load();
  };

  return (
    <DashboardLayout title="Messages">
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Chat with Admin</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto space-y-3 border rounded-lg p-4 bg-muted/30">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-12">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                    <p className="text-sm">{m.body}</p>
                    <p className={`text-xs mt-1 ${m.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 mt-3">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
            <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Messages;
