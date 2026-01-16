import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  {
    id: 'alert-4',
    patientId: 'p-15',
    patientName: 'David Chen',
    avatar: '👨',
    phone: '+1 (555) 456-7890',
    alertType: 'high-stress',
    severity: 'medium',
    message: 'Stress levels elevated to 92% during last session.',
    timestamp: '2 hours ago',
    acknowledged: false,
  },
  {
    id: 'alert-5',
    patientId: 'p-8',
    patientName: 'Amanda Wilson',
    avatar: '👱‍♀️',
    phone: '+1 (555) 567-8901',
    alertType: 'crisis',
    severity: 'high',
    message: 'Reported feelings of hopelessness in recent check-in.',
    timestamp: '3 hours ago',
    acknowledged: false,
  },
];

const initialAppointments: Appointment[] = [
  { id: 'apt-1', patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', type: 'video', time: '09:00 AM', duration: 60, status: 'scheduled' },
  { id: 'apt-2', patientId: 'p-2', patientName: 'Mike Chen', avatar: '👨', type: 'in-person', time: '10:30 AM', duration: 45, status: 'scheduled' },
  { id: 'apt-3', patientId: 'p-4', patientName: 'James Wilson', avatar: '👴', type: 'video', time: '11:30 AM', duration: 60, status: 'scheduled' },
  { id: 'apt-4', patientId: 'p-5', patientName: 'Lisa Anderson', avatar: '👱‍♀️', type: 'phone', time: '01:00 PM', duration: 30, status: 'scheduled' },
  { id: 'apt-5', patientId: 'p-6', patientName: 'Robert Brown', avatar: '👨‍🦱', type: 'video', time: '02:00 PM', duration: 60, status: 'scheduled' },
  { id: 'apt-6', patientId: 'p-9', patientName: 'Jennifer Lee', avatar: '👩‍🦳', type: 'in-person', time: '03:30 PM', duration: 45, status: 'scheduled' },
  { id: 'apt-7', patientId: 'p-10', patientName: 'Michael Scott', avatar: '👨‍💼', type: 'video', time: '04:30 PM', duration: 60, status: 'scheduled' },
  { id: 'apt-8', patientId: 'p-11', patientName: 'Rachel Green', avatar: '👩‍🦰', type: 'phone', time: '05:30 PM', duration: 30, status: 'scheduled' },
];

const initialPatients: Patient[] = [
  { id: 'p-1', name: 'Sarah Johnson', age: 28, phone: '+1 (555) 100-0001', email: 'sarah.j@email.com', stressLevel: 35, lastSession: '2 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩', notes: 'Making good progress with anxiety management', riskLevel: 'low', conditions: ['Anxiety', 'Insomnia'] },
  { id: 'p-2', name: 'Mike Chen', age: 34, phone: '+1 (555) 100-0002', email: 'mike.c@email.com', stressLevel: 72, lastSession: '1 day ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👨', notes: 'Work-related stress increasing', riskLevel: 'medium', conditions: ['Depression', 'Work Stress'] },
  { id: 'p-3', name: 'Emily Davis', age: 45, phone: '+1 (555) 123-4567', email: 'emily.d@email.com', stressLevel: 88, lastSession: '3 hours ago', lastCheckIn: 'Today', status: 'critical', avatar: '👩‍🦰', notes: 'Requires immediate follow-up', riskLevel: 'high', conditions: ['Severe Anxiety', 'Panic Disorder'] },
  { id: 'p-4', name: 'James Wilson', age: 52, phone: '+1 (555) 100-0004', email: 'james.w@email.com', stressLevel: 45, lastSession: '5 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👴', notes: 'Stable, maintaining therapy schedule', riskLevel: 'low', conditions: ['Mild Depression'] },
  { id: 'p-5', name: 'Lisa Anderson', age: 31, phone: '+1 (555) 100-0005', email: 'lisa.a@email.com', stressLevel: 65, lastSession: '1 day ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👱‍♀️', notes: 'Relationship issues ongoing', riskLevel: 'medium', conditions: ['Anxiety', 'Relationship Issues'] },
  { id: 'p-6', name: 'Robert Brown', age: 29, phone: '+1 (555) 100-0006', email: 'robert.b@email.com', stressLevel: 25, lastSession: 'Just now', lastCheckIn: 'Today', status: 'in-session', avatar: '👨‍🦱', notes: 'Excellent progress, near completion', riskLevel: 'low', conditions: ['Social Anxiety'] },
  { id: 'p-7', name: 'Marcus Thompson', age: 38, phone: '+1 (555) 234-5678', email: 'marcus.t@email.com', stressLevel: 95, lastSession: '4 hours ago', lastCheckIn: 'Today', status: 'critical', avatar: '👨‍🦲', notes: 'HIGH PRIORITY - Self-harm risk indicators', riskLevel: 'high', conditions: ['Severe Depression', 'Self-Harm Risk'] },
  { id: 'p-8', name: 'Amanda Wilson', age: 26, phone: '+1 (555) 567-8901', email: 'amanda.w@email.com', stressLevel: 82, lastSession: '6 hours ago', lastCheckIn: 'Today', status: 'critical', avatar: '👱‍♀️', notes: 'Hopelessness reported, needs follow-up', riskLevel: 'high', conditions: ['Depression', 'Anxiety'] },
  { id: 'p-9', name: 'Jennifer Lee', age: 42, phone: '+1 (555) 100-0009', email: 'jennifer.l@email.com', stressLevel: 40, lastSession: '1 day ago', lastCheckIn: 'Yesterday', status: 'stable', avatar: '👩‍🦳', notes: 'Good progress with CBT techniques', riskLevel: 'low', conditions: ['OCD', 'Anxiety'] },
  { id: 'p-10', name: 'Michael Scott', age: 48, phone: '+1 (555) 100-0010', email: 'michael.s@email.com', stressLevel: 55, lastSession: '2 days ago', lastCheckIn: '2 days ago', status: 'monitoring', avatar: '👨‍💼', notes: 'Work-life balance issues', riskLevel: 'medium', conditions: ['Burnout', 'Anxiety'] },
  { id: 'p-11', name: 'Rachel Green', age: 33, phone: '+1 (555) 100-0011', email: 'rachel.g@email.com', stressLevel: 30, lastSession: '3 days ago', lastCheckIn: '1 day ago', status: 'stable', avatar: '👩‍🦰', notes: 'Maintenance phase', riskLevel: 'low', conditions: ['Mild Anxiety'] },
  { id: 'p-12', name: 'Jessica Miller', age: 27, phone: '+1 (555) 345-6789', email: 'jessica.m@email.com', stressLevel: 78, lastSession: '1 week ago', lastCheckIn: '3 days ago', status: 'monitoring', avatar: '👩', notes: 'Missed 3 sessions - needs outreach', riskLevel: 'medium', conditions: ['Depression', 'Avoidance'] },
  { id: 'p-13', name: 'Christopher Hall', age: 55, phone: '+1 (555) 100-0013', email: 'chris.h@email.com', stressLevel: 38, lastSession: '1 day ago', lastCheckIn: 'Today', status: 'stable', avatar: '👴', notes: 'Coping well with retirement transition', riskLevel: 'low', conditions: ['Adjustment Disorder'] },
  { id: 'p-14', name: 'Nicole Martinez', age: 24, phone: '+1 (555) 100-0014', email: 'nicole.m@email.com', stressLevel: 60, lastSession: '2 days ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👩‍🎓', notes: 'Academic stress and perfectionism', riskLevel: 'medium', conditions: ['Anxiety', 'Perfectionism'] },
  { id: 'p-15', name: 'David Chen', age: 41, phone: '+1 (555) 456-7890', email: 'david.c@email.com', stressLevel: 92, lastSession: '5 hours ago', lastCheckIn: 'Today', status: 'critical', avatar: '👨', notes: 'Elevated stress from family issues', riskLevel: 'high', conditions: ['Severe Stress', 'Family Conflict'] },
  { id: 'p-16', name: 'Stephanie Brown', age: 36, phone: '+1 (555) 100-0016', email: 'steph.b@email.com', stressLevel: 42, lastSession: '1 day ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩‍💼', notes: 'Good progress with mindfulness', riskLevel: 'low', conditions: ['Work Stress'] },
  { id: 'p-17', name: 'Kevin Park', age: 29, phone: '+1 (555) 100-0017', email: 'kevin.p@email.com', stressLevel: 50, lastSession: '3 days ago', lastCheckIn: '2 days ago', status: 'monitoring', avatar: '👨', notes: 'Social anxiety improving', riskLevel: 'medium', conditions: ['Social Anxiety', 'Depression'] },
  { id: 'p-18', name: 'Laura White', age: 44, phone: '+1 (555) 100-0018', email: 'laura.w@email.com', stressLevel: 35, lastSession: '1 day ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩', notes: 'Maintenance therapy', riskLevel: 'low', conditions: ['GAD'] },
  { id: 'p-19', name: 'Brian Taylor', age: 31, phone: '+1 (555) 100-0019', email: 'brian.t@email.com', stressLevel: 68, lastSession: '2 days ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👨‍🦱', notes: 'Relationship counseling needed', riskLevel: 'medium', conditions: ['Relationship Issues', 'Anxiety'] },
  { id: 'p-20', name: 'Melissa Adams', age: 39, phone: '+1 (555) 100-0020', email: 'melissa.a@email.com', stressLevel: 28, lastSession: '4 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩‍🦰', notes: 'Near completion of therapy program', riskLevel: 'low', conditions: ['Mild Depression'] },
  { id: 'p-21', name: 'Jason Rodriguez', age: 47, phone: '+1 (555) 100-0021', email: 'jason.r@email.com', stressLevel: 55, lastSession: '3 days ago', lastCheckIn: '2 days ago', status: 'monitoring', avatar: '👨', notes: 'Career transition stress', riskLevel: 'medium', conditions: ['Career Anxiety', 'Stress'] },
  { id: 'p-22', name: 'Amy Clark', age: 25, phone: '+1 (555) 100-0022', email: 'amy.c@email.com', stressLevel: 45, lastSession: '1 day ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩', notes: 'Good response to medication', riskLevel: 'low', conditions: ['Depression', 'Anxiety'] },
  { id: 'p-23', name: 'Daniel Kim', age: 33, phone: '+1 (555) 100-0023', email: 'daniel.k@email.com', stressLevel: 62, lastSession: '2 days ago', lastCheckIn: 'Yesterday', status: 'monitoring', avatar: '👨', notes: 'Work pressure increasing', riskLevel: 'medium', conditions: ['Burnout'] },
  { id: 'p-24', name: 'Christina Lopez', age: 30, phone: '+1 (555) 100-0024', email: 'christina.l@email.com', stressLevel: 32, lastSession: '6 hours ago', lastCheckIn: 'Today', status: 'stable', avatar: '👩', notes: 'Excellent therapy compliance', riskLevel: 'low', conditions: ['Anxiety'] },
];

const initialMessages: Message[] = [
  { id: 'msg-1', patientId: 'p-3', patientName: 'Emily Davis', avatar: '👩‍🦰', content: 'I\'m having a really difficult day. Can we talk soon?', timestamp: '5 minutes ago', read: false, priority: 'urgent' },
  { id: 'msg-2', patientId: 'p-7', patientName: 'Marcus Thompson', avatar: '👨‍🦲', content: 'Thank you for checking in. I\'m feeling a bit better today.', timestamp: '15 minutes ago', read: false, priority: 'normal' },
  { id: 'msg-3', patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', content: 'Just completed my breathing exercises. Feeling calmer now.', timestamp: '30 minutes ago', read: false, priority: 'low' },
  { id: 'msg-4', patientId: 'p-5', patientName: 'Lisa Anderson', avatar: '👱‍♀️', content: 'Need to reschedule tomorrow\'s appointment if possible.', timestamp: '1 hour ago', read: false, priority: 'normal' },
  { id: 'msg-5', patientId: 'p-2', patientName: 'Mike Chen', avatar: '👨', content: 'The new techniques are helping with my sleep!', timestamp: '2 hours ago', read: true, priority: 'low' },
  { id: 'msg-6', patientId: 'p-8', patientName: 'Amanda Wilson', avatar: '👱‍♀️', content: 'I\'ve been struggling with negative thoughts again...', timestamp: '3 hours ago', read: false, priority: 'urgent' },
  { id: 'msg-7', patientId: 'p-4', patientName: 'James Wilson', avatar: '👴', content: 'Looking forward to our session tomorrow.', timestamp: '4 hours ago', read: true, priority: 'low' },
  { id: 'msg-8', patientId: 'p-10', patientName: 'Michael Scott', avatar: '👨‍💼', content: 'Work has been overwhelming this week.', timestamp: '5 hours ago', read: false, priority: 'normal' },
  { id: 'msg-9', patientId: 'p-14', patientName: 'Nicole Martinez', avatar: '👩‍🎓', content: 'Exams are next week and I\'m feeling anxious.', timestamp: '6 hours ago', read: false, priority: 'normal' },
  { id: 'msg-10', patientId: 'p-6', patientName: 'Robert Brown', avatar: '👨‍🦱', content: 'The group session was really helpful, thank you!', timestamp: '7 hours ago', read: true, priority: 'low' },
  { id: 'msg-11', patientId: 'p-15', patientName: 'David Chen', avatar: '👨', content: 'Family situation is getting worse. Please call when you can.', timestamp: '8 hours ago', read: false, priority: 'urgent' },
  { id: 'msg-12', patientId: 'p-9', patientName: 'Jennifer Lee', avatar: '👩‍🦳', content: 'Made progress with my OCD exercises this week!', timestamp: 'Yesterday', read: true, priority: 'low' },
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
    console.log('Logging out...');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleRefresh = async () => {
    console.log('Refreshing dashboard...');
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('🔄 Dashboard refreshed!\n\nAll data is up to date.');
    setIsRefreshing(false);
  };

  // Emergency Alert handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    console.log('Removing alert:', alertId);
    setEmergencyAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleCallPatient = (alert: EmergencyAlert) => {
    console.log('Called patient:', alert.patientName);
  };

  const handleViewAlertDetails = (alert: EmergencyAlert) => {
    console.log('Viewing alert details:', alert.patientName);
  };

  // Appointment handlers
  const handleJoinCall = (appointment: Appointment) => {
    console.log('Joined call:', appointment.patientName);
    setAppointments(prev => 
      prev.map(a => a.id === appointment.id ? { ...a, status: 'in-progress' as const } : a)
    );
  };

  const handleStartSession = (appointment: Appointment) => {
    console.log('Started session:', appointment.patientName);
    setAppointments(prev => 
      prev.map(a => a.id === appointment.id ? { ...a, status: 'in-progress' as const } : a)
    );
  };

  const handleViewAllAppointments = () => {
    console.log('Viewing all appointments');
  };

  // Patient handlers
  const handleViewPatientDetails = (patient: Patient) => {
    console.log('Viewing patient:', patient.name);
  };

  const handleSendMessage = (patient: Patient) => {
    console.log('Sending message to:', patient.name);
  };

  const handleAddNote = (patient: Patient) => {
    console.log('Adding note for:', patient.name);
  };

  const handleUpdatePatientStatus = (patient: Patient, newStatus: Patient['status']) => {
    console.log('Updating status for:', patient.name, 'to', newStatus);
    setPatients(prev =>
      prev.map(p => p.id === patient.id ? { ...p, status: newStatus } : p)
    );
  };

  // Message handlers
  const handleMarkAsRead = (messageId: string) => {
    console.log('Marking as read:', messageId);
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, read: true } : m)
    );
  };

  const handleReplyMessage = (message: Message) => {
    console.log('Replying to:', message.patientName);
  };

  const handleViewAllMessages = () => {
    console.log('Viewing all messages');
  };

  // Quick Action handlers
  const handleQuickAction = (action: QuickActionType) => {
    console.log('Quick action:', action);
  };

  // Stats handler
  const handleStatClick = (statType: string) => {
    console.log('Stat clicked:', statType);
  };

  const handleScheduleClick = () => {
    console.log('Opening schedule');
    alert('📅 Opening schedule manager...\n\nCalendar view loading.');
  };

  const handleMessagesClick = () => {
    console.log('Opening messages');
    alert('💬 Opening messages...\n\nLoading all patient conversations.');
  };

  const handleNotificationsClick = () => {
    console.log('Opening notifications');
    alert('🔔 Notifications\n\n• 5 new emergency alerts\n• 12 unread messages\n• 3 appointment reminders');
  };

  const handleSettingsClick = () => {
    console.log('Opening settings');
    alert('⚙️ Opening settings...\n\n• Profile settings\n• Notification preferences\n• Dashboard customization\n• Privacy settings');
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 fade-in-up">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Welcome back, Dr. Smith
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
