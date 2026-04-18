import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: ReactNode;
  variant?: "volunteer" | "admin";
  title?: string;
}

const DashboardLayout = ({ children, variant = "volunteer", title }: Props) => {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        {variant === "admin" ? <AdminSidebar /> : <DashboardSidebar />}
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-background px-4 sticky top-0 z-30">
            <SidebarTrigger />
            {title && <h1 className="font-semibold">{title}</h1>}
            <div className="ml-auto text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
