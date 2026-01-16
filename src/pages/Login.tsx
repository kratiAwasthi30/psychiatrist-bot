import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnimatedBot from '@/components/AnimatedBot';
import { Brain, Mail, Lock, ArrowLeft, User, Stethoscope, Settings } from 'lucide-react';

type UserRole = 'user' | 'psychiatrist' | 'admin';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store role in localStorage for demo
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name || email.split('@')[0]);

    // Navigate based on role
    switch (role) {
      case 'psychiatrist':
        navigate('/psychiatrist');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const roleIcons = {
    user: User,
    psychiatrist: Stethoscope,
    admin: Settings,
  };

  const roleDescriptions = {
    user: 'Access your wellness dashboard, chat with Dr. Mind, and track your progress.',
    psychiatrist: 'Monitor patients, view stress reports, and manage emergency alerts.',
    admin: 'Manage users, psychiatrists, and system settings.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-highlight/10 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side - Bot and welcome */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <Link to="/" className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <AnimatedBot size="xl" mood="happy" className="breathe-animation" />

          <div className="space-y-4 max-w-md">
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Welcome to MindCare
            </h1>
            <p className="text-lg text-muted-foreground">
              Your journey to better mental health starts here. I'm Dr. Mind, and I'm here to help.
            </p>
          </div>

          {/* Role preview */}
          <Card variant="glass" className="w-full max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = roleIcons[role];
                  return (
                    <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  );
                })()}
                <div className="text-left">
                  <p className="font-medium text-foreground capitalize">{role} Access</p>
                  <p className="text-sm text-muted-foreground">{roleDescriptions[role]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Form */}
        <Card variant="glass" className="w-full fade-in-up">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center shadow-glow lg:hidden">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-serif text-2xl">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Sign in to continue your wellness journey'
                : 'Join us and start your path to mental wellness'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role selector */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>User</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="psychiatrist">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        <span>Psychiatrist</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Mobile back link */}
        <Link
          to="/"
          className="lg:hidden absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
    </div>
  );
};

export default Login;
