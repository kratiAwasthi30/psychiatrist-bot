import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedBot from '@/components/AnimatedBot';
import Navbar from '@/components/Navbar';
import {
  MessageCircle,
  Activity,
  Gamepad2,
  Music,
  Shield,
  Heart,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Therapist',
      description: 'Talk to our empathetic AI psychiatrist anytime, anywhere.',
    },
    {
      icon: Activity,
      title: 'Stress Detection',
      description: 'Advanced typing pattern analysis to detect stress levels.',
    },
    {
      icon: Gamepad2,
      title: 'Therapeutic Games',
      description: 'Fun, calming games designed to reduce anxiety.',
    },
    {
      icon: Music,
      title: 'Relaxation',
      description: 'Guided breathing, nature sounds, and calming visuals.',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your conversations are confidential and encrypted.',
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Tailored support based on your emotional journey.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-highlight/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary text-sm text-secondary-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Your safe space for mental wellness</span>
              </div>

              <h1 className="font-serif text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Talk.{' '}
                <span className="gradient-text">Heal.</span>
                <br />
                Feel Better.
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Experience compassionate AI-powered mental health support. Our virtual psychiatrist is here to listen, understand, and guide you toward peace.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button variant="hero" size="xl" className="group">
                    Start Your Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="glass" size="xl">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {['😊', '🙂', '😌', '💚'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> people found peace
                </p>
              </div>
            </div>

            {/* Right content - Animated Bot */}
            <div className="flex justify-center lg:justify-end slide-in-right">
              <div className="relative">
                {/* Floating elements */}
                <div className="absolute -top-8 -left-8 px-4 py-2 rounded-xl glass-card float-animation" style={{ animationDelay: '0s' }}>
                  <span className="text-2xl">💭</span>
                </div>
                <div className="absolute -bottom-4 -left-12 px-4 py-2 rounded-xl glass-card float-animation" style={{ animationDelay: '1s' }}>
                  <span className="text-2xl">💚</span>
                </div>
                <div className="absolute top-1/4 -right-8 px-4 py-2 rounded-xl glass-card float-animation" style={{ animationDelay: '2s' }}>
                  <span className="text-2xl">✨</span>
                </div>

                {/* Speech bubble */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl glass-card shadow-glow">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">
                    "Hello! I'm Dr. Mind. How are you feeling today?"
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card rotate-45 border-r border-b border-white/20" />
                </div>

                <AnimatedBot size="xl" mood="happy" className="breathe-animation" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Your Complete Mental Wellness Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your mental health journey, in one caring space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="interactive"
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center mb-4 shadow-glow">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-12 lg:p-16 text-center relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <AnimatedBot size="lg" mood="empathetic" />
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                  Take the first step toward better mental health. Our AI psychiatrist is ready to listen.
                </p>
                <Link to="/login">
                  <Button variant="hero" size="xl">
                    Start Free Session
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 MindCare. Your mental health matters.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
