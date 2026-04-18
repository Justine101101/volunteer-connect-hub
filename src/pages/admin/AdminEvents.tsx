import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const empty = { title: "", description: "", location: "", venue: "", starts_at: "", ends_at: "", capacity: "", requirements: "", image_url: "" };

const AdminEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("starts_at", { ascending: false });
    setEvents(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const startCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const startEdit = (e: any) => {
    setEditing(e);
    setForm({
      ...e,
      starts_at: e.starts_at?.slice(0, 16) ?? "",
      ends_at: e.ends_at?.slice(0, 16) ?? "",
      capacity: e.capacity?.toString() ?? "",
    });
    setOpen(true);
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload: any = {
      title: form.title,
      description: form.description,
      location: form.location,
      venue: form.venue,
      starts_at: form.starts_at,
      ends_at: form.ends_at || null,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      requirements: form.requirements,
      image_url: form.image_url || null,
      created_by: user?.id,
    };
    const { error } = editing
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert(payload);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Event updated" : "Event created" }); setOpen(false); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" });
    load();
  };

  return (
    <DashboardLayout variant="admin" title="Event Management">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={startCreate} className="gap-2"><Plus className="h-4 w-4" /> New Event</Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold">{e.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {new Date(e.starts_at).toLocaleString()}</div>
                  {e.location && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</div>}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(e)}><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => remove(e.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {events.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No events yet. Create your first one!</CardContent></Card>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div><Label>Title *</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Starts *</Label><Input required type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
              <div><Label>Ends</Label><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Venue</Label><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
              <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
            </div>
            <div><Label>Requirements</Label><Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={2} /></div>
            <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminEvents;
