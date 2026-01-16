import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import StressGauge from '@/components/StressGauge';
import AnimatedBot from '@/components/AnimatedBot';
import { Play, RotateCcw, Keyboard, Timer, Target, AlertTriangle } from 'lucide-react';

const StressCheck = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'typing' | 'results'>('intro');
  const [userText, setUserText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    accuracy: 0,
    corrections: 0,
    hesitations: 0,
  });
  const [stressScore, setStressScore] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeyTimeRef = useRef<number>(0);
  const correctionCountRef = useRef(0);
  const hesitationCountRef = useRef(0);

  const sampleText = "The gentle waves lapped against the shore as the sun began to set, painting the sky in hues of orange and pink. A cool breeze carried the scent of salt and seaweed, creating a peaceful atmosphere. Birds flew overhead, their calls echoing across the water.";

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      calculateResults();
    }
  }, [isRunning, timeLeft]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const startTest = () => {
    setPhase('typing');
    setUserText('');
    setTimeLeft(60);
    setIsRunning(true);
    correctionCountRef.current = 0;
    hesitationCountRef.current = 0;
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const currentTime = Date.now();
    
    // Detect backspace/corrections
    if (newText.length < userText.length) {
      correctionCountRef.current++;
    }
    
    // Detect hesitations (pauses > 2 seconds)
    if (lastKeyTimeRef.current && currentTime - lastKeyTimeRef.current > 2000) {
      hesitationCountRef.current++;
    }
    
    lastKeyTimeRef.current = currentTime;
    setUserText(newText);
  };

  const calculateResults = () => {
    setIsRunning(false);
    
    // Calculate WPM
    const words = userText.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60 || 1;
    const wpm = Math.round(words / minutes);
    
    // Calculate accuracy
    const sampleWords = sampleText.split(' ');
    const userWords = userText.trim().split(' ');
    let correctWords = 0;
    userWords.forEach((word, i) => {
      if (sampleWords[i] && word.toLowerCase() === sampleWords[i].toLowerCase()) {
        correctWords++;
      }
    });
    const accuracy = Math.round((correctWords / Math.max(userWords.length, 1)) * 100);
    
    // Set metrics
    const newMetrics = {
      wpm,
      accuracy,
      corrections: correctionCountRef.current,
      hesitations: hesitationCountRef.current,
    };
    setMetrics(newMetrics);
    
    // Calculate stress score (higher corrections + hesitations = higher stress)
    // Low WPM or high corrections suggest stress
    let stress = 30; // Base stress
    
    if (wpm < 20) stress += 25;
    else if (wpm < 35) stress += 15;
    else if (wpm < 50) stress += 5;
    
    stress += Math.min(correctionCountRef.current * 2, 25);
    stress += Math.min(hesitationCountRef.current * 5, 20);
    
    if (accuracy < 60) stress += 15;
    else if (accuracy < 80) stress += 10;
    
    setStressScore(Math.min(Math.max(stress, 10), 95));
    setPhase('results');
  };

  const resetTest = () => {
    setPhase('intro');
    setUserText('');
    setTimeLeft(60);
    setMetrics({ wpm: 0, accuracy: 0, corrections: 0, hesitations: 0 });
    setStressScore(0);
  };

  const getStressAnalysis = () => {
    if (stressScore <= 30) {
      return {
        title: 'Low Stress Detected',
        message: "Your typing patterns suggest you're feeling calm and relaxed. Great job maintaining your composure!",
        color: 'text-success',
        mood: 'happy' as const,
      };
    } else if (stressScore <= 50) {
      return {
        title: 'Moderate Stress Detected',
        message: "Your typing shows some signs of stress. Consider taking a short break or trying a breathing exercise.",
        color: 'text-highlight',
        mood: 'neutral' as const,
      };
    } else if (stressScore <= 70) {
      return {
        title: 'Elevated Stress Detected',
        message: "Your typing patterns indicate elevated stress levels. I recommend some relaxation techniques.",
        color: 'text-warning',
        mood: 'empathetic' as const,
      };
    }
    return {
      title: 'High Stress Detected',
      message: "Your typing suggests high stress levels. Please take care of yourself. Would you like to talk or try some calming exercises?",
      color: 'text-destructive',
      mood: 'empathetic' as const,
    };
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Intro Phase */}
        {phase === 'intro' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 fade-in-up">
            <AnimatedBot size="lg" mood="neutral" className="mx-auto" />
            
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                Typing Stress Analysis
              </h1>
              <p className="text-lg text-muted-foreground">
                This analysis detects stress through your typing patterns. Type the sample text below, and I'll analyze your speed, accuracy, corrections, and hesitations to assess your stress level.
              </p>
            </div>

            <Card variant="calm" className="text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-primary" />
                  How it works
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Type the sample text as naturally as possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    We analyze typing speed, corrections, and pauses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Frequent corrections may indicate shaky hands or anxiety
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Long pauses might suggest difficulty concentrating
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button variant="hero" size="xl" onClick={startTest}>
              <Play className="w-5 h-5" />
              Start Analysis
            </Button>
          </div>
        )}

        {/* Typing Phase */}
        {phase === 'typing' && (
          <div className="max-w-3xl mx-auto space-y-6 fade-in-up">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Type the text below
              </h1>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10">
                <Timer className="w-5 h-5 text-primary" />
                <span className="font-mono text-xl font-bold text-primary">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Sample text */}
            <Card variant="glass">
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {sampleText}
                </p>
              </CardContent>
            </Card>

            {/* User input */}
            <Textarea
              ref={textareaRef}
              value={userText}
              onChange={handleTextChange}
              placeholder="Start typing here..."
              className="min-h-[200px] text-lg"
            />

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={resetTest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={calculateResults}>
                Finish Early
              </Button>
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
          <div className="max-w-3xl mx-auto space-y-8 fade-in-up">
            <div className="text-center">
              <AnimatedBot size="lg" mood={getStressAnalysis().mood} className="mx-auto mb-6" />
              <h1 className={`font-serif text-3xl font-bold ${getStressAnalysis().color}`}>
                {getStressAnalysis().title}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
                {getStressAnalysis().message}
              </p>
            </div>

            {/* Stress Gauge */}
            <Card variant="glass">
              <CardContent className="p-8">
                <StressGauge level={stressScore} />
              </CardContent>
            </Card>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <Keyboard className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{metrics.wpm}</p>
                  <p className="text-sm text-muted-foreground">Words/min</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{metrics.accuracy}%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <RotateCcw className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{metrics.corrections}</p>
                  <p className="text-sm text-muted-foreground">Corrections</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6 text-center">
                  <Timer className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{metrics.hesitations}</p>
                  <p className="text-sm text-muted-foreground">Hesitations</p>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            {stressScore > 50 && (
              <Card variant="accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Based on your results, here are some suggestions:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Try our breathing exercise to calm your nervous system
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Take a 5-minute break and stretch your hands
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Talk to Dr. Mind about what might be causing stress
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetTest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/exercises')}>
                Try Relaxation Exercises
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StressCheck;
