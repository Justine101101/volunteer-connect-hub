import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminSettings = () => {
  return (
    <DashboardLayout variant="admin" title="Settings">
      <div className="space-y-4 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>System Configuration</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Authentication and email are managed automatically by Lovable Cloud.</p>
            <p>To configure custom Google OAuth credentials, SMTP, or email templates, open the Cloud dashboard.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Terms & Privacy</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add your Terms of Service and Privacy Policy URLs to the footer in <code>src/components/Footer.tsx</code>.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
