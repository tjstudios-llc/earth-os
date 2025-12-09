/**
 * EarthOS Shared Types
 * Central exports for all type definitions used across services
 */

// Export from main types file
export * from './index';

// Export .eapp types
export type {
  EAppManifest,
  EAppPackageStructure,
  InstallationHooks,
} from './eapp';

export { EXAMPLE_MANIFEST } from './eapp';
