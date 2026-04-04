window.alert = function () {};
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ChatPage from "./pages/ChatPage";
import StressCheck from "./pages/StressCheck";
import Exercises from "./pages/Exercises";
import RelaxMusic from "./pages/RelaxMusic";
import AdminSettings from './pages/AdminSettings';
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Relaxation from "./pages/Relaxation";
import Games from "./pages/Games";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import Appearance from "./pages/Appearance";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import TermsPolicy from "./pages/TermsPolicy";
import HelpSupport from "./pages/HelpSupport";
import PsychiatristDashboard from "./pages/PsychiatristDashboard";
import PsychiatristSettings from "./pages/PsychiatristSettings";
import ScheduleManager from "./pages/ScheduleManager";
import MessagesCenter from "./pages/MessagesCentre";
import AddPatient from './pages/AddPatient';
import PatientManagement from "./pages/PatientManagement";
import PatientDetails from "./pages/PatientDetails";
import NotificationsCenter from "./pages/NotificationsCenter";
import ClinicalReports from "./pages/ClinicalReports";
import SessionInterface from "./pages/SessionInterface";
import EmergencyAlertDetails from "./pages/EmergencyAlertDetails";
import ClinicalNotes from "./pages/ClinicalNotes";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={['user']}><ChatPage /></ProtectedRoute>} />
          <Route path="/stress" element={<ProtectedRoute allowedRoles={['user']}><StressCheck /></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute allowedRoles={['user']}><Exercises /></ProtectedRoute>} />
          <Route path="/music" element={<ProtectedRoute allowedRoles={['user']}><RelaxMusic /></ProtectedRoute>} />
          <Route path="/relaxation" element={<ProtectedRoute allowedRoles={['user']}><Relaxation /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute allowedRoles={['user']}><Games /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['user']}><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />
          <Route path="/appearance" element={<ProtectedRoute allowedRoles={['user']}><Appearance /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['user']}><Notifications /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute allowedRoles={['user']}><Privacy /></ProtectedRoute>} />
          <Route path="/terms-policy" element={<ProtectedRoute allowedRoles={['user']}><TermsPolicy /></ProtectedRoute>} />
          <Route path="/help-support" element={<ProtectedRoute allowedRoles={['user']}><HelpSupport /></ProtectedRoute>} />

          {/* Psychiatrist Routes */}
          <Route path="/psychiatrist" element={<ProtectedRoute allowedRoles={['psychiatrist']}><PsychiatristDashboard /></ProtectedRoute>} />
          <Route path="/psychiatrist/settings" element={<ProtectedRoute allowedRoles={['psychiatrist']}><PsychiatristSettings /></ProtectedRoute>} />
          <Route path="/psychiatrist/schedule" element={<ProtectedRoute allowedRoles={['psychiatrist']}><ScheduleManager /></ProtectedRoute>} />
          <Route path="/psychiatrist/messages" element={<ProtectedRoute allowedRoles={['psychiatrist']}><MessagesCenter /></ProtectedRoute>} />
          <Route path="/psychiatrist/patients" element={<ProtectedRoute allowedRoles={['psychiatrist']}><PatientManagement /></ProtectedRoute>} />
          <Route path="/psychiatrist/add-patient" element={<ProtectedRoute allowedRoles={['psychiatrist']}><AddPatient /></ProtectedRoute>} />
          <Route path="/psychiatrist/patient/:id" element={<ProtectedRoute allowedRoles={['psychiatrist']}><PatientDetails /></ProtectedRoute>} />
          <Route path="/psychiatrist/notifications" element={<ProtectedRoute allowedRoles={['psychiatrist']}><NotificationsCenter /></ProtectedRoute>} />
          <Route path="/psychiatrist/reports" element={<ProtectedRoute allowedRoles={['psychiatrist']}><ClinicalReports /></ProtectedRoute>} />
          <Route path="/psychiatrist/session/:id" element={<ProtectedRoute allowedRoles={['psychiatrist']}><SessionInterface /></ProtectedRoute>} />
          <Route path="/psychiatrist/alert/:id" element={<ProtectedRoute allowedRoles={['psychiatrist']}><EmergencyAlertDetails /></ProtectedRoute>} />
          <Route path="/psychiatrist/notes/:patientId" element={<ProtectedRoute allowedRoles={['psychiatrist']}><ClinicalNotes /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
