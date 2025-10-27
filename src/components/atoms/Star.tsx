import React from 'react';

interface StarProps {
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  animated?: boolean;
}

/**
 * Star Component (Atomic)
 *
 * Decorative star element for the cosmic background.
 * Supports different sizes, opacity levels, and optional animation.
 */
const Star: React.FC<StarProps> = ({
  size = 'md',
  opacity = 0.8,
  animated = false
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-white
        ${animated ? 'animate-pulse-slow' : ''}
      `}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export default Star;
