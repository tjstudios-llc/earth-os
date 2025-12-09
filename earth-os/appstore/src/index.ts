/**
 * EarthOS App Store - Local App Repository
 * Hosts .eapp packages and syncs with cloud store
 * Port: 3004
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AppManifest } from '../../shared/types';

const app: Express = express();
const PORT = process.env.PORT || 3004;
const REGISTRY_FILE = path.join(__dirname, '../registry/registry.json');
const APPS_DIR = path.join(__dirname, '../apps');
const CLOUD_API = process.env.CLOUD_API || 'https://earthling.tjstudios.xyz/api/apps';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize
const initialize = async () => {
  try {
    await fs.mkdir(APPS_DIR, { recursive: true });
    await fs.mkdir(path.dirname(REGISTRY_FILE), { recursive: true });

    // Create default registry if not exists
    try {
      await fs.access(REGISTRY_FILE);
    } catch {
      const defaultRegistry = {
        version: '1.0.0',
        apps: [
          {
            id: 'calculator',
            name: 'Calculator',
            version: '1.0.0',
            description: 'Simple calculator app',
            icon: 'calculator.png',
            author: 'EarthOS',
            size: 2097152,
            downloadUrl: '/apps/calculator.eapp',
            downloadCount: 1000,
            rating: 4.5,
            protected: false,
          },
          {
            id: 'notes',
            name: 'Notes',
            version: '1.0.0',
            description: 'Take quick notes',
            icon: 'notes.png',
            author: 'EarthOS',
            size: 3145728,
            downloadUrl: '/apps/notes.eapp',
            downloadCount: 2500,
            rating: 4.8,
            protected: false,
          },
          {
            id: 'weather',
            name: 'Weather',
            version: '1.0.0',
            description: 'Real-time weather updates',
            icon: 'weather.png',
            author: 'EarthOS',
            size: 5242880,
            downloadUrl: '/apps/weather.eapp',
            downloadCount: 5000,
            rating: 4.6,
            protected: false,
          },
        ],
        lastSync: new Date(),
      };
      await fs.writeFile(REGISTRY_FILE, JSON.stringify(defaultRegistry, null, 2));
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

// Load registry
const loadRegistry = async () => {
  try {
    const content = await fs.readFile(REGISTRY_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { version: '1.0.0', apps: [], lastSync: new Date() };
  }
};

// Save registry
const saveRegistry = async (registry: any) => {
  await fs.writeFile(REGISTRY_FILE, JSON.stringify(registry, null, 2));
};

// ============ API ENDPOINTS ============

/**
 * GET /apps
 * List all available apps
 */
app.get('/apps', async (req: Request, res: Response) => {
  try {
    const registry = await loadRegistry();
    res.json({
      success: true,
      data: registry.apps,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('List apps error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /apps/search
 * Search for apps
 */
app.get('/apps/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing search query',
      });
    }

    const registry = await loadRegistry();
    const query = q.toLowerCase();
    const results = registry.apps.filter(
      (app: any) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      data: results,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /apps/:appId
 * Get app details
 */
app.get('/apps/:appId', async (req: Request, res: Response) => {
  try {
    const { appId } = req.params;
    const registry = await loadRegistry();
    const app = registry.apps.find((a: any) => a.id === appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found',
      });
    }

    res.json({
      success: true,
      data: app,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /apps/install
 * Trigger app installation
 */
app.post('/apps/install', async (req: Request, res: Response) => {
  try {
    const { appId, deviceId } = req.body;

    if (!appId || !deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
      });
    }

    const registry = await loadRegistry();
    const app = registry.apps.find((a: any) => a.id === appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found',
      });
    }

    res.json({
      success: true,
      data: {
        installationId: uuidv4(),
        appId,
        downloadUrl: app.downloadUrl,
        status: 'preparing',
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Install error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /sync
 * Sync with cloud app store
 */
app.post('/sync', async (req: Request, res: Response) => {
  try {
    // Attempt to fetch apps from cloud
    try {
      const response = await axios.get(CLOUD_API, { timeout: 5000 });
      const registry = await loadRegistry();
      registry.apps = response.data.apps || registry.apps;
      registry.lastSync = new Date();
      await saveRegistry(registry);

      return res.json({
        success: true,
        data: { synced: true, appCount: registry.apps.length },
        timestamp: new Date(),
      });
    } catch {
      // Cloud unavailable, use local registry
      const registry = await loadRegistry();
      res.json({
        success: true,
        data: { synced: false, usingLocal: true, appCount: registry.apps.length },
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /registry
 * Get full registry
 */
app.get('/registry', async (req: Request, res: Response) => {
  try {
    const registry = await loadRegistry();
    res.json({
      success: true,
      data: registry,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Registry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'earthos-appstore', port: PORT });
});

// Start server
const startServer = async () => {
  try {
    await initialize();
    app.listen(PORT, () => {
      console.log(`🛒 EarthOS App Store listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start app store:', error);
    process.exit(1);
  }
};

startServer();

export default app;
