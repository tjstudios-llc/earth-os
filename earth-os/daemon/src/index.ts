/**
 * EarthOS Daemon - Core Backend Service
 * Manages device registration, app installation, updates, and system configuration
 * Port: 3002
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { cryptoUtils } from '../../shared/utils/crypto';
import { validators } from '../../shared/utils/validators';
import { Device, InstalledApp, SystemConfig, ApiResponse } from '../../shared/types';

const app: Express = express();
const PORT = process.env.PORT || 3002;
const SYSTEM_DIR = path.join(__dirname, '../system');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize system directories
const initializeSystem = async () => {
  try {
    await fs.mkdir(SYSTEM_DIR, { recursive: true });
    await fs.mkdir(path.join(SYSTEM_DIR, 'devices'), { recursive: true });
    await fs.mkdir(path.join(SYSTEM_DIR, 'apps'), { recursive: true });
  } catch (error) {
    console.error('Failed to initialize system:', error);
  }
};

// Utility: Load system.json for a device
const loadSystemConfig = async (deviceId: string): Promise<SystemConfig | null> => {
  try {
    const filePath = path.join(SYSTEM_DIR, 'devices', `${deviceId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Utility: Save system.json for a device
const saveSystemConfig = async (deviceId: string, config: SystemConfig): Promise<void> => {
  const filePath = path.join(SYSTEM_DIR, 'devices', `${deviceId}.json`);
  await fs.writeFile(filePath, JSON.stringify(config, null, 2));
};

// Utility: Load installed apps
const loadInstalledApps = async (deviceId: string): Promise<InstalledApp[]> => {
  try {
    const filePath = path.join(SYSTEM_DIR, 'apps', `${deviceId}-apps.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Utility: Save installed apps
const saveInstalledApps = async (
  deviceId: string,
  apps: InstalledApp[]
): Promise<void> => {
  const filePath = path.join(SYSTEM_DIR, 'apps', `${deviceId}-apps.json`);
  await fs.writeFile(filePath, JSON.stringify(apps, null, 2));
};

// ============ API ENDPOINTS ============

/**
 * POST /register-device
 * Register a new device with EarthOS
 */
app.post('/register-device', async (req: Request, res: Response) => {
  try {
    const { deviceName } = req.body;

    if (!deviceName || typeof deviceName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid device name',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const deviceId = cryptoUtils.generateDeviceId();
    const config: SystemConfig = {
      deviceId,
      deviceName,
      theme: 'dark',
      osVersion: '1.0.0',
      buildNumber: '1',
      autoSync: true,
      autoUpdate: true,
      crashReports: true,
    };

    await saveSystemConfig(deviceId, config);

    // Initialize with protected apps
    const protectedApps: InstalledApp[] = [
      {
        id: 'camera',
        name: 'Camera',
        version: '1.0.0',
        icon: 'camera.png',
        protected: true,
        installedAt: new Date(),
        size: 5242880,
      },
      {
        id: 'appstore',
        name: 'App Store',
        version: '1.0.0',
        icon: 'appstore.png',
        protected: true,
        installedAt: new Date(),
        size: 10485760,
      },
      {
        id: 'browser',
        name: 'Browser',
        version: '1.0.0',
        icon: 'browser.png',
        protected: true,
        installedAt: new Date(),
        size: 8388608,
      },
      {
        id: 'aichat',
        name: 'AI Chat',
        version: '1.0.0',
        icon: 'aichat.png',
        protected: true,
        installedAt: new Date(),
        size: 12582912,
      },
      {
        id: 'settings',
        name: 'Settings',
        version: '1.0.0',
        icon: 'settings.png',
        protected: true,
        installedAt: new Date(),
        size: 4194304,
      },
      {
        id: 'files',
        name: 'Files',
        version: '1.0.0',
        icon: 'files.png',
        protected: true,
        installedAt: new Date(),
        size: 3145728,
      },
    ];

    await saveInstalledApps(deviceId, protectedApps);

    res.status(201).json({
      success: true,
      data: { deviceId, config },
      timestamp: new Date(),
    } as ApiResponse<{ deviceId: string; config: SystemConfig }>);
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * GET /system/device-id
 * Get the device ID
 */
app.get('/system/device-id', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    if (!deviceId || typeof deviceId !== 'string' || !validators.isValidDeviceId(deviceId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid device ID',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const config = await loadSystemConfig(deviceId);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    res.json({
      success: true,
      data: { deviceId: config.deviceId },
      timestamp: new Date(),
    } as ApiResponse<{ deviceId: string }>);
  } catch (error) {
    console.error('Get device-id error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * GET /system/config
 * Get system configuration
 */
app.get('/system/config', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid device ID',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const config = await loadSystemConfig(deviceId as string);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    res.json({
      success: true,
      data: config,
      timestamp: new Date(),
    } as ApiResponse<SystemConfig>);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * POST /system/config
 * Update system configuration
 */
app.post('/system/config', async (req: Request, res: Response) => {
  try {
    const { deviceId, theme, deviceName, autoSync, autoUpdate } = req.body;

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid device ID',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const config = await loadSystemConfig(deviceId);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    // Update fields
    if (theme && validators.isValidTheme(theme)) config.theme = theme;
    if (deviceName && typeof deviceName === 'string') config.deviceName = deviceName;
    if (typeof autoSync === 'boolean') config.autoSync = autoSync;
    if (typeof autoUpdate === 'boolean') config.autoUpdate = autoUpdate;

    await saveSystemConfig(deviceId, config);

    res.json({
      success: true,
      data: config,
      timestamp: new Date(),
    } as ApiResponse<SystemConfig>);
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * GET /apps/list
 * List installed apps
 */
app.get('/apps/list', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid device ID',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const apps = await loadInstalledApps(deviceId);

    res.json({
      success: true,
      data: apps,
      timestamp: new Date(),
    } as ApiResponse<InstalledApp[]>);
  } catch (error) {
    console.error('List apps error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * POST /apps/install
 * Install an app
 */
app.post('/apps/install', async (req: Request, res: Response) => {
  try {
    const { deviceId, appId, name, version, icon, size } = req.body;

    if (!deviceId || !appId || !name || !version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const apps = await loadInstalledApps(deviceId);
    const existingApp = apps.find((a) => a.id === appId);

    if (existingApp) {
      return res.status(409).json({
        success: false,
        error: 'App already installed',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const newApp: InstalledApp = {
      id: appId,
      name,
      version,
      icon: icon || 'default.png',
      protected: validators.isProtectedApp(appId),
      installedAt: new Date(),
      size: size || 0,
    };

    apps.push(newApp);
    await saveInstalledApps(deviceId, apps);

    res.status(201).json({
      success: true,
      data: newApp,
      timestamp: new Date(),
    } as ApiResponse<InstalledApp>);
  } catch (error) {
    console.error('Install app error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * DELETE /apps/remove
 * Remove an app (protected apps cannot be removed)
 */
app.delete('/apps/remove', async (req: Request, res: Response) => {
  try {
    const { deviceId, appId } = req.query;

    if (!deviceId || !appId || typeof appId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    // Check if app is protected
    if (validators.isProtectedApp(appId)) {
      return res.status(403).json({
        success: false,
        error: 'Cannot remove protected app',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const apps = await loadInstalledApps(deviceId as string);
    const appIndex = apps.findIndex((a) => a.id === appId);

    if (appIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'App not found',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const removedApp = apps.splice(appIndex, 1)[0];
    await saveInstalledApps(deviceId as string, apps);

    res.json({
      success: true,
      data: removedApp,
      timestamp: new Date(),
    } as ApiResponse<InstalledApp>);
  } catch (error) {
    console.error('Remove app error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * GET /updates/check
 * Check for available updates
 */
app.get('/updates/check', async (req: Request, res: Response) => {
  try {
    const { deviceId, currentVersion } = req.query;

    if (!deviceId || !currentVersion) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    // Simulated update check
    const isUpdateAvailable = currentVersion !== '1.0.1';

    res.json({
      success: true,
      data: {
        currentVersion,
        latestVersion: '1.0.1',
        isUpdateAvailable,
        packages: isUpdateAvailable
          ? [
              {
                version: '1.0.1',
                releaseDate: new Date(),
                changelog: 'Bug fixes and improvements',
                downloadUrl: 'http://localhost:3005/updates/1.0.1.eosupdate',
                checksum: 'abc123def456',
                size: 104857600,
                type: 'delta' as const,
              },
            ]
          : [],
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Check updates error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * POST /updates/stage
 * Stage an update for installation
 */
app.post('/updates/stage', async (req: Request, res: Response) => {
  try {
    const { deviceId, updateFile, checksum } = req.body;

    if (!deviceId || !updateFile || !checksum) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    // Validate checksum
    if (!validators.isValidChecksum(checksum)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid checksum format',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    res.json({
      success: true,
      data: { staged: true, updateFile },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Stage update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * POST /updates/apply
 * Apply a staged update
 */
app.post('/updates/apply', async (req: Request, res: Response) => {
  try {
    const { deviceId, version } = req.body;

    if (!deviceId || !version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const config = await loadSystemConfig(deviceId);
    if (config) {
      config.osVersion = version;
      await saveSystemConfig(deviceId, config);
    }

    res.json({
      success: true,
      data: { updated: true, newVersion: version },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Apply update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * POST /downloads/start
 * Start a file download
 */
app.post('/downloads/start', async (req: Request, res: Response) => {
  try {
    const { deviceId, url, name } = req.body;

    if (!deviceId || !url || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const downloadId = uuidv4();

    res.status(201).json({
      success: true,
      data: {
        downloadId,
        status: 'pending',
        progress: 0,
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Start download error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

/**
 * GET /downloads/status
 * Get download status
 */
app.get('/downloads/status', async (req: Request, res: Response) => {
  try {
    const { downloadId } = req.query;

    if (!downloadId) {
      return res.status(400).json({
        success: false,
        error: 'Missing downloadId',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    res.json({
      success: true,
      data: {
        downloadId,
        status: 'downloading',
        progress: 45,
        downloadedSize: 47185920,
        totalSize: 104857600,
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Download status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'earthos-daemon', port: PORT });
});

// Start server
const startServer = async () => {
  try {
    await initializeSystem();
    app.listen(PORT, () => {
      console.log(`✨ EarthOS Daemon listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start daemon:', error);
    process.exit(1);
  }
};

startServer();

export default app;
