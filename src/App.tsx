import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import CalendarPage from "./pages/Calendar";
import Contact from "./pages/Contact";
import JoinUs from "./pages/JoinUs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import Overview from "./pages/dashboard/Overview";
import BrowseEvents from "./pages/dashboard/BrowseEvents";
import MyEvents from "./pages/dashboard/MyEvents";
import Profile from "./pages/dashboard/Profile";
import Notifications from "./pages/dashboard/Notifications";
import Messages from "./pages/dashboard/Messages";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminReports from "./pages/admin/AdminReports";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/dashboard/events" element={<ProtectedRoute><BrowseEvents /></ProtectedRoute>} />
          <Route path="/dashboard/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireRole="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute requireRole="admin"><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute requireRole="admin"><AdminAttendance /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requireRole="admin"><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute requireRole="admin"><AdminAudit /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute requireRole="admin"><AdminAnnouncements /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requireRole="admin"><AdminSettings /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
