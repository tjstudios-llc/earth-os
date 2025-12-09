/**
 * EarthOS Shared Validators
 * Common validation functions used across services
 */

import { AppManifest, Permission } from '../types/index';

export const validators = {
  /**
   * Validate device ID format
   */
  isValidDeviceId(deviceId: string): boolean {
    return /^earth-[a-zA-Z0-9]{16}$/.test(deviceId);
  },

  /**
   * Validate app ID format
   */
  isValidAppId(appId: string): boolean {
    return /^[a-z0-9-]+$/.test(appId) && appId.length > 2 && appId.length <= 64;
  },

  /**
   * Validate app manifest
   */
  isValidManifest(manifest: any): manifest is AppManifest {
    return (
      typeof manifest === 'object' &&
      typeof manifest.id === 'string' &&
      typeof manifest.name === 'string' &&
      typeof manifest.version === 'string' &&
      /^\d+\.\d+\.\d+/.test(manifest.version) &&
      Array.isArray(manifest.permissions) &&
      typeof manifest.protected === 'boolean'
    );
  },

  /**
   * Validate version string (semver)
   */
  isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?(\+[a-zA-Z0-9]+)?$/.test(version);
  },

  /**
   * Validate checksum (SHA256 hex)
   */
  isValidChecksum(checksum: string): boolean {
    return /^[a-f0-9]{64}$/.test(checksum);
  },

  /**
   * Validate theme value
   */
  isValidTheme(theme: string): boolean {
    return ['dark', 'neon', 'light'].includes(theme);
  },

  /**
   * Validate permission
   */
  isValidPermission(permission: string): permission is Permission {
    const validPermissions: Permission[] = [
      'camera',
      'storage',
      'network',
      'location',
      'contacts',
      'calendar',
      'microphone',
    ];
    return validPermissions.includes(permission as Permission);
  },

  /**
   * Validate protected apps that cannot be removed
   */
  isProtectedApp(appId: string): boolean {
    const protectedApps = ['camera', 'appstore', 'browser', 'aichat', 'settings', 'files'];
    return protectedApps.includes(appId);
  },

  /**
   * Validate email
   */
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

export default validators;
