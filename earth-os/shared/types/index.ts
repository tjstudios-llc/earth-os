/**
 * EarthOS Shared Type Definitions
 * Core types used across all EarthOS services
 */

// Device Types
export interface Device {
  deviceId: string;
  name: string;
  theme: 'dark' | 'neon' | 'light';
  status: 'active' | 'syncing' | 'offline';
  batteryLevel: number;
  wifiConnected: boolean;
  syncIndicator: 'synced' | 'syncing' | 'error';
  createdAt: Date;
  lastSync: Date;
}

// App Package Format
export interface AppManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  permissions: string[];
  author: string;
  protected: boolean;
  requiredVersion: string;
}

export interface EAppPackage {
  manifest: AppManifest;
  entryPoint: string;
  permissions: Permission[];
  size: number;
}

// App Installation
export interface InstalledApp {
  id: string;
  name: string;
  version: string;
  icon: string;
  protected: boolean;
  installedAt: Date;
  size: number;
}

// Permissions
export type Permission = 
  | 'camera'
  | 'storage'
  | 'network'
  | 'location'
  | 'contacts'
  | 'calendar'
  | 'microphone';

// Update Types
export interface UpdatePackage {
  version: string;
  releaseDate: Date;
  changelog: string;
  downloadUrl: string;
  checksum: string;
  size: number;
  type: 'full' | 'delta';
}

export interface UpdateMetadata {
  currentVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
  packages: UpdatePackage[];
}

// Log Events
export type EventType =
  | 'app_opened'
  | 'app_closed'
  | 'app_installed'
  | 'app_updated'
  | 'app_removed'
  | 'app_store_browse'
  | 'chat_message'
  | 'browser_search'
  | 'download_started'
  | 'download_completed'
  | 'system_event'
  | 'error'
  | 'crash'
  | 'sync_started'
  | 'sync_completed'
  | 'iphone_paired';

export interface SystemEvent {
  id: string;
  deviceId: string;
  eventType: EventType;
  timestamp: Date;
  data: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Download Types
export interface Download {
  id: string;
  name: string;
  url: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  size: number;
  downloadedSize: number;
  startTime: Date;
  estimatedTime: number;
}

// System Configuration
export interface SystemConfig {
  deviceId: string;
  deviceName: string;
  theme: 'dark' | 'neon' | 'light';
  osVersion: string;
  buildNumber: string;
  autoSync: boolean;
  autoUpdate: boolean;
  crashReports: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
