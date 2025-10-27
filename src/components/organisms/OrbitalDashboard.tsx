import React, { useState } from 'react';
import { useAppStore, DEFAULT_PLANETS } from '@/stores/useAppStore';
import Planet from '@/components/atoms/Planet';
import PlanetInfo from '@/components/molecules/PlanetInfo';

/**
 * Orbital Dashboard Component (Organism)
 *
 * Main dashboard featuring animated orbital navigation with planets.
 * Planets orbit around a central sun, each representing a productivity domain.
 * Click a planet to view its tools and resources.
 */
const OrbitalDashboard: React.FC = () => {
  const { selectedPlanet, setSelectedPlanet } = useAppStore();
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const handlePlanetClick = (planet: typeof DEFAULT_PLANETS[0]) => {
    setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
  };

  return (
    <div className="relative w-full max-w-4xl aspect-square">
      {/* Central Sun */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 animate-pulse-slow shadow-2xl">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 blur-xl opacity-75" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-sm font-semibold text-center">HALCON</p>
            <p className="text-xs text-gray-400 text-center">Mission Control</p>
          </div>
        </div>
      </div>

      {/* Orbital Rings with Planets */}
      {DEFAULT_PLANETS.map((planet) => {
        const isSelected = selectedPlanet?.id === planet.id;
        const isHovered = hoveredPlanet === planet.id;

        return (
          <div key={planet.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Orbit Ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-700 border-opacity-30"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2}px`,
              }}
              aria-hidden="true"
            />

            {/* Planet Container with Animation */}
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                animation: `orbit ${planet.orbitDuration}s linear infinite`,
                '--radius': `${planet.orbitRadius}px`,
                '--duration': `${planet.orbitDuration}s`,
              } as React.CSSProperties}
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <Planet
                  planet={planet}
                  isSelected={isSelected}
                  onClick={() => handlePlanetClick(planet)}
                />

                {/* Planet Label */}
                {(isHovered || isSelected) && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap animate-in fade-in zoom-in duration-200">
                    <div className="bg-gray-900 bg-opacity-90 px-3 py-1 rounded-lg border border-gray-700">
                      <p className="text-xs font-semibold">{planet.name}</p>
                      <p className="text-xs text-gray-400">{planet.domain}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <PlanetInfo
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {/* Instructions */}
      {!selectedPlanet && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center animate-pulse">
          <p className="text-sm text-gray-400">
            Click a planet to explore its domain
          </p>
        </div>
      )}
    </div>
  );
};

export default OrbitalDashboard;
