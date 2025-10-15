import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  duration = 1000, 
  suffix = '',
  className = '' 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      
      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={className}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

interface NumberChangeProps {
  value: number;
  previousValue: number;
  suffix?: string;
  className?: string;
}

export function NumberChange({ 
  value, 
  previousValue, 
  suffix = '',
  className = '' 
}: NumberChangeProps) {
  const [showChange, setShowChange] = useState(false);
  const change = value - previousValue;

  useEffect(() => {
    if (change !== 0) {
      setShowChange(true);
      const timer = setTimeout(() => setShowChange(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [change]);

  const changeColor = change > 0 ? 'text-green-400' : 'text-red-400';
  const changeSymbol = change > 0 ? '+' : '';

  return (
    <span className={`relative ${className}`}>
      <AnimatedNumber value={value} suffix={suffix} />
      {showChange && change !== 0 && (
        <span 
          className={`
            absolute left-full ml-2 text-sm font-bold
            animate-in slide-in-from-bottom fade-in duration-300
            ${changeColor}
          `}
        >
          {changeSymbol}{change}{suffix}
        </span>
      )}
    </span>
  );
}
