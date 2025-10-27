import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, DEFAULT_PLANETS } from '@/stores/useAppStore';
import { act } from '@testing-library/react';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setSelectedPlanet, setUserProfile, setCosmicWeather, setLoading } =
      useAppStore.getState();
    act(() => {
      setSelectedPlanet(null);
      setUserProfile(null);
      setCosmicWeather(null);
      setLoading(false);
    });
  });

  it('should initialize with correct default state', () => {
    const state = useAppStore.getState();

    expect(state.selectedPlanet).toBeNull();
    expect(state.userProfile).toBeNull();
    expect(state.cosmicWeather).toBeNull();
    expect(state.isAgentOpen).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should set selected planet', () => {
    const planet = DEFAULT_PLANETS[0];

    act(() => {
      useAppStore.getState().setSelectedPlanet(planet);
    });

    expect(useAppStore.getState().selectedPlanet).toEqual(planet);
  });

  it('should clear selected planet', () => {
    const planet = DEFAULT_PLANETS[0];

    act(() => {
      useAppStore.getState().setSelectedPlanet(planet);
      useAppStore.getState().setSelectedPlanet(null);
    });

    expect(useAppStore.getState().selectedPlanet).toBeNull();
  });

  it('should toggle agent panel', () => {
    expect(useAppStore.getState().isAgentOpen).toBe(false);

    act(() => {
      useAppStore.getState().toggleAgent();
    });

    expect(useAppStore.getState().isAgentOpen).toBe(true);

    act(() => {
      useAppStore.getState().toggleAgent();
    });

    expect(useAppStore.getState().isAgentOpen).toBe(false);
  });

  it('should set loading state', () => {
    act(() => {
      useAppStore.getState().setLoading(true);
    });

    expect(useAppStore.getState().isLoading).toBe(true);

    act(() => {
      useAppStore.getState().setLoading(false);
    });

    expect(useAppStore.getState().isLoading).toBe(false);
  });

  it('should set user profile', () => {
    const profile = {
      name: 'Test User',
      date: '1990-01-01',
      time: '12:00:00',
      timezone: 'UTC',
      latitude: 0,
      longitude: 0,
      location: 'Test Location',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useAppStore.getState().setUserProfile(profile);
    });

    expect(useAppStore.getState().userProfile).toEqual(profile);
  });

  it('should set cosmic weather', () => {
    const weather = {
      currentSign: 'Scorpio',
      moonPhase: 'Waning Gibbous',
      retrograde: ['Mercury'],
      dailyTransit: 'Test transit',
      favorableActivities: ['Research'],
    };

    act(() => {
      useAppStore.getState().setCosmicWeather(weather);
    });

    expect(useAppStore.getState().cosmicWeather).toEqual(weather);
  });
});

describe('DEFAULT_PLANETS', () => {
  it('should export 5 planetary domains', () => {
    expect(DEFAULT_PLANETS).toHaveLength(5);
  });

  it('should have correct planet configuration', () => {
    const mercury = DEFAULT_PLANETS[0];

    expect(mercury.id).toBe('mercury');
    expect(mercury.name).toBe('Mercury');
    expect(mercury.domain).toBe('Communication');
    expect(mercury.tools).toBeInstanceOf(Array);
  });

  it('should have unique planet IDs', () => {
    const ids = DEFAULT_PLANETS.map(p => p.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have tools for each planet', () => {
    DEFAULT_PLANETS.forEach(planet => {
      expect(planet.tools.length).toBeGreaterThan(0);
    });
  });
});
