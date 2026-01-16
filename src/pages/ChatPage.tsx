import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ChatMessage from '@/components/ChatMessage';
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
  const [currentBotMood, setCurrentBotMood] = useState<'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking'>('happy');
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Silence handling
  useEffect(() => {
    if (silenceTimer) clearTimeout(silenceTimer);

    const timer = setTimeout(() => {
      if (!isTyping && messages.length > 0) {
        const silenceMessages = [
          "Take your time, I'm here with you.",
          "There's no rush. I'm listening whenever you're ready.",
          "Sometimes silence is okay. I'm here when you want to talk.",
        ];
        const randomMessage = silenceMessages[Math.floor(Math.random() * silenceMessages.length)];
        
        addBotMessage(randomMessage, 'empathetic');
      }
    }, 30000); // 30 seconds of silence

    setSilenceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [messages, isTyping]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const addBotMessage = (text: string, mood: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking' = 'neutral') => {
    setIsTyping(true);
    setCurrentBotMood('speaking');
    setIsBotSpeaking(true);

    // Simulate typing delay
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
      
      // Simulate speaking duration
      setTimeout(() => {
        setIsBotSpeaking(false);
        setCurrentBotMood(mood);
      }, 2000);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): { text: string; mood: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking' } => {
    const lowerMessage = userMessage.toLowerCase();

    // Stress/anxiety detection
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('overwhelmed')) {
      return {
        text: "I hear that you're feeling stressed. That's completely valid, and I'm glad you're sharing this with me. Let's take a moment together. Would you like to try a quick breathing exercise, or would you prefer to talk more about what's causing these feelings?",
        mood: 'empathetic',
      };
    }

    // Sadness detection
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('lonely') || lowerMessage.includes('hopeless')) {
      return {
        text: "I'm sorry you're feeling this way. Your feelings are valid and it takes courage to express them. I'm here with you. Can you tell me more about what's been weighing on you? Sometimes putting feelings into words can help us understand them better.",
        mood: 'empathetic',
      };
    }

    // Positive detection
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('better')) {
      return {
        text: "That's wonderful to hear! 😊 I'm so glad you're feeling positive. What do you think has contributed to this good feeling? Understanding what helps us feel good can be valuable for maintaining our wellbeing.",
        mood: 'happy',
      };
    }

    // Gratitude/thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('helpful')) {
      return {
        text: "You're very welcome! I'm always here for you. Remember, seeking support is a sign of strength, not weakness. Is there anything else on your mind that you'd like to explore?",
        mood: 'happy',
      };
    }

    // Default empathetic response
    const responses = [
      "I appreciate you sharing that with me. Can you tell me more about how that makes you feel?",
      "Thank you for opening up. What thoughts come to mind when you think about this?",
      "I'm listening. How long have you been experiencing this?",
      "That's an important insight. What do you think might help you with this?",
      "I understand. It's okay to feel this way. Would you like to explore some coping strategies together?",
    ];

    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      mood: 'listening',
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setCurrentBotMood('listening');

    // Get and send bot response
    const response = getBotResponse(inputValue);
    setTimeout(() => {
      addBotMessage(response.text, response.mood);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 max-h-[calc(100vh-80px)]">
        {/* Bot Panel - Desktop */}
        <div className="hidden lg:flex lg:w-1/3 flex-col items-center justify-center">
          <Card variant="glass" className="p-8 text-center w-full">
            <div className="relative inline-block">
              <AnimatedBot 
                size="xl" 
                mood={currentBotMood} 
                isSpeaking={isBotSpeaking}
                className="breathe-animation"
              />
              {isBotSpeaking && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mt-6">Dr. Mind</h2>
            <p className="text-muted-foreground mt-2">Your AI Mental Health Companion</p>
            
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant={isSoundOn ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">
                {isBotSpeaking
                  ? '🗣️ Dr. Mind is speaking...'
                  : isTyping
                  ? '✍️ Dr. Mind is typing...'
                  : '👂 Listening...'}
              </p>
            </div>
          </Card>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile bot header */}
            <div className="lg:hidden p-4 border-b border-border flex items-center gap-3">
              <AnimatedBot size="sm" mood={currentBotMood} isSpeaking={isBotSpeaking} />
              <div>
                <h3 className="font-semibold text-foreground">Dr. Mind</h3>
                <p className="text-xs text-muted-foreground">
                  {isBotSpeaking ? 'Speaking...' : isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                  mood={message.mood}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm">Dr. Mind is typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-3">
                <Button
                  variant={isMicOn ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={cn(isMicOn && 'animate-pulse')}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                <Input
                  placeholder="Share what's on your mind..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                
                <Button onClick={handleSend} disabled={!inputValue.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                Your conversations are private and confidential
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
