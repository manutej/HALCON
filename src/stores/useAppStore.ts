import { create } from 'zustand';
import { AppState, AppActions, PlanetDomain } from '@/types';

/**
 * Default planetary domains configuration
 */
const DEFAULT_PLANETS: PlanetDomain[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    domain: 'Communication',
    color: '#fbbf24',
    description: 'Messaging, meetings, and information flow',
    orbitRadius: 80,
    orbitDuration: 12,
    tools: [
      { id: 'slack', name: 'Slack', icon: '💬', url: 'https://slack.com', category: 'messaging' },
      { id: 'email', name: 'Email', icon: '📧', url: 'mailto:', category: 'email' },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    domain: 'Creativity',
    color: '#ec4899',
    description: 'Design tools and creative workflows',
    orbitRadius: 120,
    orbitDuration: 18,
    tools: [
      { id: 'figma', name: 'Figma', icon: '🎨', url: 'https://figma.com', category: 'design' },
      { id: 'canva', name: 'Canva', icon: '✨', url: 'https://canva.com', category: 'design' },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    domain: 'Execution',
    color: '#ef4444',
    description: 'Task completion and project management',
    orbitRadius: 160,
    orbitDuration: 24,
    tools: [
      { id: 'linear', name: 'Linear', icon: '🎯', url: 'https://linear.app', category: 'pm' },
      { id: 'github', name: 'GitHub', icon: '💻', url: 'https://github.com', category: 'dev' },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    domain: 'Knowledge',
    color: '#8b5cf6',
    description: 'Learning, research, and documentation',
    orbitRadius: 200,
    orbitDuration: 30,
    tools: [
      { id: 'notion', name: 'Notion', icon: '📚', url: 'https://notion.so', category: 'docs' },
      { id: 'obsidian', name: 'Obsidian', icon: '🧠', url: 'https://obsidian.md', category: 'notes' },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    domain: 'Structure',
    color: '#6366f1',
    description: 'Systems, processes, and monitoring',
    orbitRadius: 240,
    orbitDuration: 36,
    tools: [
      { id: 'analytics', name: 'Analytics', icon: '📊', url: 'https://analytics.google.com', category: 'analytics' },
      { id: 'monitoring', name: 'Monitoring', icon: '🔍', url: '#', category: 'monitoring' },
    ],
  },
];

/**
 * HALCON Application Store
 *
 * Zustand store for managing global application state including:
 * - Selected planet/domain
 * - User profile data
 * - Cosmic weather information
 * - UI state (agent panel, loading, etc.)
 */
export const useAppStore = create<AppState & AppActions>((set) => ({
  // State
  selectedPlanet: null,
  userProfile: null,
  cosmicWeather: null,
  isAgentOpen: false,
  isLoading: false,

  // Actions
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setCosmicWeather: (weather) => set({ cosmicWeather: weather }),
  toggleAgent: () => set((state) => ({ isAgentOpen: !state.isAgentOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

/**
 * Export planetary domains configuration
 */
export { DEFAULT_PLANETS };
