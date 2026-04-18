import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      setProfile(data ?? {});
      setLoading(false);
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      city: profile.city,
      bio: profile.bio,
      availability: profile.availability,
      skills: profile.skills,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    setProfile({ ...profile, avatar_url: url });
    toast({ title: "Avatar updated!" });
  };

  if (loading) return <DashboardLayout title="Profile"><p>Loading...</p></DashboardLayout>;

  const initials = `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}` || "U";

  return (
    <DashboardLayout title="Profile">
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-sm font-medium">
                  <Upload className="h-4 w-4" /> Upload photo
                </div>
                <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </Label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input value={profile.first_name ?? ""} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} /></div>
              <div><Label>Last Name</Label><Input value={profile.last_name ?? ""} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={profile.email ?? user?.email ?? ""} disabled /></div>
              <div><Label>Phone</Label><Input value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>City</Label><Input value={profile.city ?? ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Skills (comma separated)</Label><Input value={(profile.skills ?? []).join(", ")} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
              <div className="sm:col-span-2"><Label>Availability</Label><Input value={profile.availability ?? ""} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} placeholder="e.g. Weekends, Evenings" /></div>
              <div className="sm:col-span-2"><Label>Bio</Label><Textarea value={profile.bio ?? ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} /></div>
            </div>

            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;
