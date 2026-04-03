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
import { Brain, Mail, Lock, ArrowLeft, User, Stethoscope, Settings, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/lib/api';

type UserRole = 'user' | 'psychiatrist' | 'admin';
type Mode = 'login' | 'signup' | 'forgot' | 'sent';

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setApiError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'forgot') {
      if (!forgotEmail) e.forgotEmail = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(forgotEmail)) e.forgotEmail = 'Enter a valid email';
      return e;
    }
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (mode === 'signup') {
      if (!name) e.name = 'Full name is required';
      if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setApiError('');
    if (Object.keys(errs).length) return;
    setLoading(true);

    try {
      if (mode === 'forgot') {
        await authAPI.forgotPassword(forgotEmail);
        setMode('sent');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        const res = await authAPI.register({
          email,
          password,
          fullName: name,
          role,
        });
        if (!res.success) {
          setApiError(res.message || 'Registration failed');
          setLoading(false);
          return;
        }
        // Auto login after register
        const loginRes = await authAPI.login({ email, password, role });
        if (loginRes.success) {
          localStorage.setItem('token', loginRes.token);
          localStorage.setItem('user', JSON.stringify(loginRes.user));
          localStorage.setItem('userRole', loginRes.user.role);
          localStorage.setItem('userName', loginRes.user.fullName);
        }
      } else {
        const res = await authAPI.login({ email, password, role });
        if (!res.success) {
          setApiError(res.message || 'Invalid email or password');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('userRole', res.user.role);
        localStorage.setItem('userName', res.user.fullName);
      }

      // Navigate based on role
      switch (role) {
        case 'psychiatrist': navigate('/psychiatrist'); break;
        case 'admin': navigate('/admin'); break;
        default: navigate('/dashboard');
      }
    } catch (err) {
      setApiError('Connection error. Make sure the server is running.');
    }
    setLoading(false);
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-highlight/10 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* LEFT SIDE - unchanged */}
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

        {/* RIGHT SIDE */}
        <Card variant="glass" className="w-full fade-in-up">

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <>
              <CardHeader className="text-center space-y-2">
                <CardTitle className="font-serif text-2xl">Forgot Password?</CardTitle>
                <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <button type="button" onClick={() => switchMode('login')} className="flex items-center gap-2 text-sm text-primary hover:underline mb-6">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className={`pl-10 h-12 ${errors.forgotEmail ? 'border-red-500' : ''}`} />
                    </div>
                    {errors.forgotEmail && <p className="text-red-500 text-xs">{errors.forgotEmail}</p>}
                  </div>
                  {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* EMAIL SENT */}
          {mode === 'sent' && (
            <>
              <CardHeader className="text-center space-y-2">
                <CardTitle className="font-serif text-2xl">Email Sent!</CardTitle>
                <CardDescription>Check your inbox for the reset link.</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a reset link to <strong className="text-foreground">{forgotEmail}</strong>.<br />
                  Check your spam folder if you don't see it.
                </p>
                <Button variant="hero" className="w-full" onClick={() => switchMode('login')}>
                  Back to Sign In
                </Button>
              </CardContent>
            </>
          )}

          {/* LOGIN & SIGNUP */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center shadow-glow lg:hidden">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="font-serif text-2xl">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription>
                  {mode === 'login' ? 'Sign in to continue your wellness journey' : 'Join us and start your path to mental wellness'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role */}
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>User</span></div>
                        </SelectItem>
                        <SelectItem value="psychiatrist">
                          <div className="flex items-center gap-2"><Stethoscope className="w-4 h-4" /><span>Psychiatrist</span></div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /><span>Admin</span></div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Full name - signup only */}
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={`pl-10 h-12 ${errors.name ? 'border-red-500' : ''}`} />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  {/* Password + eye icon */}
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>

                  {/* Confirm password - signup only */}
                  {mode === 'signup' && (
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {/* Forgot password link */}
                  {mode === 'login' && (
                    <div className="text-right -mt-2">
                      <button type="button" onClick={() => switchMode('forgot')} className="text-sm text-primary hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* API error */}
                  {apiError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{apiError}</p>}

                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  </Button>

                  <div className="text-center">
                    <button type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')} className="text-sm text-primary hover:underline">
                      {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Mobile back link */}
        <Link to="/" className="lg:hidden absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
    </div>
  );
};

export default Login;
