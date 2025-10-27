/**
 * HALCON Type Definitions
 *
 * Core types for the cosmic productivity platform
 */

/**
 * Celestial body data from Swiss Ephemeris
 */
export interface CelestialBody {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  sign: string;
  degree: number;
  retrograde: boolean;
}

/**
 * Planetary domain for productivity
 */
export interface PlanetDomain {
  id: string;
  name: string;
  domain: string;
  color: string;
  description: string;
  orbitRadius: number;
  orbitDuration: number;
  tools: ProductivityTool[];
}

/**
 * Productivity tool configuration
 */
export interface ProductivityTool {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: string;
}

/**
 * User profile with birth data
 */
export interface UserProfile {
  name: string;
  date: string;
  time: string;
  timezone: string;
  utcOffset?: string;
  latitude: number;
  longitude: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cosmic weather data
 */
export interface CosmicWeather {
  currentSign: string;
  moonPhase: string;
  retrograde: string[];
  dailyTransit: string;
  favorableActivities: string[];
}

/**
 * Application state
 */
export interface AppState {
  selectedPlanet: PlanetDomain | null;
  userProfile: UserProfile | null;
  cosmicWeather: CosmicWeather | null;
  isAgentOpen: boolean;
  isLoading: boolean;
}

/**
 * Application actions
 */
export interface AppActions {
  setSelectedPlanet: (planet: PlanetDomain | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setCosmicWeather: (weather: CosmicWeather | null) => void;
  toggleAgent: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Chart data from Swiss Ephemeris
 */
export interface ChartData {
  bodies: Record<string, CelestialBody>;
  houses: {
    system: string;
    cusps: number[];
  };
  angles: {
    ascendant: number;
    midheaven: number;
    descendant: number;
    imumCoeli: number;
  };
}
