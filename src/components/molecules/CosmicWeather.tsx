import React from 'react';
import { useAppStore } from '@/stores/useAppStore';

/**
 * Cosmic Weather Component (Molecular)
 *
 * Displays current astrological conditions at the top of the interface.
 * Shows moon phase, current sign, retrograde planets, and daily transit.
 */
const CosmicWeather: React.FC = () => {
  const cosmicWeather = useAppStore((state) => state.cosmicWeather);

  // Mock data for initial display
  const weather = cosmicWeather || {
    currentSign: 'Scorpio ♏',
    moonPhase: 'Waning Gibbous 🌖',
    retrograde: [],
    dailyTransit: 'Focus on transformation and deep work',
    favorableActivities: ['Research', 'Planning', 'Strategic thinking'],
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-cosmic-bg to-transparent">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Moon Phase */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weather.moonPhase.split(' ')[1]}</span>
            <div>
              <div className="text-xs text-gray-400">Moon Phase</div>
              <div className="text-sm font-semibold">{weather.moonPhase.split(' ')[0]}</div>
            </div>
          </div>

          {/* Current Sign */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weather.currentSign.split(' ')[1]}</span>
            <div>
              <div className="text-xs text-gray-400">Sun in</div>
              <div className="text-sm font-semibold">{weather.currentSign.split(' ')[0]}</div>
            </div>
          </div>

          {/* Daily Transit */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="text-xs text-gray-400">Cosmic Weather</div>
            <div className="text-sm">{weather.dailyTransit}</div>
          </div>

          {/* Retrograde Planets */}
          {weather.retrograde.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xl">♇</span>
              <div>
                <div className="text-xs text-gray-400">Retrograde</div>
                <div className="text-sm font-semibold">{weather.retrograde.join(', ')}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CosmicWeather;
