import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import AnimatedBot from '@/components/AnimatedBot';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm Dr. Mind, your AI mental health companion. I'm here to listen without judgment. How are you feeling today?",
    isBot: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mood: 'happy',
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentBotMood, setCurrentBotMood] = useState<'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking'>('happy');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  const getToken = () => localStorage.getItem('token');

  const speakText = (text: string) => {
    if (!isSoundOn || !synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => { setIsBotSpeaking(true); setCurrentBotMood('speaking'); };
    utterance.onend = () => { setIsBotSpeaking(false); setCurrentBotMood('neutral'); };
    synthRef.current.speak(utterance);
  };

  const addBotMessage = async (userMessage: string) => {
    setIsTyping(true);
    setCurrentBotMood('listening');

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/chat/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      const typingDelay = Math.min(800 + (data.reply?.length || 50) * 15, 2500);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: Date.now().toString(),
          text: data.success ? data.reply : "I'm here to listen. Can you tell me more?",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: data.mood || 'neutral',
        };
        setMessages(prev => [...prev, botMsg]);
        setCurrentBotMood(data.mood || 'neutral');
        if (isSoundOn) speakText(botMsg.text);
      }, typingDelay);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: Date.now().toString(),
          text: "I'm here for you. Sometimes connection gets tricky, but I'm listening. What's on your mind?",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: 'empathetic',
        };
        setMessages(prev => [...prev, botMsg]);
        if (isSoundOn) speakText(botMsg.text);
      }, 1000);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    const msgText = inputValue;
    setInputValue('');
    await addBotMessage(msgText);
  };

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Try Chrome!');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsMicOn(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setIsMicOn(true); setCurrentBotMood('listening'); };
    recognition.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
      setInputValue(t);
    };
    recognition.onend = () => {
      setIsListening(false);
      setIsMicOn(false);
      setTranscript('');
      setCurrentBotMood('neutral');
    };
    recognition.onerror = () => { setIsListening(false); setIsMicOn(false); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSoundToggle = () => {
    if (isSoundOn && synthRef.current) synthRef.current.cancel();
    setIsSoundOn(!isSoundOn);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="user" onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-4 flex gap-4 max-w-6xl">

        {/* Bot Panel */}
        <div className="hidden lg:flex flex-col items-center w-64 shrink-0">
          <div className="sticky top-4 flex flex-col items-center gap-4">
            <AnimatedBot size="lg" mood={currentBotMood} className={isBotSpeaking ? 'animate-pulse' : ''} />
            <div className="text-center">
              <p className="font-medium text-foreground">Dr. Mind</p>
              <p className="text-sm text-muted-foreground">
                {isListening ? '🎤 Listening...' : isTyping ? '💭 Thinking...' : isBotSpeaking ? '🔊 Speaking...' : '✨ Here for you'}
              </p>
            </div>
            {isListening && (
              <div className="w-full bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-xs text-primary font-medium animate-pulse">🎤 Listening...</p>
                {transcript && <p className="text-xs text-muted-foreground mt-1 italic">"{transcript}"</p>}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant={isMicOn ? 'default' : 'outline'} size="sm" onClick={handleMicToggle} className={isMicOn ? 'bg-primary' : ''}>
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button variant={isSoundOn ? 'default' : 'outline'} size="sm" onClick={handleSoundToggle}>
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-white/50 rounded-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <AnimatedBot size="sm" mood={currentBotMood} />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Dr. Mind</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  {isListening ? 'Listening to you...' : isTyping ? 'Thinking...' : 'Online & here for you'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 lg:hidden">
              <Button variant={isMicOn ? 'default' : 'outline'} size="sm" onClick={handleMicToggle}>
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button variant={isSoundOn ? 'default' : 'outline'} size="sm" onClick={handleSoundToggle}>
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <span className="text-xs">🧠</span>
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.isBot ? '' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.isBot
                      ? 'bg-white border border-border/50 text-foreground rounded-tl-sm shadow-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${msg.isBot ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                  <span className="text-xs">🧠</span>
                </div>
                <div className="bg-white border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            {isListening && (
              <div className="mb-2 p-2 bg-primary/5 rounded-lg border border-primary/20 text-center">
                <p className="text-xs text-primary animate-pulse">🎤 Listening... speak now</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant={isListening ? 'default' : 'outline'}
                size="icon"
                onClick={handleMicToggle}
                className={isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={isListening ? 'Listening...' : 'Share what\'s on your mind...'}
                className="flex-1 h-11"
                disabled={isListening}
              />
              <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} size="icon" className="h-11 w-11">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Dr. Mind is an AI companion. For emergencies, call iCall: 9152987821
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
