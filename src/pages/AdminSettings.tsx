import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Shield, Users, Bell, Lock, Mail, Activity } from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const settings = [
    { icon: Users, title: 'User Management', desc: 'Manage users, roles and permissions', path: '/admin/users', color: 'bg-blue-500' },
    { icon: Bell, title: 'Notifications', desc: 'Configure system notifications and alerts', path: '/notifications', color: 'bg-orange-500' },
    { icon: Lock, title: 'Security', desc: 'Password policies and access control', path: '/privacy', color: 'bg-red-500' },
    { icon: Mail, title: 'Email Settings', desc: 'SMTP and email configuration', path: '/admin/settings', color: 'bg-teal-500' },
    { icon: Activity, title: 'System Logs', desc: 'View system activity and logs', path: '/admin/settings', color: 'bg-green-500' },
    { icon: Shield, title: 'Privacy & Compliance', desc: 'Data protection and compliance', path: '/privacy', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Settings ⚙️</h1>
          <p className="text-muted-foreground mt-1">Configure system settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {settings.map(s => (
            <Card key={s.title} className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => navigate(s.path)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">System Info</h3>
              <p className="text-sm text-muted-foreground mt-1">MindCare v1.0.0 — All systems operational ✅</p>
              <p className="text-sm text-muted-foreground">Database: MySQL — Connected ✅</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminSettings;
