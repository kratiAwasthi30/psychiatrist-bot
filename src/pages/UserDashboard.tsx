import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import StressGauge from '@/components/StressGauge';
import MoodIndicator from '@/components/MoodIndicator';
import AnimatedBot from '@/components/AnimatedBot';
import {
  MessageCircle,
  Activity,
  Gamepad2,
  Music,
  Calendar,
  TrendingDown,
  Clock,
  Target,
  ArrowRight,
  Bell,
  Plus,
  X,
  Settings,
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Friend');
  const [currentMood, setCurrentMood] = useState<'great' | 'good' | 'okay' | 'low' | 'stressed'>('good');
  const [stressLevel, setStressLevel] = useState(35);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ time: '', title: '', type: 'exercise' });
  const [reminders, setReminders] = useState([
    { time: '2:00 PM', title: 'Breathing Exercise', type: 'exercise', id: 1 },
    { time: '6:00 PM', title: 'Evening Check-in', type: 'checkin', id: 2 },
    { time: '9:00 PM', title: 'Relaxation Session', type: 'relax', id: 3 },
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleAddReminder = () => {
    if (newReminder.time && newReminder.title) {
      setReminders([...reminders, { ...newReminder, id: Date.now() }]);
      setNewReminder({ time: '', title: '', type: 'exercise' });
      setShowAddReminder(false);
    }
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Talk to Dr. Mind',
      description: 'Start a conversation with your AI therapist',
      path: '/chat',
      color: 'primary-gradient',
    },
    {
      icon: Activity,
      title: 'Stress Check',
      description: 'Analyze your stress through typing patterns',
      path: '/stress',
      color: 'bg-highlight',
    },
    {
      icon: Gamepad2,
      title: 'Calming Games',
      description: 'Play therapeutic mini-games',
      path: '/games',
      color: 'bg-accent',
    },
    {
      icon: Music,
      title: 'Relax & Unwind',
      description: 'Breathing exercises and calming sounds',
      path: '/relaxation',
      color: 'bg-success',
    },
  ];

  const weeklyMoods = [
    { day: 'Mon', mood: 'good' as const, value: 70 },
    { day: 'Tue', mood: 'great' as const, value: 90 },
    { day: 'Wed', mood: 'okay' as const, value: 60 },
    { day: 'Thu', mood: 'low' as const, value: 30 },
    { day: 'Fri', mood: 'good' as const, value: 75 },
    { day: 'Sat', mood: 'great' as const, value: 95 },
    { day: 'Sun', mood: 'good' as const, value: 80 },
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'okay': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'stressed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Settings Button - Top Right */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="gap-2"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </div>

        {/* Welcome Section */}
        <section className="mb-8 fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <AnimatedBot size="md" mood="happy" className="hidden sm:block" />
              <div>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  {getGreeting()}, {userName}! 👋
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  How are you feeling today? I'm here to help.
                </p>
              </div>
            </div>

            {/* Mood selector */}
            <Card variant="glass" className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Today's mood:</p>
              <div className="flex gap-2">
                {(['great', 'good', 'okay', 'low', 'stressed'] as const).map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setCurrentMood(mood)}
                    className={`transition-all duration-200 ${
                      currentMood === mood ? 'scale-110' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <MoodIndicator mood={mood} size="sm" showLabel={false} />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="elevated" className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-medium">
                  -12% this week
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Current Stress Level</p>
              <StressGauge level={stressLevel} className="mt-4" />
            </CardContent>
          </Card>

          <Card variant="elevated" className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-highlight/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-highlight" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Time with Dr. Mind</p>
              <p className="font-serif text-3xl font-bold text-foreground mt-2">4h 32m</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Weekly Goals</p>
              <p className="font-serif text-3xl font-bold text-foreground mt-2">5/7</p>
              <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <div className="h-full w-[71%] bg-accent rounded-full transition-all duration-500" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.path} to={action.path}>
                <Card
                  variant="interactive"
                  className="h-full fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-4 shadow-glow`}
                    >
                      <action.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Mood Tracker with Bar Chart */}
          <Card variant="glass" className="fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Mood Tracker
              </CardTitle>
              <CardDescription>Your emotional journey this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="flex items-end justify-between h-48 gap-2">
                  {weeklyMoods.map((item, index) => (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className={`w-full ${getMoodColor(item.mood)} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
                          style={{
                            height: `${item.value}%`,
                            animationDelay: `${index * 0.1}s`,
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              {item.mood} ({item.value}%)
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  {[
                    { mood: 'great', color: 'bg-green-500' },
                    { mood: 'good', color: 'bg-blue-500' },
                    { mood: 'okay', color: 'bg-yellow-500' },
                    { mood: 'low', color: 'bg-orange-500' },
                    { mood: 'stressed', color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.mood} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      <span className="text-xs text-muted-foreground capitalize">{item.mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reminders with Add/Delete */}
          <Card variant="glass" className="fade-in-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Today's Reminders
                  </CardTitle>
                  <CardDescription>Manage your wellness activities</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddReminder(!showAddReminder)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add Reminder Form */}
                {showAddReminder && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Time"
                    />
                    <input
                      type="text"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Reminder title"
                    />
                    <select
                      value={newReminder.type}
                      onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="exercise">Exercise</option>
                      <option value="checkin">Check-in</option>
                      <option value="relax">Relax</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={handleAddReminder} className="flex-1">
                        Save Reminder
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddReminder(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reminders List */}
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg primary-gradient flex items-center justify-center">
                        {reminder.type === 'exercise' && <Activity className="w-5 h-5 text-primary-foreground" />}
                        {reminder.type === 'checkin' && <MessageCircle className="w-5 h-5 text-primary-foreground" />}
                        {reminder.type === 'relax' && <Music className="w-5 h-5 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground">{reminder.time}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bot prompt */}
        <Card variant="calm" className="mt-8 fade-in-up">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <AnimatedBot size="md" mood="empathetic" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-medium text-foreground mb-2">
                "I noticed you've been doing well this week! Would you like to share what's been helping you?"
              </p>
              <p className="text-sm text-muted-foreground">
                Regular check-ins help us understand you better.
              </p>
            </div>
            <Link to="/chat">
              <Button variant="default" size="lg">
                Let's Talk
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;