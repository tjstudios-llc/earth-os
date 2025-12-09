/**
 * EarthOS Simulator / DevTools
 * Spawn virtual devices for development and testing
 * Port: 3006
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { cryptoUtils } from '../../shared/utils/crypto';

const app: Express = express();
const PORT = process.env.PORT || 3006;
const DEVICES_DIR = path.join(__dirname, '../devices');

// In-memory device simulation
interface VirtualDevice {
  deviceId: string;
  name: string;
  status: 'running' | 'stopped' | 'suspended';
  startTime: Date;
  uptime: number; // seconds
  cpu: number; // 0-100
  memory: number; // 0-100
  logs: string[];
  theme: 'dark' | 'neon' | 'light';
}

const devices: Map<string, VirtualDevice> = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize
const initialize = async () => {
  try {
    await fs.mkdir(DEVICES_DIR, { recursive: true });
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

// Utility: Create a simulated device
const createVirtualDevice = (name: string): VirtualDevice => {
  const deviceId = cryptoUtils.generateDeviceId();
  return {
    deviceId,
    name,
    status: 'running',
    startTime: new Date(),
    uptime: 0,
    cpu: Math.random() * 30,
    memory: Math.random() * 50 + 20,
    logs: [],
    theme: 'dark',
  };
};

// ============ API ENDPOINTS ============

/**
 * POST /devices/spawn
 * Spawn a new virtual device
 */
app.post('/devices/spawn', async (req: Request, res: Response) => {
  try {
    const { name = 'Virtual Device' } = req.body;

    const device = createVirtualDevice(name);
    devices.set(device.deviceId, device);

    // Save device state
    const devicePath = path.join(DEVICES_DIR, `${device.deviceId}.json`);
    await fs.writeFile(devicePath, JSON.stringify(device, null, 2));

    res.status(201).json({
      success: true,
      data: device,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Spawn error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /devices
 * List all virtual devices
 */
app.get('/devices', async (req: Request, res: Response) => {
  try {
    const deviceList = Array.from(devices.values()).map((device) => ({
      ...device,
      uptime: Math.floor((Date.now() - device.startTime.getTime()) / 1000),
      cpu: Math.random() * 50,
      memory: Math.random() * 70,
    }));

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
 * GET /devices/:deviceId
 * Get device details
 */
app.get('/devices/:deviceId', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = devices.get(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    const updatedDevice = {
      ...device,
      uptime: Math.floor((Date.now() - device.startTime.getTime()) / 1000),
    };

    res.json({
      success: true,
      data: updatedDevice,
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
 * POST /devices/:deviceId/stop
 * Stop a virtual device
 */
app.post('/devices/:deviceId/stop', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = devices.get(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    device.status = 'stopped';
    device.uptime = Math.floor((Date.now() - device.startTime.getTime()) / 1000);

    res.json({
      success: true,
      data: device,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Stop device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /devices/:deviceId/start
 * Start a virtual device
 */
app.post('/devices/:deviceId/start', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = devices.get(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    device.status = 'running';
    device.startTime = new Date();
    device.uptime = 0;

    res.json({
      success: true,
      data: device,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Start device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * DELETE /devices/:deviceId
 * Delete a virtual device
 */
app.delete('/devices/:deviceId', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;

    if (!devices.has(deviceId)) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    devices.delete(deviceId);

    // Delete device file
    const devicePath = path.join(DEVICES_DIR, `${deviceId}.json`);
    try {
      await fs.unlink(devicePath);
    } catch {}

    res.json({
      success: true,
      data: { deleted: true, deviceId },
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /devices/:deviceId/logs
 * Add a log entry to a device
 */
app.post('/devices/:deviceId/logs', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing message',
      });
    }

    const device = devices.get(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }

    const logEntry = `[${new Date().toISOString()}] ${message}`;
    device.logs.push(logEntry);

    // Keep only last 1000 logs
    if (device.logs.length > 1000) {
      device.logs = device.logs.slice(-1000);
    }

    res.status(201).json({
      success: true,
      data: { logged: true },
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
 * GET /devices/:deviceId/logs
 * Get device logs
 */
app.get('/devices/:deviceId/logs', async (req: Request, res: Response) => {
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
      data: device.logs,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /dashboard
 * Dashboard HTML
 */
app.get('/dashboard', (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>EarthOS Simulator Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0e27;
          color: #e0e0e0;
          padding: 20px;
        }
        h1 { color: #00ff88; margin-bottom: 30px; text-shadow: 0 0 10px #00ff88; }
        .container { max-width: 1400px; margin: 0 auto; }
        .device-card {
          background: #1a1f3a;
          border: 2px solid #00ff88;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        .device-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .device-name {
          font-size: 18px;
          font-weight: bold;
          color: #00ff88;
        }
        .device-id {
          font-size: 12px;
          color: #888;
          font-family: monospace;
        }
        .status {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .status.running { background: #00ff88; color: #0a0e27; }
        .status.stopped { background: #ff0055; color: white; }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .metric {
          background: #0f1428;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #00ff88;
        }
        .metric-label { font-size: 12px; color: #aaa; }
        .metric-value { font-size: 16px; color: #00ff88; font-weight: bold; }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        button {
          padding: 8px 16px;
          background: #00ff88;
          border: none;
          border-radius: 4px;
          color: #0a0e27;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }
        button:hover { background: #00dd77; }
        button.danger {
          background: #ff0055;
          color: white;
        }
        button.danger:hover { background: #ee0044; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌍 EarthOS Simulator Dashboard</h1>
        <div id="devices"></div>
      </div>
      <script>
        async function loadDevices() {
          const response = await fetch('/devices');
          const data = await response.json();
          const container = document.getElementById('devices');
          
          if (data.data.length === 0) {
            container.innerHTML = '<p>No devices running. Create one to get started!</p>';
            return;
          }
          
          container.innerHTML = data.data.map(device => \`
            <div class="device-card">
              <div class="device-header">
                <div>
                  <div class="device-name">\${device.name}</div>
                  <div class="device-id">\${device.deviceId}</div>
                </div>
                <div class="status \${device.status}">\${device.status}</div>
              </div>
              <div class="metrics">
                <div class="metric">
                  <div class="metric-label">Uptime</div>
                  <div class="metric-value">\${device.uptime}s</div>
                </div>
                <div class="metric">
                  <div class="metric-label">CPU</div>
                  <div class="metric-value">\${device.cpu.toFixed(1)}%</div>
                </div>
                <div class="metric">
                  <div class="metric-label">Memory</div>
                  <div class="metric-value">\${device.memory.toFixed(1)}%</div>
                </div>
              </div>
              <div class="actions">
                \${device.status === 'running' ? \`
                  <button class="danger" onclick="stopDevice('\${device.deviceId}')">Stop</button>
                \` : \`
                  <button onclick="startDevice('\${device.deviceId}')">Start</button>
                \`}
                <button class="danger" onclick="deleteDevice('\${device.deviceId}')">Delete</button>
              </div>
            </div>
          \`).join('');
        }

        async function spawnDevice() {
          await fetch('/devices/spawn', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
          loadDevices();
        }

        async function stopDevice(deviceId) {
          await fetch(\`/devices/\${deviceId}/stop\`, { method: 'POST' });
          loadDevices();
        }

        async function startDevice(deviceId) {
          await fetch(\`/devices/\${deviceId}/start\`, { method: 'POST' });
          loadDevices();
        }

        async function deleteDevice(deviceId) {
          await fetch(\`/devices/\${deviceId}\`, { method: 'DELETE' });
          loadDevices();
        }

        loadDevices();
        setInterval(loadDevices, 2000);
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
    service: 'earthos-simulator',
    port: PORT,
    activeDevices: devices.size,
  });
});

// Start server
const startServer = async () => {
  try {
    await initialize();
    app.listen(PORT, () => {
      console.log(`🎮 EarthOS Simulator listening on port ${PORT}`);
      console.log(`   Dashboard: http://localhost:${PORT}/dashboard`);
    });
  } catch (error) {
    console.error('Failed to start simulator:', error);
    process.exit(1);
  }
};

startServer();

export default app;
