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
