import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AnimatedBot from '@/components/AnimatedBot';
import { MessageCircle, Activity, Gamepad2, Music, ArrowRight, TrendingUp, TrendingDown, Flame } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Friend');
  const [stressLevel, setStressLevel] = useState(35);
  const [stressHistory, setStressHistory] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentMood, setCurrentMood] = useState('good');
  const token = localStorage.getItem('token');

  const moods = [
    { id: 'great', emoji: '😄', label: 'Great', stress: 10 },
    { id: 'good', emoji: '🙂', label: 'Good', stress: 25 },
    { id: 'okay', emoji: '😐', label: 'Okay', stress: 45 },
    { id: 'low', emoji: '😔', label: 'Low', stress: 65 },
    { id: 'stressed', emoji: '😰', label: 'Stressed', stress: 80 },
  ];

  useEffect(() => {
    const n = localStorage.getItem('userName');
    if (n) setUserName(n);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [h, w] = await Promise.all([
        fetch(`${API_URL}/stress/history`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/stress/weekly`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const hd = await h.json();
      const wd = await w.json();
      if (hd.success) { setStressHistory(hd.data); if (hd.data[0]) setStressLevel(hd.data[0].stress_level); setStreak(hd.data.length); }
      if (wd.success) setWeeklyData(wd.data);
    } catch (e) { console.error(e); }
  };

  const logMood = async (mood: any) => {
    setCurrentMood(mood.id);
    setStressLevel(mood.stress);
    try {
      await fetch(`${API_URL}/stress/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stressLevel: mood.stress, mood: mood.id }),
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const getColor = (l: number) => l <= 30 ? '#34D399' : l <= 60 ? '#FBBF24' : '#F87171';
  const getLabel = (l: number) => l <= 30 ? { text: 'Low Stress', color: 'text-green-500' } : l <= 60 ? { text: 'Moderate', color: 'text-yellow-500' } : { text: 'High Stress', color: 'text-red-500' };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const actions = [
    { icon: MessageCircle, title: 'Talk to Dr. Mind', desc: 'Chat with your AI therapist', path: '/chat', g: 'from-violet-500 to-purple-600' },
    { icon: Activity, title: 'Stress Check', desc: 'Analyze stress levels', path: '/stress', g: 'from-teal-500 to-cyan-600' },
    { icon: Gamepad2, title: 'Calming Games', desc: 'Therapeutic games', path: '/games', g: 'from-pink-500 to-rose-600' },
    { icon: Music, title: 'Relax Music', desc: 'Soothing sounds', path: '/music', g: 'from-amber-500 to-orange-600' },
  ];

  const max = Math.max(...weeklyData.map(d => Number(d.avg_stress)), 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="user" onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6 max-w-6xl">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Hello, {userName} 👋</h1>
            <p className="text-muted-foreground mt-1">How are you feeling today?</p>
          </div>
          <div className="hidden md:block"><AnimatedBot size="md" mood="happy" /></div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-5">
            <p className="font-medium mb-4">Log your current mood</p>
            <div className="flex gap-3 flex-wrap">
              {moods.map(m => (
                <button key={m.id} onClick={() => logMood(m)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all ${currentMood === m.id ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/50'}`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Current Stress</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={getColor(stressLevel)} strokeWidth="12"
                    strokeDasharray={`${(stressLevel / 100) * 314} 314`} strokeLinecap="round" className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{stressLevel}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className={`font-semibold mt-2 ${getLabel(stressLevel).color}`}>{getLabel(stressLevel).text}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Check-in Streak</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-6 h-40">
              <div className="flex items-center gap-2">
                <Flame className="w-10 h-10 text-orange-500" />
                <span className="text-5xl font-bold">{streak}</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">days logged 🔥</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Trend</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-6 h-40">
              {stressHistory.length >= 2 ? (
                stressHistory[0].stress_level < stressHistory[1].stress_level
                  ? <><TrendingDown className="w-12 h-12 text-green-500" /><p className="text-green-500 font-semibold mt-2">Improving!</p></>
                  : <><TrendingUp className="w-12 h-12 text-red-400" /><p className="text-red-400 font-semibold mt-2">Rising stress</p></>
              ) : <p className="text-muted-foreground text-sm text-center">Log daily to see trends</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Weekly Stress Graph</CardTitle></CardHeader>
          <CardContent>
            {weeklyData.length === 0
              ? <div className="flex items-center justify-center h-40 text-muted-foreground">Log your mood daily to see your graph 📊</div>
              : <div className="flex items-end gap-3 h-40 px-2">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-1">
                      <span className="text-xs text-muted-foreground">{Math.round(d.avg_stress)}</span>
                      <div className="w-full rounded-t-lg transition-all duration-500"
                        style={{ height: `${(Number(d.avg_stress) / max) * 120}px`, background: getColor(Number(d.avg_stress)), minHeight: '8px' }} />
                      <span className="text-xs text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
            }
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {actions.map(a => (
            <Link key={a.path} to={a.path}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.g} flex items-center justify-center mb-3`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link to="/chat"><Button variant="outline" size="sm">Go to Chat <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </CardHeader>
          <CardContent>
            {stressHistory.length === 0
              ? <p className="text-muted-foreground text-sm text-center py-4">No activity yet. Start by chatting with Dr. Mind!</p>
              : <div className="space-y-3">
                  {stressHistory.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: getColor(log.stress_level) }} />
                        <div>
                          <p className="text-sm font-medium capitalize">{log.mood || 'Check-in'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(log.logged_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${getLabel(log.stress_level).color}`}>{log.stress_level}</span>
                    </div>
                  ))}
                </div>
            }
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;
