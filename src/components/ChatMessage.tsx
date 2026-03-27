import { cn } from '@/lib/utils';
import AnimatedBot from './AnimatedBot';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
  hideAvatar?: boolean;
}

/** Animated three-dot typing indicator — shown while bot is composing a reply */
export const TypingIndicator = () => (
  <div className="flex gap-2 items-end px-2">
    {/* Bot avatar aligned to bottom */}
    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
      <AnimatedBot size="sm" mood="listening" className="w-7 h-7" />
    </div>

    {/* Dots bubble */}
    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '900ms' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
        style={{ animationDelay: '150ms', animationDuration: '900ms' }}
      />
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
        style={{ animationDelay: '300ms', animationDuration: '900ms' }}
      />
    </div>
  </div>
);

const ChatMessage = ({ message, isBot, timestamp, mood = 'neutral', hideAvatar = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        'flex gap-2 items-end px-2',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Avatar — hidden for consecutive same-sender messages, but keeps spacing */}
      {isBot ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center self-end mb-0.5">
          {!hideAvatar && <AnimatedBot size="sm" mood={mood} className="w-7 h-7" />}
        </div>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/80 border border-border flex items-center justify-center self-end mb-0.5">
          {!hideAvatar && <span className="text-sm">👤</span>}
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[68%] px-4 py-2.5 shadow-sm',
          isBot
            ? 'bg-card border border-border rounded-2xl rounded-bl-sm'
            : 'primary-gradient text-primary-foreground rounded-2xl rounded-br-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message}</p>
        {timestamp && (
          <span
            className={cn(
              'text-[11px] mt-1 block',
              isBot ? 'text-muted-foreground' : 'text-primary-foreground/70'
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

