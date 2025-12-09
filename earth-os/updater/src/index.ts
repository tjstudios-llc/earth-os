/**
 * EarthOS Update Engine
 * Download and apply OS updates with WebSocket notifications
 * Port: 3005
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { validators } from '../../shared/types';

const app: Express = express();
const PORT = process.env.PORT || 3005;
const UPDATES_DIR = path.join(__dirname, '../updates');

// Middleware
app.use(cors());
app.use(express.json());

// In-memory update tracking
const updateSessions: Map<
  string,
  {
    deviceId: string;
    version: string;
    status: 'downloading' | 'verifying' | 'installing' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }
> = new Map();

// Initialize updates directory
const initialize = async () => {
  try {
    await fs.mkdir(UPDATES_DIR, { recursive: true });
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

// ============ API ENDPOINTS ============

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
      });
    }

    // Simulated update check - always offer 1.0.1
    const updates = [
      {
        version: '1.0.1',
        releaseDate: new Date('2025-01-15'),
        changelog: 'Bug fixes and performance improvements',
        downloadUrl: '/updates/download/1.0.1',
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        size: 104857600,
        type: 'delta' as const,
        severity: 'normal' as const,
      },
      {
        version: '1.1.0',
        releaseDate: new Date('2025-02-01'),
        changelog: 'New features: dark mode, improved settings',
        downloadUrl: '/updates/download/1.1.0',
        checksum: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
        size: 157286400,
        type: 'full' as const,
        severity: 'normal' as const,
      },
    ];

    const isUpdateAvailable = currentVersion !== '1.1.0';

    res.json({
      success: true,
      data: {
        currentVersion,
        latestVersion: '1.1.0',
        isUpdateAvailable,
        updates: updates.filter((u) => u.version > (currentVersion as string)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Check updates error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /updates/download/:version
 * Download an update
 */
app.get('/updates/download/:version', async (req: Request, res: Response) => {
  try {
    const { version } = req.params;
    const { deviceId } = req.query;

    if (!version || !deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
      });
    }

    // Validate version
    if (!validators.isValidVersion(version)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid version format',
      });
    }

    // Create download session
    const sessionId = uuidv4();
    updateSessions.set(sessionId, {
      deviceId: deviceId as string,
      version,
      status: 'downloading',
      progress: 0,
    });

    res.json({
      success: true,
      data: {
        sessionId,
        version,
        status: 'downloading',
        progress: 0,
        downloadUrl: `/updates/stream/${version}`,
      },
      timestamp: new Date(),
    });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const session = updateSessions.get(sessionId);
        if (session) {
          session.progress = 100;
          session.status = 'verifying';
        }
      } else {
        const session = updateSessions.get(sessionId);
        if (session) {
          session.progress = progress;
        }
      }
    }, 1000);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /updates/status/:sessionId
 * Get download/installation status
 */
app.get('/updates/status/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = updateSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: session,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /updates/install
 * Install a downloaded update
 */
app.post('/updates/install', async (req: Request, res: Response) => {
  try {
    const { sessionId, version } = req.body;

    if (!sessionId || !version) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
      });
    }

    const session = updateSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Update status to installing
    session.status = 'installing';
    session.progress = 50;

    // Simulate installation
    setTimeout(() => {
      session.progress = 100;
      session.status = 'completed';
    }, 3000);

    res.json({
      success: true,
      data: {
        sessionId,
        status: 'installing',
        version,
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
 * POST /updates/rollback
 * Rollback to previous version
 */
app.post('/updates/rollback', async (req: Request, res: Response) => {
  try {
    const { deviceId, targetVersion } = req.body;

    if (!deviceId || !targetVersion) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
      });
    }

    res.json({
      success: true,
      data: {
        deviceId,
        targetVersion,
        status: 'rolling_back',
      },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Rollback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /updates/cancel
 * Cancel an ongoing update
 */
app.post('/updates/cancel', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing sessionId',
      });
    }

    updateSessions.delete(sessionId);

    res.json({
      success: true,
      data: { cancelled: true, sessionId },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'earthos-updater',
    port: PORT,
    activeSessions: updateSessions.size,
  });
});

// Start server
const startServer = async () => {
  try {
    await initialize();
    app.listen(PORT, () => {
      console.log(`⬆️  EarthOS Update Engine listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start updater:', error);
    process.exit(1);
  }
};

startServer();

export default app;
