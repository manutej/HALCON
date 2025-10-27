import React from 'react';
import { PlanetDomain } from '@/types';

interface PlanetInfoProps {
  planet: PlanetDomain;
  onClose: () => void;
}

/**
 * Planet Info Component (Molecular)
 *
 * Displays detailed information about a selected planet domain.
 * Shows description, tools, and provides quick access links.
 */
const PlanetInfo: React.FC<PlanetInfoProps> = ({ planet, onClose }) => {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-80 bg-gray-900 bg-opacity-95 rounded-lg shadow-2xl border border-gray-700 p-6 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: planet.color }}
          >
            {planet.name[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{planet.name}</h3>
            <p className="text-sm text-gray-400">{planet.domain}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close planet info"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-6">{planet.description}</p>

      {/* Tools */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Tools & Resources</h4>
        <div className="space-y-2">
          {planet.tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
            >
              <span className="text-2xl">{tool.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium group-hover:text-cosmic-primary transition-colors">
                  {tool.name}
                </div>
                <div className="text-xs text-gray-400">{tool.category}</div>
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;
