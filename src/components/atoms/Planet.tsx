import React from 'react';
import { PlanetDomain } from '@/types';

interface PlanetProps {
  planet: PlanetDomain;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Planet Component (Atomic)
 *
 * Represents a single planet in the orbital navigation system.
 * Displays planet name, color, and handles selection state.
 */
const Planet: React.FC<PlanetProps> = ({ planet, isSelected, onClick }) => {
  return (
    <button
      className={`
        relative w-12 h-12 rounded-full transition-all duration-300
        flex items-center justify-center text-2xl
        ${isSelected ? 'scale-125 shadow-lg' : 'scale-100 hover:scale-110'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cosmic-bg
      `}
      style={{
        backgroundColor: planet.color,
        boxShadow: isSelected
          ? `0 0 20px ${planet.color}, 0 0 40px ${planet.color}`
          : `0 0 10px ${planet.color}`,
      }}
      onClick={onClick}
      aria-label={`${planet.name} - ${planet.domain}`}
      aria-pressed={isSelected}
    >
      <span className="filter drop-shadow-lg">
        {planet.name[0]}
      </span>
    </button>
  );
};

export default Planet;
