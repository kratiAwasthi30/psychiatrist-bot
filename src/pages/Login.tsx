import { useState, useCallback } from 'react';
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
import { Brain, Mail, Lock, ArrowLeft, User, Stethoscope, Settings, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

type UserRole = 'user' | 'psychiatrist' | 'admin';
type Mode = 'login' | 'signup' | 'forgot' | 'sent';

// ─────────────────────────────────────────────
// Validation rules (single source of truth)
// ─────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6;

const validators: Record<string, (val: string, extra?: string) => string> = {
  email: (v) =>
    !v ? 'Email is required' : !EMAIL_RE.test(v) ? 'Enter a valid email address' : '',
  forgotEmail: (v) =>
    !v ? 'Email is required' : !EMAIL_RE.test(v) ? 'Enter a valid email address' : '',
  password: (v) =>
    !v ? 'Password is required' : v.length < PASSWORD_MIN ? `Password must be at least ${PASSWORD_MIN} characters` : '',
  confirmPassword: (v, password) =>
    !v ? 'Please confirm your password' : v !== password ? 'Passwords do not match' : '',
  name: (v) =>
    !v.trim() ? 'Full name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
};

// Validate a single field and return error string ('' = valid)
function validateField(field: string, value: string, extra?: string): string {
  return validators[field]?.(value, extra) ?? '';
}

// Validate all fields for a given mode
function validateAll(mode: Mode, fields: {
  email: string; password: string; confirmPassword: string;
  name: string; forgotEmail: string;
}): Record<string, string> {
  const e: Record<string, string> = {};
  if (mode === 'forgot') {
    const err = validateField('forgotEmail', fields.forgotEmail);
    if (err) e.forgotEmail = err;
    return e;
  }
  const emailErr = validateField('email', fields.email);
  if (emailErr) e.email = emailErr;
  const pwErr = validateField('password', fields.password);
  if (pwErr) e.password = pwErr;
  if (mode === 'signup') {
    const nameErr = validateField('name', fields.name);
    if (nameErr) e.name = nameErr;
    const cpErr = validateField('confirmPassword', fields.confirmPassword, fields.password);
    if (cpErr) e.confirmPassword = cpErr;
  }
  return e;
}

// ─────────────────────────────────────────────
// Small UI helpers
// ─────────────────────────────────────────────

/** Inline error message shown below a field */
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  ) : null;

/** Green success tick shown when a field is valid and touched */
const FieldSuccess = ({ show }: { show: boolean }) =>
  show ? (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <CheckCircle2 className="w-4 h-4 text-green-500 animate-in fade-in duration-200" />
    </span>
  ) : null;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();

  // ── mode ──
  const [mode, setMode] = useState<Mode>('login');

  // ── form fields ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // ── UI state ──
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * errors  – field-level error messages (shown after blur or submit)
   * touched – which fields the user has interacted with
   */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);

  // ── helpers ──
  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /**
   * Mark a field as touched and immediately validate it (blur behaviour).
   * Also clears the error for that field if it's now valid (real-time clear).
   */
  const handleBlur = useCallback(
    (field: string, value: string) => {
      setTouched((t) => ({ ...t, [field]: true }));
      const err = validateField(
        field,
        value,
        field === 'confirmPassword' ? password : undefined
      );
      setErrors((e) => ({ ...e, [field]: err }));
    },
    [password]
  );

  /**
   * Called on every keystroke — clears the error for that field once
   * the value becomes valid (real-time feedback), but doesn't add new
   * errors until the field has been blurred at least once.
   */
  const handleChange = useCallback(
    (field: string, value: string) => {
      // Only show real-time clearing/feedback if field was already touched
      if (touched[field]) {
        const err = validateField(
          field,
          value,
          field === 'confirmPassword' ? password : undefined
        );
        setErrors((e) => ({ ...e, [field]: err }));
      }
    },
    [touched, password]
  );

  // Convenience setter + change handler combined
  const makeHandler = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    handleChange(field, e.target.value);
  };

  // Also re-validate confirmPassword whenever password changes (signup only)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    handleChange('password', val);
    // Re-validate confirm if already touched
    if (touched.confirmPassword) {
      const cpErr = validateField('confirmPassword', confirmPassword, val);
      setErrors((prev) => ({ ...prev, confirmPassword: cpErr }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all relevant fields so errors appear on submit
    const allFields =
      mode === 'forgot'
        ? ['forgotEmail']
        : mode === 'signup'
        ? ['email', 'password', 'confirmPassword', 'name']
        : ['email', 'password'];

    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    const errs = validateAll(mode, { email, password, confirmPassword, name, forgotEmail });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (mode === 'forgot') {
      setLoading(true);
      // 🔁 Replace with: await fetch('/api/auth/forgot-password', { method:'POST', body: JSON.stringify({ email: forgotEmail }) })
      setTimeout(() => { setLoading(false); setMode('sent'); }, 1400);
      return;
    }

    setLoading(true);
    // 🔁 Replace with real API call:
    // const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password, role }) })
    // const data = await res.json()
    // if (!res.ok) { setErrors({ email: data.message }); return; }
    // localStorage.setItem('token', data.token)
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name || email.split('@')[0]);
      switch (role) {
        case 'psychiatrist': navigate('/psychiatrist'); break;
        case 'admin': navigate('/admin'); break;
        default: navigate('/dashboard');
      }
    }, 1400);
  };

  // ── derived helpers ──
  /** True when a field is touched, has a value, and has no error */
  const isValid = (field: string, value: string) =>
    touched[field] && !!value && !errors[field];

  const roleIcons = { user: User, psychiatrist: Stethoscope, admin: Settings };
  const roleDescriptions = {
    user: 'Access your wellness dashboard, chat with Dr. Mind, and track your progress.',
    psychiatrist: 'Monitor patients, view stress reports, and manage emergency alerts.',
    admin: 'Manage users, psychiatrists, and system settings.',
  };

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-highlight/10 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">

        {/* ══ LEFT SIDE (unchanged) ══ */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <Link to="/" className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <AnimatedBot size="xl" mood="happy" className="breathe-animation" />

          <div className="space-y-4 max-w-md">
            <h1 className="font-serif text-4xl font-bold text-foreground">Welcome to MindCare</h1>
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

        {/* ══ RIGHT SIDE ══ */}
        <Card variant="glass" className="w-full fade-in-up">

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <>
              <CardHeader className="text-center space-y-2">
                <CardTitle className="font-serif text-2xl">Forgot Password?</CardTitle>
                <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="flex items-center gap-2 text-sm text-primary hover:underline mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="space-y-1">
                    <Label htmlFor="forgotEmail">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="forgotEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={makeHandler(setForgotEmail, 'forgotEmail')}
                        onBlur={() => handleBlur('forgotEmail', forgotEmail)}
                        aria-invalid={!!errors.forgotEmail}
                        aria-describedby={errors.forgotEmail ? 'forgotEmail-error' : undefined}
                        className={`pl-10 pr-10 h-12 transition-colors ${
                          errors.forgotEmail
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : isValid('forgotEmail', forgotEmail)
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : ''
                        }`}
                      />
                      <FieldSuccess show={isValid('forgotEmail', forgotEmail)} />
                    </div>
                    <FieldError message={errors.forgotEmail} />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* ── EMAIL SENT ── */}
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

          {/* ── LOGIN & SIGNUP ── */}
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
                  {mode === 'login'
                    ? 'Sign in to continue your wellness journey'
                    : 'Join us and start your path to mental wellness'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Role selector */}
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
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

                  {/* Full name — signup only */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={makeHandler(setName, 'name')}
                          onBlur={() => handleBlur('name', name)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={`pl-10 pr-10 h-12 transition-colors ${
                            errors.name
                              ? 'border-red-500 focus-visible:ring-red-500'
                              : isValid('name', name)
                              ? 'border-green-500 focus-visible:ring-green-500'
                              : ''
                          }`}
                        />
                        <FieldSuccess show={isValid('name', name)} />
                      </div>
                      <FieldError message={errors.name} />
                    </div>
                  )}

                  {/* Email — clearly labelled "Email", never "Username" */}
                  <div className="space-y-1">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={makeHandler(setEmail, 'email')}
                        onBlur={() => handleBlur('email', email)}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`pl-10 pr-10 h-12 transition-colors ${
                          errors.email
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : isValid('email', email)
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : ''
                        }`}
                      />
                      <FieldSuccess show={isValid('email', email)} />
                    </div>
                    <FieldError message={errors.email} />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => handleBlur('password', password)}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        className={`pl-10 pr-10 h-12 transition-colors ${
                          errors.password
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : isValid('password', password)
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : ''
                        }`}
                      />
                      {/* Eye toggle — only on the right when no success tick */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Hint shown before interaction; error after */}
                    {!touched.password && mode === 'signup' && (
                      <p className="text-xs text-muted-foreground">Minimum {PASSWORD_MIN} characters</p>
                    )}
                    <FieldError message={errors.password} />
                  </div>

                  {/* Confirm Password — signup only */}
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={makeHandler(setConfirmPassword, 'confirmPassword')}
                          onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                          aria-invalid={!!errors.confirmPassword}
                          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                          className={`pl-10 pr-10 h-12 transition-colors ${
                            errors.confirmPassword
                              ? 'border-red-500 focus-visible:ring-red-500'
                              : isValid('confirmPassword', confirmPassword)
                              ? 'border-green-500 focus-visible:ring-green-500'
                              : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <FieldError message={errors.confirmPassword} />
                    </div>
                  )}

                  {/* Forgot password — login only */}
                  {mode === 'login' && (
                    <div className="text-right -mt-2">
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading
                      ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                      : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-sm text-primary hover:underline"
                    >
                      {mode === 'login'
                        ? "Don't have an account? Sign up"
                        : 'Already have an account? Sign in'}
                    </button>
                  </div>

                </form>
              </CardContent>
            </>
          )}

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


