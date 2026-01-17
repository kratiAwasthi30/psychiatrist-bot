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
import PsychiatristDashboard from "./pages/PsychiatristDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Main Feature Pages
import Relaxation from "./pages/Relaxation";
import Games from "./pages/Games";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";

// Settings Sub-Pages
import Appearance from "./pages/Appearance";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import TermsPolicy from "./pages/TermsPolicy";
import HelpSupport from "./pages/HelpSupport";

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
          
          {/* Main Feature Pages */}
          <Route path="/relaxation" element={<Relaxation />} />
          <Route path="/games" element={<Games />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Settings Sub-Pages */}
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms-policy" element={<TermsPolicy />} />
          <Route path="/help-support" element={<HelpSupport />} />
          
          {/* Psychiatrist Routes */}
          <Route path="/psychiatrist" element={<PsychiatristDashboard />} />
          <Route path="/psychiatrist/patients" element={<PsychiatristDashboard />} />
          
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