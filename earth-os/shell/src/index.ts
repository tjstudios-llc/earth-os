/**
 * EarthOS Shell - Background Log Engine
 * Logs all system events and sends them to the cloud server
 * Port: 3003
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SystemEvent, EventType } from '../../shared/types';

const app: Express = express();
const PORT = process.env.PORT || 3003;
const LOGS_DIR = path.join(__dirname, '../logs');
const CLOUD_API = process.env.CLOUD_API || 'https://earthling.tjstudios.xyz/api/logs';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize logs directory
const initializeLogs = async () => {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to initialize logs:', error);
  }
};

// Utility: Log an event locally
const logEventLocally = async (event: SystemEvent): Promise<void> => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `${event.deviceId}-${dateStr}.jsonl`);
    const logEntry = JSON.stringify(event) + '\n';
    await fs.appendFile(logFile, logEntry);
  } catch (error) {
    console.error('Error writing log:', error);
  }
};

// Utility: Send logs to cloud server
const sendLogsToCloud = async (event: SystemEvent): Promise<void> => {
  try {
    // Non-blocking cloud send
    setTimeout(async () => {
      try {
        await axios.post(CLOUD_API, event, {
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`📤 Sent event to cloud: ${event.eventType}`);
      } catch (error) {
        console.warn('Failed to send logs to cloud:', error);
      }
    }, 0);
  } catch (error) {
    console.error('Cloud send error:', error);
  }
};

// ============ API ENDPOINTS ============

/**
 * POST /events
 * Log a system event
 */
app.post('/events', async (req: Request, res: Response) => {
  try {
    const { deviceId, eventType, data, severity = 'info' } = req.body;

    if (!deviceId || !eventType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const event: SystemEvent = {
      id: uuidv4(),
      deviceId,
      eventType: eventType as EventType,
      timestamp: new Date(),
      data: data || {},
      severity,
    };

    // Log locally
    await logEventLocally(event);

    // Send to cloud (non-blocking)
    await sendLogsToCloud(event);

    res.status(201).json({
      success: true,
      data: { eventId: event.id },
    });
  } catch (error) {
    console.error('Log event error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /batch-events
 * Log multiple events at once
 */
app.post('/batch-events', async (req: Request, res: Response) => {
  try {
    const { deviceId, events } = req.body;

    if (!deviceId || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload',
      });
    }

    const processedEvents: SystemEvent[] = [];

    for (const evt of events) {
      const event: SystemEvent = {
        id: uuidv4(),
        deviceId,
        eventType: evt.eventType as EventType,
        timestamp: new Date(evt.timestamp || Date.now()),
        data: evt.data || {},
        severity: evt.severity || 'info',
      };

      await logEventLocally(event);
      await sendLogsToCloud(event);
      processedEvents.push(event);
    }

    res.status(201).json({
      success: true,
      data: { count: processedEvents.length },
    });
  } catch (error) {
    console.error('Batch log error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /logs
 * Retrieve logs for a device
 */
app.get('/logs', async (req: Request, res: Response) => {
  try {
    const { deviceId, date } = req.query;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
      });
    }

    const dateStr = (date as string) || new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `${deviceId}-${dateStr}.jsonl`);

    try {
      const content = await fs.readFile(logFile, 'utf-8');
      const logs = content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));

      res.json({
        success: true,
        data: logs,
      });
    } catch {
      res.json({
        success: true,
        data: [],
      });
    }
  } catch (error) {
    console.error('Retrieve logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /logs/stats
 * Get log statistics
 */
app.get('/logs/stats', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
      });
    }

    // Count log files for this device
    const files = await fs.readdir(LOGS_DIR);
    const deviceFiles = files.filter((f) => f.startsWith(`${deviceId}-`));

    res.json({
      success: true,
      data: {
        deviceId,
        totalLogFiles: deviceFiles.length,
        logsPath: LOGS_DIR,
      },
    });
  } catch (error) {
    console.error('Log stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * DELETE /logs
 * Clear logs for a device
 */
app.delete('/logs', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing deviceId',
      });
    }

    const files = await fs.readdir(LOGS_DIR);
    const deviceFiles = files.filter((f) => f.startsWith(`${deviceId}-`));

    for (const file of deviceFiles) {
      await fs.unlink(path.join(LOGS_DIR, file));
    }

    res.json({
      success: true,
      data: { deletedCount: deviceFiles.length },
    });
  } catch (error) {
    console.error('Delete logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'earthos-shell', port: PORT });
});

// Start server
const startServer = async () => {
  try {
    await initializeLogs();
    app.listen(PORT, () => {
      console.log(`📝 EarthOS Shell listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start shell:', error);
    process.exit(1);
  }
};

startServer();

export default app;
