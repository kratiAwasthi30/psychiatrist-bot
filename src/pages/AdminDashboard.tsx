import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import {
  Users,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'psychiatrist';
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const users: SystemUser[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active', joinDate: 'Jan 15, 2024', lastActive: '2 hours ago' },
    { id: '2', name: 'Mike Chen', email: 'mike@example.com', role: 'user', status: 'active', joinDate: 'Feb 20, 2024', lastActive: '1 day ago' },
    { id: '3', name: 'Dr. Emily Davis', email: 'emily@example.com', role: 'psychiatrist', status: 'active', joinDate: 'Dec 10, 2023', lastActive: 'Just now' },
    { id: '4', name: 'James Wilson', email: 'james@example.com', role: 'user', status: 'inactive', joinDate: 'Mar 5, 2024', lastActive: '1 week ago' },
    { id: '5', name: 'Dr. Lisa Anderson', email: 'lisa@example.com', role: 'psychiatrist', status: 'active', joinDate: 'Nov 1, 2023', lastActive: '5 hours ago' },
    { id: '6', name: 'Robert Brown', email: 'robert@example.com', role: 'user', status: 'active', joinDate: 'Apr 1, 2024', lastActive: '3 hours ago' },
  ];

  const systemStats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'primary' },
    { label: 'Psychiatrists', value: '45', change: '+5%', icon: Stethoscope, color: 'highlight' },
    { label: 'Active Sessions', value: '89', change: '+23%', icon: Activity, color: 'success' },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: Shield, color: 'accent' },
  ];

  const recentErrors = [
    { id: '1', message: 'API rate limit reached for AI service', time: '10 minutes ago', severity: 'warning' },
    { id: '2', message: 'Failed login attempt from suspicious IP', time: '1 hour ago', severity: 'error' },
    { id: '3', message: 'Database backup completed', time: '3 hours ago', severity: 'info' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar userRole="admin" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 fade-in-up">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, psychiatrists, and system settings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {systemStats.map((stat, index) => (
            <Card
              key={stat.label}
              variant="elevated"
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    stat.color === 'primary' && 'bg-primary/10 text-primary',
                    stat.color === 'highlight' && 'bg-highlight/10 text-highlight',
                    stat.color === 'success' && 'bg-success/10 text-success',
                    stat.color === 'accent' && 'bg-accent/10 text-accent'
                  )}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="fade-in-up">
            <Card variant="glass">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all users and psychiatrists</CardDescription>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.role === 'psychiatrist' ? 'default' : 'secondary'}>
                              {user.role === 'psychiatrist' ? (
                                <><Stethoscope className="w-3 h-3 mr-1" /> Psychiatrist</>
                              ) : (
                                <><Users className="w-3 h-3 mr-1" /> User</>
                              )}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={cn(
                              user.status === 'active'
                                ? 'bg-success/20 text-success border-success/30'
                                : 'bg-muted text-muted-foreground'
                            )}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{user.joinDate}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{user.lastActive}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="fade-in-up">
            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="text-muted-foreground">Activity chart placeholder</p>
                      <p className="text-sm text-muted-foreground">Connect to analytics service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-success" />
                    Session Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-success mx-auto mb-3" />
                      <p className="text-muted-foreground">Session chart placeholder</p>
                      <p className="text-sm text-muted-foreground">Connect to analytics service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="fade-in-up">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  System Logs
                </CardTitle>
                <CardDescription>Recent system events and errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentErrors.map((error) => (
                    <div
                      key={error.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl',
                        error.severity === 'error' && 'bg-destructive/10 border border-destructive/20',
                        error.severity === 'warning' && 'bg-warning/10 border border-warning/20',
                        error.severity === 'info' && 'bg-highlight/10 border border-highlight/20'
                      )}
                    >
                      <AlertCircle className={cn(
                        'w-5 h-5 mt-0.5',
                        error.severity === 'error' && 'text-destructive',
                        error.severity === 'warning' && 'text-warning',
                        error.severity === 'info' && 'text-highlight'
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{error.message}</p>
                        <p className="text-sm text-muted-foreground">{error.time}</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        error.severity === 'error' && 'border-destructive text-destructive',
                        error.severity === 'warning' && 'border-warning text-warning',
                        error.severity === 'info' && 'border-highlight text-highlight'
                      )}>
                        {error.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
