import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Brain,
  Home,
  MessageCircle,
  Activity,
  Gamepad2,
  Music,
  User,
  LogOut,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  userRole?: 'user' | 'psychiatrist' | 'admin' | null;
  onLogout?: () => void;
}

const Navbar = ({ userRole, onLogout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/chat', label: 'Talk to Dr. Mind', icon: MessageCircle },
    { path: '/stress', label: 'Stress Check', icon: Activity },
    { path: '/exercises', label: 'Exercises', icon: Gamepad2 },
    { path: '/music', label: 'Relax', icon: Music },
  ];

  const psychiatristLinks = [
    { path: '/psychiatrist', label: 'Dashboard', icon: Home },
    { path: '/psychiatrist/patients', label: 'Patients', icon: User },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/users', label: 'Users', icon: User },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const getLinks = () => {
    switch (userRole) {
      case 'psychiatrist':
        return psychiatristLinks;
      case 'admin':
        return adminLinks;
      default:
        return userLinks;
    }
  };

  const links = getLinks();

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={userRole ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shadow-glow">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              MindCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          {userRole && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive(link.path) && 'shadow-glow'
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {userRole ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden md:flex gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="default" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border fade-in-up">
            <div className="flex flex-col gap-2">
              {userRole ? (
                <>
                  {links.map((link) => (
                    <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={isActive(link.path) ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout?.();
                    }}
                    className="w-full justify-start gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
