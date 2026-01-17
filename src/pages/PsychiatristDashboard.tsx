import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import EmergencyAlerts from '@/components/dashboard/EmergencyAlerts';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import PatientList from '@/components/dashboard/PatientList';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentMessages from '@/components/dashboard/RecentMessages';
import {
  Calendar,
  MessageCircle,
  Bell,
  Settings,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { 
  Patient, 
  EmergencyAlert, 
  Appointment, 
  Message, 
  DashboardStats,
  QuickActionType 
} from '@/types';

// ============ MOCK DATA ============

const initialEmergencyAlerts: EmergencyAlert[] = [
  {
    id: 'alert-1',
    patientId: 'p-3',
    patientName: 'Emily Davis',
    avatar: '👩‍🦰',
    phone: '+1 (555) 123-4567',
    alertType: 'crisis',
    severity: 'critical',
    message: 'Patient reported severe anxiety attack. Immediate attention required.',
    timestamp: '10 minutes ago',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    patientId: 'p-7',
    patientName: 'Marcus Thompson',
    avatar: '👨‍🦲',
    phone: '+1 (555) 234-5678',
    alertType: 'self-harm-risk',
    severity: 'critical',
    message: 'Self-harm indicators detected in recent chat messages.',
    timestamp: '25 minutes ago',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    patientId: 'p-12',
    patientName: 'Jessica Miller',
    avatar: '👩',
    phone: '+1 (555) 345-6789',
    alertType: 'missed-session',
    severity: 'high',
    message: 'Missed 3 consecutive therapy sessions without notice.',
    timestamp: '1 hour ago',
    acknowledged: false,
  },
];

const initialAppointments: Appointment[] = [
  { id: 'apt-1', patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', type: 'video', time: '09:00 AM', duration: 60, status: 'scheduled' },
  { id: 'apt-2', patientId: 'p-2', patientName: 'Mike Chen', avatar: '👨', type: 'in-person', time: '10:30 AM', duration: 45, status: 'scheduled' },
  { id: 'apt-3', patientId: 'p-4', patientName: 'James Wilson', avatar: '👴', type: 'video', time: '11:30 AM', duration: 60, status: 'scheduled' },
  { id: 'apt-4', patientId: 'p-5', patientName: 'Lisa Anderson', avatar: '👱‍♀️', type: 'phone', time: '01:00 PM', duration: 30, status: 'scheduled' },
];

const initialPatients: Patient[] = [
  { id: 'p-1', name: 'Sarah Johnson', age: 28, phone: '+1 (555) 100-0001', email: 'sarah.j@email.com', stressLevel: 35, lastSession: '2 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩', notes: 'Making good progress with anxiety management', riskLevel: 'low', conditions: ['Anxiety', 'Insomnia'] },
  { id: 'p-2', name: 'Mike Chen', age: 34, phone: '+1 (555) 100-0002', email: 'mike.c@email.com', stressLevel: 72, lastSession: '1 day ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👨', notes: 'Work-related stress increasing', riskLevel: 'medium', conditions: ['Depression', 'Work Stress'] },
  { id: 'p-3', name: 'Emily Davis', age: 45, phone: '+1 (555) 123-4567', email: 'emily.d@email.com', stressLevel: 88, lastSession: '3 hours ago', lastCheckIn: 'Today', status: 'critical', avatar: '👩‍🦰', notes: 'Requires immediate follow-up', riskLevel: 'high', conditions: ['Severe Anxiety', 'Panic Disorder'] },
  { id: 'p-4', name: 'James Wilson', age: 52, phone: '+1 (555) 100-0004', email: 'james.w@email.com', stressLevel: 45, lastSession: '5 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👴', notes: 'Stable, maintaining therapy schedule', riskLevel: 'low', conditions: ['Mild Depression'] },
  { id: 'p-5', name: 'Lisa Anderson', age: 31, phone: '+1 (555) 100-0005', email: 'lisa.a@email.com', stressLevel: 65, lastSession: '1 day ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👱‍♀️', notes: 'Relationship issues ongoing', riskLevel: 'medium', conditions: ['Anxiety', 'Relationship Issues'] },
];

const initialMessages: Message[] = [
  { id: 'msg-1', patientId: 'p-3', patientName: 'Emily Davis', avatar: '👩‍🦰', content: 'I\'m having a really difficult day. Can we talk soon?', timestamp: '5 minutes ago', read: false, priority: 'urgent' },
  { id: 'msg-2', patientId: 'p-7', patientName: 'Marcus Thompson', avatar: '👨‍🦲', content: 'Thank you for checking in. I\'m feeling a bit better today.', timestamp: '15 minutes ago', read: false, priority: 'normal' },
  { id: 'msg-3', patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', content: 'Just completed my breathing exercises. Feeling calmer now.', timestamp: '30 minutes ago', read: false, priority: 'low' },
];

// ============ COMPONENT ============

const PsychiatristDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(initialEmergencyAlerts);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Calculate stats
  const stats: DashboardStats = {
    activePatients: patients.length,
    todayAppointments: appointments.filter(a => a.status === 'scheduled').length,
    pendingMessages: messages.filter(m => !m.read).length,
    criticalAlerts: emergencyAlerts.length,
    completedSessions: 12,
    averageStress: Math.round(patients.reduce((sum, p) => sum + p.stressLevel, 0) / patients.length),
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // ========== UPDATED NAVIGATION HANDLERS ==========

  const handleStatClick = (statType: string) => {
    switch(statType) {
      case 'patients':
        navigate('/psychiatrist/patients');
        break;
      case 'appointments':
        navigate('/psychiatrist/schedule');
        break;
      case 'messages':
        navigate('/psychiatrist/messages');
        break;
      case 'alerts':
        navigate('/psychiatrist/notifications');
        break;
    }
  };

  const handleScheduleClick = () => {
    navigate('/psychiatrist/schedule');
  };

  const handleMessagesClick = () => {
    navigate('/psychiatrist/messages');
  };

  const handleNotificationsClick = () => {
    navigate('/psychiatrist/notifications');
  };

  const handleSettingsClick = () => {
    navigate('/psychiatrist/settings');
  };

  // Emergency Alert handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    setEmergencyAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleCallPatient = (alert: EmergencyAlert) => {
    window.location.href = `tel:${alert.phone}`;
  };

  const handleViewAlertDetails = (alert: EmergencyAlert) => {
    navigate(`/psychiatrist/alert/${alert.id}`);
  };

  // Appointment handlers
  const handleJoinCall = (appointment: Appointment) => {
    setAppointments(prev => 
      prev.map(a => a.id === appointment.id ? { ...a, status: 'in-progress' as const } : a)
    );
    navigate(`/psychiatrist/session/${appointment.id}`);
  };

  const handleStartSession = (appointment: Appointment) => {
    setAppointments(prev => 
      prev.map(a => a.id === appointment.id ? { ...a, status: 'in-progress' as const } : a)
    );
    navigate(`/psychiatrist/session/${appointment.id}`);
  };

  const handleViewAllAppointments = () => {
    navigate('/psychiatrist/schedule');
  };

  // Patient handlers
  const handleViewPatientDetails = (patient: Patient) => {
    navigate(`/psychiatrist/patient/${patient.id}`);
  };

  const handleSendMessage = (patient: Patient) => {
    navigate(`/psychiatrist/messages?patient=${patient.id}`);
  };

  const handleAddNote = (patient: Patient) => {
    navigate(`/psychiatrist/notes/${patient.id}`);
  };

  const handleUpdatePatientStatus = (patient: Patient, newStatus: Patient['status']) => {
    setPatients(prev =>
      prev.map(p => p.id === patient.id ? { ...p, status: newStatus } : p)
    );
  };

  // Message handlers
  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const handleReplyMessage = (message: Message) => {
    navigate(`/psychiatrist/messages?conversation=${message.patientId}`);
  };

  const handleViewAllMessages = () => {
    navigate('/psychiatrist/messages');
  };

  // Quick Action handlers
  const handleQuickAction = (action: QuickActionType) => {
    switch(action) {
      case 'appointments':
        navigate('/psychiatrist/schedule?new=true');
        break;
      case 'messages':
        navigate('/psychiatrist/messages');
        break;
      case 'patients':
        navigate('/psychiatrist/patients');
        break;
      case 'reports':
        navigate('/psychiatrist/reports');
        break;
        case 'settings':
          navigate('/psychiatrist/settings');
          break;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 fade-in-up">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Welcome back, Dr. Jaya
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your patients today
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNotificationsClick}>
              <Bell className="w-4 h-4" />
              {stats.criticalAlerts > 0 && (
                <span className="ml-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {stats.criticalAlerts}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleScheduleClick}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button variant="default" onClick={handleMessagesClick}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
              {stats.pendingMessages > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary-foreground/20 text-primary-foreground text-xs rounded-full">
                  {stats.pendingMessages}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions 
            onAction={handleQuickAction}
            unreadMessages={stats.pendingMessages}
            pendingAppointments={stats.todayAppointments}
          />
        </div>

        {/* Emergency Alerts */}
        <div className="mb-6">
          <EmergencyAlerts
            alerts={emergencyAlerts}
            onAcknowledge={handleAcknowledgeAlert}
            onCallPatient={handleCallPatient}
            onViewDetails={handleViewAlertDetails}
          />
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards 
            stats={stats} 
            onStatClick={handleStatClick} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Appointments */}
          <UpcomingAppointments
            appointments={appointments}
            onJoinCall={handleJoinCall}
            onStartSession={handleStartSession}
            onViewAll={handleViewAllAppointments}
          />

          {/* Messages */}
          <RecentMessages
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
            onReply={handleReplyMessage}
            onViewAll={handleViewAllMessages}
          />
        </div>

        {/* Patient List */}
        <PatientList
          patients={patients}
          onViewDetails={handleViewPatientDetails}
          onSendMessage={handleSendMessage}
          onAddNote={handleAddNote}
          onUpdateStatus={handleUpdatePatientStatus}
        />
      </main>
    </div>
  );
};

export default PsychiatristDashboard;