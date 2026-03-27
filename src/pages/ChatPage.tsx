import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ChatMessage, { TypingIndicator } from '@/components/ChatMessage';
import AnimatedBot from '@/components/AnimatedBot';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
}

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Dr. Mind, your AI mental health companion. I'm here to listen without judgment and help you navigate your thoughts and feelings. How are you doing today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: 'happy',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentBotMood, setCurrentBotMood] = useState<
    'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking'
  >('happy');
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll to latest message ──
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ── Silence detection ──
  useEffect(() => {
    if (silenceTimer) clearTimeout(silenceTimer);
    const timer = setTimeout(() => {
      if (!isTyping && messages.length > 0) {
        const silenceMessages = [
          "Take your time, I'm here with you.",
          "There's no rush. I'm listening whenever you're ready.",
          "Sometimes silence is okay. I'm here when you want to talk.",
        ];
        addBotMessage(
          silenceMessages[Math.floor(Math.random() * silenceMessages.length)],
          'empathetic'
        );
      }
    }, 30000);
    setSilenceTimer(timer);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // ── Add a bot message with realistic typing delay ──
  const addBotMessage = (
    text: string,
    mood: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking' = 'neutral'
  ) => {
    // Show typing indicator immediately
    setIsTyping(true);
    setCurrentBotMood('listening');
    setIsBotSpeaking(false);

    // Typing delay scales with message length (feels natural)
    const typingDelay = Math.min(800 + text.length * 18, 3000);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood,
        },
      ]);
      setIsTyping(false);
      setCurrentBotMood('speaking');
      setIsBotSpeaking(true);

      // Bot "finishes speaking" after a moment
      setTimeout(() => {
        setIsBotSpeaking(false);
        setCurrentBotMood(mood);
      }, 2000);
    }, typingDelay);
  };

  // ── Response logic ──
  const getBotResponse = (
    userMessage: string
  ): { text: string; mood: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking' } => {
    const lower = userMessage.toLowerCase();

    // Greeting
    if (lower.match(/^(hi|hello|hey|good morning|good evening|good afternoon)[\s!.]*$/)) {
      return {
        text: "Hi there! 👋 I'm really glad you reached out. How are you feeling today? Don't hold back — this is a safe space.",
        mood: 'happy',
      };
    }

    // Not feeling well / unwell
    if (
      lower.includes('not feeling well') ||
      lower.includes('not well') ||
      lower.includes('feeling sick') ||
      lower.includes('not good') ||
      lower.includes('not okay') ||
      lower.includes('not ok')
    ) {
      return {
        text: "I'm sorry to hear that. 💙 It's okay to not be okay sometimes. Can you tell me a bit more — is it more of a physical feeling, or is something emotionally weighing on you?",
        mood: 'empathetic',
      };
    }

    // Stress / anxiety
    if (
      lower.includes('stress') ||
      lower.includes('anxious') ||
      lower.includes('anxiety') ||
      lower.includes('worried') ||
      lower.includes('overwhelmed') ||
      lower.includes('panic')
    ) {
      return {
        text: "I hear that you're feeling stressed — that's completely valid, and I'm glad you're sharing this with me. Would you like to try a quick breathing exercise together, or would you prefer to talk more about what's been causing these feelings?",
        mood: 'empathetic',
      };
    }

    // Sadness / depression
    if (
      lower.includes('sad') ||
      lower.includes('depressed') ||
      lower.includes('depression') ||
      lower.includes('lonely') ||
      lower.includes('hopeless') ||
      lower.includes('empty') ||
      lower.includes('crying') ||
      lower.includes('cry')
    ) {
      return {
        text: "I'm really sorry you're feeling this way. Your feelings are valid, and it takes real courage to express them. I'm here with you. Can you tell me more about what's been weighing on you?",
        mood: 'empathetic',
      };
    }

    // Anger / frustration
    if (
      lower.includes('angry') ||
      lower.includes('anger') ||
      lower.includes('frustrated') ||
      lower.includes('frustration') ||
      lower.includes('irritated') ||
      lower.includes('mad')
    ) {
      return {
        text: "It sounds like you're carrying some frustration right now. That's completely understandable. Would you like to talk about what triggered this feeling? Sometimes just putting it into words can help.",
        mood: 'empathetic',
      };
    }

    // Positive / doing well
    if (
      lower.includes('happy') ||
      lower.includes('great') ||
      lower.includes('amazing') ||
      lower.includes('wonderful') ||
      lower.includes('feeling good') ||
      lower.includes('doing well') ||
      lower.includes('doing good') ||
      (lower.includes('good') && lower.length < 15)
    ) {
      return {
        text: "That's wonderful to hear! 😊 I'm so glad you're in a good place. What do you think has been contributing to this positive feeling? Recognising what uplifts us is a powerful tool.",
        mood: 'happy',
      };
    }

    // Sleep issues
    if (
      lower.includes('sleep') ||
      lower.includes('insomnia') ||
      lower.includes("can't sleep") ||
      lower.includes('tired') ||
      lower.includes('exhausted')
    ) {
      return {
        text: "Sleep struggles can really affect everything else in life. 😔 How long has this been going on? Have you noticed anything specific that tends to keep you awake?",
        mood: 'empathetic',
      };
    }

    // Default — varied responses so it doesn't feel repetitive
    const defaults = [
      "Thank you for sharing that with me. I'm here to listen — can you tell me a bit more about how that's been making you feel?",
      "I appreciate you opening up. 💙 It sounds like there's quite a bit on your mind. What feels most important to talk about right now?",
      "I hear you. Sometimes it helps to just talk through what we're experiencing. What's been the hardest part for you lately?",
    ];
    return {
      text: defaults[Math.floor(Math.random() * defaults.length)],
      mood: 'neutral',
    };
  };

  // ── Send message ──
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    inputRef.current?.focus();

    const { text: botText, mood } = getBotResponse(text);
    addBotMessage(botText, mood);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice input toggle (UI only — wire up SpeechRecognition API as needed) ──
  const toggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (next) setCurrentBotMood('listening');
      else if (!isTyping) setCurrentBotMood('neutral');
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pb-6 pt-4 gap-4">

        {/* ── Bot status header ── */}
        <Card variant="glass" className="p-4 flex items-center gap-4">
          <div className="relative">
            <AnimatedBot size="md" mood={currentBotMood} className="breathe-animation" />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Dr. Mind</p>
            <p className="text-xs text-muted-foreground">
              {isTyping
                ? 'Typing…'
                : isBotSpeaking
                ? 'Speaking…'
                : isMicOn
                ? 'Listening to you…'
                : 'Online · Here to help'}
            </p>
          </div>
          {/* Sound toggle */}
          <button
            onClick={() => setIsSoundOn((s) => !s)}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={isSoundOn ? 'Mute bot voice' : 'Unmute bot voice'}
          >
            {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </Card>

        {/* ── Message list ── */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0 max-h-[calc(100vh-280px)] scroll-smooth py-2">
          {messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            // Hide avatar when same sender sends consecutive messages
            const isSameAsPrev = prevMsg && prevMsg.isBot === msg.isBot;
            return (
              <div key={msg.id} className={isSameAsPrev ? 'mt-1' : 'mt-4'}>
                <ChatMessage
                  message={msg.text}
                  isBot={msg.isBot}
                  timestamp={msg.timestamp}
                  mood={msg.mood}
                  hideAvatar={isSameAsPrev}
                />
              </div>
            );
          })}

          {/* Typing indicator — always below last message */}
          {isTyping && (
            <div className="mt-4">
              <TypingIndicator />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ── */}
        <div className="flex items-center gap-2">

          {/* Voice input button */}
          <button
            onClick={toggleMic}
            aria-label={isMicOn ? 'Stop recording' : 'Start voice input'}
            className={cn(
              'flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm',
              isMicOn
                ? 'bg-red-500 text-white scale-110 shadow-[0_0_0_4px_rgba(239,68,68,0.25)] animate-pulse'
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            )}
          >
            {isMicOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text input */}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isMicOn ? 'Listening\u2026' : "Share what's on your mind\u2026"}
            disabled={isMicOn}
            className="flex-1 h-11 rounded-full px-5 bg-card border border-border focus-visible:ring-primary/50 transition-all"
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={cn(
              'flex-shrink-0 w-11 h-11 rounded-full p-0 flex items-center justify-center transition-all duration-200',
              inputValue.trim() && !isTyping
                ? 'primary-gradient shadow-glow scale-105'
                : 'opacity-40 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;

