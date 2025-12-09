/**
 * Earthling Cloud Server
 * Central backend for EarthOS device management and app distribution
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { Device, SystemEvent, AppManifest } from '../../shared/types';

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory stores (in production, use a database)
const devices = new Map<string, Device>();
const appRegistry: any[] = [];
const logs: SystemEvent[] = [];
const updates: any[] = [
  {
    version: '1.0.0',
    releaseDate: new Date('2024-12-01'),
    changelog: 'Initial release',
    downloadUrl: '/cdn/updates/earthos-1.0.0.eosupdate',
  },
  {
    version: '1.0.1',
    releaseDate: new Date('2025-01-15'),
    changelog: 'Bug fixes and performance improvements',
    downloadUrl: '/cdn/updates/earthos-1.0.1.eosupdate',
  },
];

// ============ API ENDPOINTS ============

/**
 * POST /api/devices/register
 * Register a new device with the cloud
 */
app.post('/api/devices/register', async (req: Request, res: Response) => {
  try {
    const { deviceId, deviceName } = req.body;

    if (!deviceId || !deviceName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const device: Device = {
      deviceId,
      name: deviceName,
      theme: 'dark',
      status: 'active',
      batteryLevel: 100,
      wifiConnected: true,
      syncIndicator: 'synced',
      createdAt: new Date(),
      lastSync: new Date(),
    };

    devices.set(deviceId, device);

    res.status(201).json({
      success: true,
      data: device,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/devices
 * List all registered devices
 */
app.get('/api/devices', async (req: Request, res: Response) => {
  try {
    const deviceList = Array.from(devices.values());
    res.json({
      success: true,
      data: deviceList,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('List devices error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/devices/:deviceId
 * Get device details
 */
app.get('/api/devices/:deviceId', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = devices.get(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    res.json({
      success: true,
      data: device,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/devices/report
 * Send device status report
 */
app.post('/api/devices/report', async (req: Request, res: Response) => {
  try {
    const { deviceId, status, batteryLevel, wifiConnected } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
      });
    }

    const device = devices.get(deviceId);
    if (device) {
      if (status) device.status = status;
      if (batteryLevel !== undefined) device.batteryLevel = batteryLevel;
      if (wifiConnected !== undefined) device.wifiConnected = wifiConnected;
      device.lastSync = new Date();
    }

    res.json({
      success: true,
      data: { updated: true },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/apps
 * List available apps
 */
app.get('/api/apps', async (req: Request, res: Response) => {
  try {
    const apps = [
      {
        id: 'calculator',
        name: 'Calculator',
        version: '1.0.0',
        description: 'Advanced calculator',
        author: 'EarthOS',
        size: 2097152,
        rating: 4.5,
      },
      {
        id: 'notes',
        name: 'Notes',
        version: '1.0.0',
        description: 'Note taking app',
        author: 'EarthOS',
        size: 3145728,
        rating: 4.8,
      },
      {
        id: 'weather',
        name: 'Weather',
        version: '1.0.0',
        description: 'Weather forecast',
        author: 'EarthOS',
        size: 5242880,
        rating: 4.6,
      },
    ];

    res.json({
      success: true,
      data: apps,
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
 * POST /api/apps/upload
 * Upload an app to the store
 */
app.post('/api/apps/upload', async (req: Request, res: Response) => {
  try {
    const { appId, name, version, description } = req.body;

    if (!appId || !name || !version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const app = {
      id: appId,
      name,
      version,
      description: description || '',
      author: 'Developer',
      size: 0,
      rating: 0,
      uploadedAt: new Date(),
    };

    appRegistry.push(app);

    res.status(201).json({
      success: true,
      data: app,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Upload app error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/updates/latest
 * Get latest OS version
 */
app.get('/api/updates/latest', async (req: Request, res: Response) => {
  try {
    const latest = updates[updates.length - 1];
    res.json({
      success: true,
      data: latest,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Get latest error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/updates
 * List all updates
 */
app.get('/api/updates', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: updates,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('List updates error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/updates/publish
 * Publish a new update
 */
app.post('/api/updates/publish', async (req: Request, res: Response) => {
  try {
    const { version, releaseDate, changelog } = req.body;

    if (!version) {
      return res.status(400).json({
        success: false,
        error: 'Missing version',
      });
    }

    const update = {
      version,
      releaseDate: releaseDate || new Date(),
      changelog: changelog || 'No notes',
      downloadUrl: `/cdn/updates/earthos-${version}.eosupdate`,
    };

    updates.push(update);

    res.status(201).json({
      success: true,
      data: update,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Publish update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/logs
 * Receive logs from devices
 */
app.post('/api/logs', async (req: Request, res: Response) => {
  try {
    const log = {
      id: uuidv4(),
      ...req.body,
      receivedAt: new Date(),
    };

    logs.push(log);

    // Keep last 100000 logs
    if (logs.length > 100000) {
      logs.splice(0, logs.length - 100000);
    }

    res.status(201).json({
      success: true,
      data: { logId: log.id },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Log error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/logs
 * Retrieve logs
 */
app.get('/api/logs', async (req: Request, res: Response) => {
  try {
    const { deviceId, limit = 100 } = req.query;

    let filteredLogs = logs;
    if (deviceId) {
      filteredLogs = logs.filter((log) => log.deviceId === deviceId);
    }

    const results = filteredLogs.slice(-parseInt(limit as string));

    res.json({
      success: true,
      data: results,
      total: filteredLogs.length,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Retrieve logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/stats
 * Get system statistics
 */
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = {
      totalDevices: devices.size,
      totalApps: appRegistry.length,
      totalLogs: logs.length,
      activeDevices: Array.from(devices.values()).filter((d) => d.status === 'active').length,
      latestVersion: updates[updates.length - 1]?.version || '1.0.0',
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /dashboard
 * Admin dashboard
 */
app.get('/dashboard', (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Earthling Cloud Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: white; margin-bottom: 30px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card h3 {
          color: #667eea;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .card .value {
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }
        .device-list {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .device-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        .device-item:last-child { border-bottom: none; }
        .device-name { font-weight: bold; }
        .device-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .status.active { background: #90EE90; color: #2d5016; }
        .status.offline { background: #FF6B6B; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌍 Earthling Cloud Dashboard</h1>
        <div class="grid">
          <div class="card">
            <h3>Total Devices</h3>
            <div class="value" id="totalDevices">-</div>
          </div>
          <div class="card">
            <h3>Active Devices</h3>
            <div class="value" id="activeDevices">-</div>
          </div>
          <div class="card">
            <h3>Total Apps</h3>
            <div class="value" id="totalApps">-</div>
          </div>
          <div class="card">
            <h3>Total Logs</h3>
            <div class="value" id="totalLogs">-</div>
          </div>
        </div>

        <div class="device-list">
          <h2 style="margin-bottom: 20px;">Registered Devices</h2>
          <div id="devices"></div>
        </div>
      </div>

      <script>
        async function loadDashboard() {
          // Load stats
          const statsResponse = await fetch('/api/stats');
          const stats = await statsResponse.json();
          
          document.getElementById('totalDevices').textContent = stats.data.totalDevices;
          document.getElementById('activeDevices').textContent = stats.data.activeDevices;
          document.getElementById('totalApps').textContent = stats.data.totalApps;
          document.getElementById('totalLogs').textContent = stats.data.totalLogs;

          // Load devices
          const devicesResponse = await fetch('/api/devices');
          const devices = await devicesResponse.json();

          const container = document.getElementById('devices');
          if (devices.data.length === 0) {
            container.innerHTML = '<p>No devices registered yet</p>';
          } else {
            container.innerHTML = devices.data.map(device => \`
              <div class="device-item">
                <div>
                  <div class="device-name">\${device.name}</div>
                  <div style="font-size: 12px; color: #999;">\${device.deviceId}</div>
                </div>
                <div class="device-status status \${device.status}">\${device.status}</div>
              </div>
            \`).join('');
          }
        }

        loadDashboard();
        setInterval(loadDashboard, 5000);
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'earthling-server',
    port: PORT,
    devices: devices.size,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`☁️  Earthling Cloud Server listening on port ${PORT}`);
  console.log(`   Dashboard: http://localhost:${PORT}/dashboard`);
});

export default app;
