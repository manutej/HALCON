import OrbitalDashboard from './components/organisms/OrbitalDashboard';
import CosmicWeather from './components/molecules/CosmicWeather';

/**
 * HALCON - Main Application Component
 *
 * The cosmic productivity platform with orbital navigation and astrological insights.
 * Combines real-time ephemeris data with an intuitive orbital UI for workflow optimization.
 */
function App() {
  return (
    <div className="min-h-screen bg-cosmic-bg star-field">
      {/* Cosmic Weather Display */}
      <CosmicWeather />

      {/* Main Orbital Navigation Interface */}
      <main className="flex items-center justify-center min-h-screen p-4">
        <OrbitalDashboard />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-gray-400">
        <p>HALCON v0.1.0 - Navigate Your Productivity Through the Cosmos</p>
      </footer>
    </div>
  );
}

export default App;
