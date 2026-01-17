window.alert = function () {};
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ChatPage from "./pages/ChatPage";
import StressCheck from "./pages/StressCheck";
import Exercises from "./pages/Exercises";
import RelaxMusic from "./pages/RelaxMusic";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// User Pages
import Relaxation from "./pages/Relaxation";
import Games from "./pages/Games";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";

// User Settings Sub-Pages
import Appearance from "./pages/Appearance";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import TermsPolicy from "./pages/TermsPolicy";
import HelpSupport from "./pages/HelpSupport";

// Psychiatrist Pages
import PsychiatristDashboard from "./pages/PsychiatristDashboard";
import PsychiatristSettings from "./pages/PsychiatristSettings";
import ScheduleManager from "./pages/ScheduleManager";
import MessagesCenter from "./pages/MessagesCentre";
import PatientManagement from "./pages/PatientManagement";
import PatientDetails from "./pages/PatientDetails";
import NotificationsCenter from "./pages/NotificationsCenter";
import ClinicalReports from "./pages/ClinicalReports";
import SessionInterface from "./pages/SessionInterface";
import EmergencyAlertDetails from "./pages/EmergencyAlertDetails";
import ClinicalNotes from "./pages/ClinicalNotes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/stress" element={<StressCheck />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/music" element={<RelaxMusic />} />
          
          {/* User Feature Pages */}
          <Route path="/relaxation" element={<Relaxation />} />
          <Route path="/games" element={<Games />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* User Settings Sub-Pages */}
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms-policy" element={<TermsPolicy />} />
          <Route path="/help-support" element={<HelpSupport />} />
          
          {/* Psychiatrist Routes */}
          <Route path="/psychiatrist" element={<PsychiatristDashboard />} />
          <Route path="/psychiatrist/settings" element={<PsychiatristSettings />} />
          <Route path="/psychiatrist/schedule" element={<ScheduleManager />} />
          <Route path="/psychiatrist/messages" element={<MessagesCenter />} />
          <Route path="/psychiatrist/patients" element={<PatientManagement />} />
          <Route path="/psychiatrist/patient/:id" element={<PatientDetails />} />
          <Route path="/psychiatrist/notifications" element={<NotificationsCenter />} />
          <Route path="/psychiatrist/reports" element={<ClinicalReports />} />
          <Route path="/psychiatrist/session/:id" element={<SessionInterface />} />
          <Route path="/psychiatrist/alert/:id" element={<EmergencyAlertDetails />} />
          <Route path="/psychiatrist/notes/:patientId" element={<ClinicalNotes />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;