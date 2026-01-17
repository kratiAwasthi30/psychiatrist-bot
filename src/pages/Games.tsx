import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AnimatedBot from '@/components/AnimatedBot';
import {
  ArrowLeft,
  Sparkles,
  Target,
  RefreshCw,
  Trophy,
  Heart,
} from 'lucide-react';

const Games = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const games = [
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Test your memory with calming patterns',
      icon: Sparkles,
      color: 'bg-purple-500',
    },
    {
      id: 'bubble',
      name: 'Bubble Pop',
      description: 'Pop bubbles to release stress',
      icon: Target,
      color: 'bg-blue-500',
    },
    {
      id: 'breathing',
      name: 'Breathing Bubbles',
      description: 'Match your breath to floating bubbles',
      icon: Heart,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (selectedGame) {
              setSelectedGame(null);
            } else {
              navigate('/dashboard');
            }
          }}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedGame ? 'Back to Games' : 'Back to Dashboard'}
        </Button>

        {!selectedGame ? (
          <>
            <section className="text-center mb-12 fade-in-up">
              <div className="flex justify-center mb-4">
                <AnimatedBot size="lg" mood="empathetic" />
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Calming Games
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Play therapeutic mini-games designed to reduce anxiety and improve focus.
              </p>
            </section>

            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {games.map((game, index) => (
                  <Card
                    key={game.id}
                    variant="interactive"
                    className="cursor-pointer fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-20 h-20 rounded-2xl ${game.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                      >
                        <game.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-foreground text-center mb-2">
                        {game.name}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {game.description}
                      </p>
                      <Button variant="default" className="w-full">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {selectedGame === 'memory' && <MemoryGame />}
            {selectedGame === 'bubble' && <BubblePopGame />}
            {selectedGame === 'breathing' && <BreathingBubblesGame />}
          </>
        )}
      </main>
    </div>
  );
};

const MemoryGame = () => {
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const emojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🍀', '🌿', '🌵'];

  const initializeGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setMatches(matches + 1);
          setFlippedCards([]);

          if (matches + 1 === emojis.length) {
            setGameWon(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <section className="fade-in-up">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Memory Match</CardTitle>
              <CardDescription>Find all the matching pairs</CardDescription>
            </div>
            <Button onClick={initializeGame} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold text-foreground">{moves}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Matches</p>
              <p className="text-2xl font-bold text-primary">{matches}/{emojis.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${
                  card.flipped || card.matched
                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 scale-100'
                    : 'bg-muted hover:bg-muted/80 scale-95'
                } ${card.matched ? 'opacity-50' : ''}`}
              >
                {(card.flipped || card.matched) && card.emoji}
              </button>
            ))}
          </div>

          {gameWon && (
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-green-400/20 to-blue-400/20 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-xl font-bold text-foreground mb-2">Congratulations! 🎉</p>
              <p className="text-muted-foreground">You completed the game in {moves} moves!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const colors = ['bg-pink-400', 'bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400'];

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setBubbles([]);
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 40 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setBubbles((prev) => [...prev, newBubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 3000);
    }, 800);

    return () => clearInterval(interval);
  }, [gameActive]);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((prev) => prev + 10);
  };

  return (
    <section className="fade-in-up">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bubble Pop</CardTitle>
              <CardDescription>Pop as many bubbles as you can!</CardDescription>
            </div>
            <Button onClick={startGame} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {gameActive ? 'Restart' : 'Start Game'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-primary">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className="text-3xl font-bold text-foreground">{timeLeft}s</p>
            </div>
          </div>

          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl overflow-hidden">
            {!gameActive && timeLeft === 30 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Click "Start Game" to begin!</p>
              </div>
            )}

            {!gameActive && timeLeft === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <div className="text-center p-6 bg-card rounded-xl">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-xl font-bold text-foreground mb-2">Game Over!</p>
                  <p className="text-muted-foreground mb-4">Final Score: {score}</p>
                  <Button onClick={startGame}>Play Again</Button>
                </div>
              </div>
            )}

            {bubbles.map((bubble) => (
              <button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className={`absolute ${bubble.color} rounded-full cursor-pointer hover:scale-110 transition-transform opacity-80 hover:opacity-100 shadow-lg animate-float`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

const BreathingBubblesGame = () => {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [cycles, setCycles] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('exhale');
      } else {
        setPhase('inhale');
        setCycles((prev) => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [phase]);

  const handleClick = () => {
    setScore((prev) => prev + 5);
  };

  return (
    <section className="fade-in-up">
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Breathing Bubbles</CardTitle>
          <CardDescription>Click the bubble while breathing in rhythm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Cycles</p>
              <p className="text-2xl font-bold text-foreground">{cycles}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">{score}</p>
            </div>
          </div>

          <div className="relative w-full h-96 bg-gradient-to-br from-pink-50 to-blue-50 dark:from-pink-950/20 dark:to-blue-950/20 rounded-xl flex items-center justify-center overflow-hidden">
            <button
              onClick={handleClick}
              className={`w-64 h-64 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-4000 ${
                phase === 'inhale' ? 'scale-100' : 'scale-50'
              }`}
              style={{ transitionDuration: '4s' }}
            >
              <div className="text-center text-white">
                <p className="text-3xl font-bold mb-2 capitalize">{phase}</p>
                <p className="text-sm">Click to earn points</p>
              </div>
            </button>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white/30 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Click the bubble rhythmically to match your breathing and increase your score!
            </p>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -20px);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Games;