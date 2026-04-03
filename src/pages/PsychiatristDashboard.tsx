import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Users, AlertTriangle, TrendingUp, MessageCircle, Search, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PsychiatristDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, highStress: 0, active: 0 });
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const token = localStorage.getItem('token');
  const doctorName = localStorage.getItem('userName') || 'Doctor';

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const users = data.data.filter((u: any) => u.role === 'user');
        setPatients(users);
        setStats({
          total: users.length,
          highStress: users.filter((u: any) => u.latest_stress > 60).length,
          active: users.filter((u: any) => u.is_active).length,
        });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getStressColor = (level: number) => {
    if (!level) return 'bg-gray-100 text-gray-600';
    if (level <= 30) return 'bg-green-100 text-green-700';
    if (level <= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getStressLabel = (level: number) => {
    if (!level) return 'No data';
    if (level <= 30) return 'Low';
    if (level <= 60) return 'Moderate';
    return 'High';
  };

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6 max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Welcome, Dr. {doctorName} 👨‍⚕️</h1>
          <p className="text-muted-foreground mt-1">Monitor your patients and manage their mental health journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.highStress}</p>
                <p className="text-sm text-muted-foreground">High Stress</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Patient List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No patients found</p>
                <p className="text-xs mt-1">Patients will appear here once they register</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(patient => (
                  <div key={patient.user_id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => setSelectedPatient(selectedPatient?.user_id === patient.user_id ? null : patient)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {patient.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.full_name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStressColor(patient.latest_stress)}`}>
                        {getStressLabel(patient.latest_stress)} {patient.latest_stress ? `(${patient.latest_stress})` : ''}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${patient.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient Detail Panel */}
        {selectedPatient && (
          <Card className="mt-6 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {selectedPatient.full_name?.charAt(0).toUpperCase()}
                </div>
                {selectedPatient.full_name} — Detail View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium mt-1">{selectedPatient.email}</p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium mt-1 capitalize">{selectedPatient.role}</p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Latest Stress</p>
                  <p className={`text-sm font-semibold mt-1 ${selectedPatient.latest_stress > 60 ? 'text-red-500' : selectedPatient.latest_stress > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {selectedPatient.latest_stress || 'No data'}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium mt-1">{new Date(selectedPatient.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Message
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
};

export default PsychiatristDashboard;
