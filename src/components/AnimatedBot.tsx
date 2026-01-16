import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBotProps {
  mood?: 'neutral' | 'happy' | 'empathetic' | 'listening' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isSpeaking?: boolean;
}

const AnimatedBot = ({ 
  mood = 'neutral', 
  size = 'lg', 
  className,
  isSpeaking = false 
}: AnimatedBotProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);

  useEffect(() => {
    // Random blinking
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Subtle head movement
    const headInterval = setInterval(() => {
      setHeadTilt(Math.random() * 6 - 3);
    }, 2000);

    return () => clearInterval(headInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const getMouthPath = () => {
    switch (mood) {
      case 'happy':
        return 'M 35 55 Q 50 65 65 55';
      case 'empathetic':
        return 'M 35 55 Q 50 58 65 55';
      case 'speaking':
        return isSpeaking ? 'M 38 52 Q 50 60 62 52' : 'M 40 55 Q 50 55 60 55';
      default:
        return 'M 38 55 Q 50 58 62 55';
    }
  };

  const getEyebrowPosition = () => {
    switch (mood) {
      case 'empathetic':
        return { left: 'M 28 30 Q 33 27 38 30', right: 'M 62 30 Q 67 27 72 30' };
      case 'listening':
        return { left: 'M 28 28 Q 33 26 38 28', right: 'M 62 28 Q 67 26 72 28' };
      default:
        return { left: 'M 28 28 Q 33 28 38 28', right: 'M 62 28 Q 67 28 72 28' };
    }
  };

  const eyebrows = getEyebrowPosition();

  return (
    <div 
      className={cn(
        sizeClasses[size],
        'relative transition-all duration-500',
        className
      )}
      style={{ transform: `rotate(${headTilt}deg)` }}
    >
      {/* Glow effect behind bot */}
      <div className="absolute inset-0 rounded-full primary-gradient opacity-20 blur-2xl scale-150 breathe-animation" />
      
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full relative z-10"
      >
        {/* Body / Lab Coat */}
        <ellipse
          cx="50"
          cy="105"
          rx="35"
          ry="20"
          className="fill-white stroke-primary/20"
          strokeWidth="1"
        />
        <path
          d="M 25 95 Q 25 85 30 80 L 70 80 Q 75 85 75 95 L 75 115 L 25 115 Z"
          className="fill-white stroke-primary/20"
          strokeWidth="1"
        />
        {/* Coat collar */}
        <path
          d="M 40 80 L 45 90 L 50 85 L 55 90 L 60 80"
          className="fill-none stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Stethoscope */}
        <path
          d="M 45 90 Q 40 100 42 110"
          className="fill-none stroke-highlight"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="42"
          cy="112"
          r="4"
          className="fill-highlight stroke-highlight-foreground/30"
          strokeWidth="1"
        />
        
        {/* Head */}
        <ellipse
          cx="50"
          cy="45"
          rx="32"
          ry="35"
          className="fill-[#fce4d6] stroke-[#e8c4b0]"
          strokeWidth="1.5"
        />
        
        {/* Hair */}
        <path
          d="M 20 40 Q 15 20 35 12 Q 50 8 65 12 Q 85 20 80 40 Q 75 25 50 20 Q 25 25 20 40"
          className="fill-[#3d2314]"
        />
        
        {/* Eyebrows */}
        <path
          d={eyebrows.left}
          className="fill-none stroke-[#3d2314] transition-all duration-300"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={eyebrows.right}
          className="fill-none stroke-[#3d2314] transition-all duration-300"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Eyes */}
        <g className={cn('transition-transform duration-150', isBlinking && 'scale-y-[0.1]')} style={{ transformOrigin: '33px 40px' }}>
          <ellipse
            cx="33"
            cy="40"
            rx="8"
            ry={isBlinking ? 1 : 8}
            className="fill-white stroke-[#ddd]"
            strokeWidth="1"
          />
          <circle
            cx="33"
            cy="40"
            r="4"
            className="fill-[#4a6741]"
          />
          <circle
            cx="33"
            cy="40"
            r="2"
            className="fill-[#1a1a1a]"
          />
          <circle
            cx="31"
            cy="38"
            r="1.5"
            className="fill-white"
          />
        </g>
        
        <g className={cn('transition-transform duration-150', isBlinking && 'scale-y-[0.1]')} style={{ transformOrigin: '67px 40px' }}>
          <ellipse
            cx="67"
            cy="40"
            rx="8"
            ry={isBlinking ? 1 : 8}
            className="fill-white stroke-[#ddd]"
            strokeWidth="1"
          />
          <circle
            cx="67"
            cy="40"
            r="4"
            className="fill-[#4a6741]"
          />
          <circle
            cx="67"
            cy="40"
            r="2"
            className="fill-[#1a1a1a]"
          />
          <circle
            cx="65"
            cy="38"
            r="1.5"
            className="fill-white"
          />
        </g>
        
        {/* Nose */}
        <path
          d="M 50 42 L 48 50 Q 50 52 52 50 L 50 42"
          className="fill-[#e8c4b0] stroke-[#d4a690]"
          strokeWidth="0.5"
        />
        
        {/* Mouth */}
        <path
          d={getMouthPath()}
          className={cn(
            'fill-none stroke-[#c47d6d] transition-all duration-200',
            isSpeaking && 'animate-pulse'
          )}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Ears */}
        <ellipse cx="18" cy="45" rx="5" ry="8" className="fill-[#fce4d6] stroke-[#e8c4b0]" strokeWidth="1" />
        <ellipse cx="82" cy="45" rx="5" ry="8" className="fill-[#fce4d6] stroke-[#e8c4b0]" strokeWidth="1" />
        
        {/* Glasses */}
        <rect x="22" y="32" width="20" height="16" rx="4" className="fill-none stroke-primary" strokeWidth="2" />
        <rect x="58" y="32" width="20" height="16" rx="4" className="fill-none stroke-primary" strokeWidth="2" />
        <path d="M 42 40 L 58 40" className="stroke-primary" strokeWidth="2" />
        <path d="M 22 40 L 13 38" className="stroke-primary" strokeWidth="2" />
        <path d="M 78 40 L 87 38" className="stroke-primary" strokeWidth="2" />
      </svg>
      
      {/* Hand gesture overlay - visible when speaking or empathetic */}
      {(mood === 'speaking' || mood === 'empathetic') && (
        <div className="absolute -right-8 bottom-0 wave-animation">
          <svg viewBox="0 0 40 60" className="w-16 h-24">
            <path
              d="M 20 10 Q 25 5 28 10 L 30 25 Q 32 30 28 32 L 22 32 Q 18 30 18 25 L 18 15 Q 18 10 20 10"
              className="fill-[#fce4d6] stroke-[#e8c4b0]"
              strokeWidth="1"
            />
            {/* Fingers */}
            <path d="M 20 10 L 20 2" className="stroke-[#fce4d6]" strokeWidth="4" strokeLinecap="round" />
            <path d="M 24 8 L 24 0" className="stroke-[#fce4d6]" strokeWidth="4" strokeLinecap="round" />
            <path d="M 28 10 L 29 3" className="stroke-[#fce4d6]" strokeWidth="4" strokeLinecap="round" />
            <path d="M 16 12 L 14 6" className="stroke-[#fce4d6]" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AnimatedBot;
