import { useState } from 'react';

const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || 'http://localhost:3001/assets';

interface CharacterAvatarProps {
  headVariant: string;
  armsVariant: string;
  legsVariant: string;
  feetVariant: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export function CharacterAvatar({
  headVariant,
  armsVariant,
  legsVariant,
  feetVariant,
  size = 'md',
  className = '',
  showBorder = true
}: CharacterAvatarProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (part: string, variant: string) => {
    const key = `${part}-${variant}`;
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const getImageUrl = (part: string, variant: string) => {
    return `${ASSETS_BASE_URL}/characters/${part}/${variant}.png`;
  };

  const hasImageError = (part: string, variant: string) => {
    const key = `${part}-${variant}`;
    return imageErrors[key] === true;
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const emojiSizes = {
    sm: 'text-3xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl'
  };

  const containerSize = sizeClasses[size];
  const emojiSize = emojiSizes[size];

  return (
    <div
      className={`relative ${containerSize} bg-gradient-to-br from-primary-dark to-primary-medium rounded-lg overflow-hidden ${showBorder ? 'border-2 border-primary-light' : ''} shadow-xl ${className}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Character layers (stacked from back to front) */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        {/* Feet (bottom layer) */}
        {!hasImageError('feet', feetVariant) ? (
          <img
            src={getImageUrl('feet', feetVariant)}
            alt="Feet"
            className="absolute w-full h-full object-contain"
            onError={() => handleImageError('feet', feetVariant)}
          />
        ) : (
          <div className={`absolute bottom-0 ${emojiSize}`}>👢</div>
        )}

        {/* Legs */}
        {!hasImageError('legs', legsVariant) ? (
          <img
            src={getImageUrl('legs', legsVariant)}
            alt="Legs"
            className="absolute w-full h-full object-contain"
            onError={() => handleImageError('legs', legsVariant)}
          />
        ) : (
          <div className={`absolute bottom-2 ${emojiSize}`}>🦵</div>
        )}

        {/* Arms */}
        {!hasImageError('arms', armsVariant) ? (
          <img
            src={getImageUrl('arms', armsVariant)}
            alt="Arms"
            className="absolute w-full h-full object-contain"
            onError={() => handleImageError('arms', armsVariant)}
          />
        ) : (
          <div className={`absolute ${emojiSize}`}>💪</div>
        )}

        {/* Head (top layer) */}
        {!hasImageError('head', headVariant) ? (
          <img
            src={getImageUrl('head', headVariant)}
            alt="Head"
            className="absolute w-full h-full object-contain"
            onError={() => handleImageError('head', headVariant)}
          />
        ) : (
          <div className={`absolute top-0 ${emojiSize}`}>🎮</div>
        )}
      </div>
    </div>
  );
}
