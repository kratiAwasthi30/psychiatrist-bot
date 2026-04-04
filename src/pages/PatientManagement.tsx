import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Users, Search, AlertTriangle, TrendingUp, Eye, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PatientManagement = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, monitoring: 0, stable: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    setLoading(true);
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
          critical: users.filter((u: any) => u.latest_stress > 75).length,
          monitoring: users.filter((u: any) => u.latest_stress > 40 && u.latest_stress <= 75).length,
          stable: users.filter((u: any) => !u.latest_stress || u.latest_stress <= 40).length,
        });
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getStressColor = (level: number) => {
    if (!level) return 'text-gray-500';
    if (level > 75) return 'text-red-500';
    if (level > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusBadge = (level: number) => {
    if (!level) return { label: 'No data', class: 'bg-gray-100 text-gray-600' };
    if (level > 75) return { label: 'critical', class: 'bg-red-100 text-red-700' };
    if (level > 40) return { label: 'monitoring', class: 'bg-yellow-100 text-yellow-700' };
    return { label: 'stable', class: 'bg-green-100 text-green-700' };
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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold">Patient Management</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage your patients</p>
          </div>
          <button onClick={() => navigate('/psychiatrist/add-patient')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <UserPlus className="w-4 h-4" /> Add Patient
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Patients', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Critical', value: stats.critical, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Monitoring', value: stats.monitoring, icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'Stable', value: stats.stable, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Patient List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No patients found</p>
                <p className="text-xs mt-1">Patients will appear here once they register</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map(patient => {
                  const status = getStatusBadge(patient.latest_stress);
                  return (
                    <div key={patient.user_id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-lg">
                          {patient.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{patient.full_name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.class}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(patient.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Stress</p>
                          <p className={`font-semibold ${getStressColor(patient.latest_stress)}`}>
                            {patient.latest_stress ? `${patient.latest_stress}%` : 'No data'}
                          </p>
                        </div>
                        <Link to={`/psychiatrist/patient/${patient.user_id}`}>
                          <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                            <Eye className="w-5 h-5 text-primary" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientManagement;
