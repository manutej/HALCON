/**
 * Profile Manager
 * Manages user birth data profiles stored in ~/.halcon/profiles.json
 *
 * @module lib/profiles
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface UserProfile {
  name: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM:SS
  latitude: number;
  longitude: number;
  location: string;    // City, Country
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}

export class ProfileManager {
  private profilesPath: string;
  private profilesDir: string;

  constructor() {
    this.profilesDir = path.join(os.homedir(), '.halcon');
    this.profilesPath = path.join(this.profilesDir, 'profiles.json');
    this.ensureProfilesDirectory();
  }

  private ensureProfilesDirectory(): void {
    if (!fs.existsSync(this.profilesDir)) {
      fs.mkdirSync(this.profilesDir, { recursive: true });
    }
  }

  private loadProfiles(): { [name: string]: UserProfile } {
    if (!fs.existsSync(this.profilesPath)) {
      return {};
    }

    try {
      const data = fs.readFileSync(this.profilesPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
      return {};
    }
  }

  private saveProfiles(profiles: { [name: string]: UserProfile }): void {
    try {
      fs.writeFileSync(this.profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving profiles:', error);
      throw new Error('Failed to save profile');
    }
  }

  /**
   * Save or update a profile
   */
  saveProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): void {
    const profiles = this.loadProfiles();
    const now = new Date().toISOString();

    const existingProfile = profiles[profile.name.toLowerCase()];

    profiles[profile.name.toLowerCase()] = {
      ...profile,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now
    };

    this.saveProfiles(profiles);
  }

  /**
   * Get a profile by name
   */
  getProfile(name: string): UserProfile | null {
    const profiles = this.loadProfiles();
    return profiles[name.toLowerCase()] || null;
  }

  /**
   * List all profiles
   */
  listProfiles(): UserProfile[] {
    const profiles = this.loadProfiles();
    return Object.values(profiles);
  }

  /**
   * Delete a profile
   */
  deleteProfile(name: string): boolean {
    const profiles = this.loadProfiles();
    const normalizedName = name.toLowerCase();

    if (!profiles[normalizedName]) {
      return false;
    }

    delete profiles[normalizedName];
    this.saveProfiles(profiles);
    return true;
  }

  /**
   * Check if a profile exists
   */
  profileExists(name: string): boolean {
    const profiles = this.loadProfiles();
    return !!profiles[name.toLowerCase()];
  }
}

/**
 * Get the shared profile manager instance
 */
export function getProfileManager(): ProfileManager {
  return new ProfileManager();
}
