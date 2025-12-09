# 🌍 EarthOS - Full Operating System Documentation

EarthOS is a complete, custom operating system with a modern UI, cloud backend, device synchronization, and a full app ecosystem.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EarthOS UI (Next.js)                      │
│  (Home Screen, Apps, Settings, Setup, Multitasking)         │
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼──────┐    ┌──────▼────┐    ┌────────▼───┐
    │  Daemon   │    │   Shell   │    │  Simulator │
    │ (3002)    │    │  (3003)   │    │   (3006)   │
    └────┬──────┘    └──────┬────┘    └────────┬───┘
         │                  │                  │
    ┌────▼──────┐    ┌──────▼────┐    ┌────────▼────┐
    │ AppStore  │    │  Updater  │    │ EarthOS CLI │
    │ (3004)    │    │ (3005)    │    │             │
    └────┬──────┘    └──────┬────┘    └─────────────┘
         │                  │
         └──────────┬───────┘
                    │
         ┌──────────▼──────────┐
         │ Earthling Cloud     │
         │ Server (8080)       │
         │ - Device Registry   │
         │ - App Store         │
         │ - Update Management │
         │ - Analytics         │
         └─────────────────────┘
```

## Components

### 1. **EarthOS UI** (Port 3001)
Modern Next.js web application that serves as the operating system interface.

**Screens:**
- Home screen with glowing neon icons
- App drawer
- Individual app interfaces (Camera, Browser, AI Chat, etc.)
- Settings panel
- App Store
- Download manager
- Update center
- Multitasking view

**Features:**
- GSAP animations
- Neon glow effects
- Particle burst animations
- Real-time sync indicator
- Battery & wifi status
- Dark/Neon/Light themes

### 2. **EarthOS Daemon** (Port 3002)
Core OS backend service.

**Responsibilities:**
- Device registration
- System configuration management
- App installation/removal
- Protected app enforcement
- Update staging
- Download tracking

**Key Endpoints:**
```
POST   /register-device          - Register new device
GET    /system/device-id          - Get device ID
GET    /system/config             - Get system config
POST   /system/config             - Update config
GET    /apps/list                 - List installed apps
POST   /apps/install              - Install app
DELETE /apps/remove               - Remove app
GET    /updates/check             - Check for updates
POST   /updates/stage             - Stage update
POST   /updates/apply             - Apply update
POST   /downloads/start           - Start download
GET    /downloads/status          - Get download status
```

### 3. **EarthOS Shell** (Port 3003)
Background event logging and analytics service.

**Logs:**
- App opened/closed
- App installed/updated/removed
- Browser searches
- AI Chat messages
- Downloads
- System events
- Errors & crashes
- iPhone sync activity

**Auto-Reports to Cloud:**
- Sends logs to `https://earthling.tjstudios.xyz/api/logs`
- Local JSONL log files for offline support

### 4. **EarthOS App Store** (Port 3004)
Local app repository and registry.

**Features:**
- Hosts .eapp packages
- Registry system for app metadata
- Search functionality
- Cloud sync capabilities
- Installation triggers

### 5. **EarthOS Update Engine** (Port 3005)
Update download, validation, and installation service.

**Features:**
- Version checking
- Delta & full updates
- Checksum validation
- Installation progress tracking
- Rollback support
- WebSocket progress notifications

### 6. **EarthOS Simulator** (Port 3006)
Development tool for testing and simulating virtual devices.

**Features:**
- Spawn virtual devices
- Each device has isolated state
- Real-time metrics (CPU, memory)
- Logging support
- Web dashboard

### 7. **Earthling Cloud Server** (Port 8080)
Cloud backend for device management and distribution.

**Features:**
- Device registration & tracking
- Cloud app store
- Update distribution
- Log aggregation
- Analytics dashboard
- Admin panel

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- TypeScript

### Installation Steps

1. **Install all services:**
```bash
cd /home/earth-admin/earth-os

# Install dependencies for each service
for service in daemon shell appstore updater simulator earthling-cli earthling-server ui; do
  cd $service
  npm install
  cd ..
done
```

2. **Build TypeScript:**
```bash
# For each service directory
npm run build
```

3. **Start services in separate terminals:**

```bash
# Terminal 1: EarthOS Daemon (Port 3002)
cd daemon
npm run dev

# Terminal 2: EarthOS Shell (Port 3003)
cd shell
npm run dev

# Terminal 3: EarthOS App Store (Port 3004)
cd appstore
npm run dev

# Terminal 4: EarthOS Updater (Port 3005)
cd updater
npm run dev

# Terminal 5: EarthOS Simulator (Port 3006)
cd simulator
npm run dev

# Terminal 6: EarthOS UI (Port 3001)
cd ui
npm run dev

# Terminal 7: Earthling Cloud Server (Port 8080)
cd earthling-server
npm run dev
```

### Using the CLI

```bash
# Check service health
earthos health

# Register a device
earthos device:register "My Phone"

# List installed apps
earthos app:list <deviceId>

# Install an app
earthos app:install <deviceId> <appId>

# Browse app store
earthos store:browse

# Search for apps
earthos store:search calculator

# Check for updates
earthos update:check <deviceId>

# Spawn virtual device for testing
earthos sim:spawn "Test Device"

# Generate a device ID
earthos generate-device-id
```

## API Reference

### Device Management

**Register Device:**
```bash
POST /register-device
{
  "deviceName": "iPhone 15"
}

Response:
{
  "success": true,
  "data": {
    "deviceId": "earth-abc123def456",
    "config": { ... }
  }
}
```

**Get System Configuration:**
```bash
GET /system/config?deviceId=earth-abc123def456
```

### App Management

**List Apps:**
```bash
GET /apps/list?deviceId=earth-abc123def456
```

**Install App:**
```bash
POST /apps/install
{
  "deviceId": "earth-abc123def456",
  "appId": "calculator",
  "name": "Calculator",
  "version": "1.0.0"
}
```

**Remove App:**
```bash
DELETE /apps/remove?deviceId=earth-abc123def456&appId=myapp
```

### Updates

**Check for Updates:**
```bash
GET /updates/check?deviceId=earth-abc123def456&currentVersion=1.0.0
```

**Download Update:**
```bash
GET /updates/download/1.0.1?deviceId=earth-abc123def456
```

### Logs

**Submit Event:**
```bash
POST /events
{
  "deviceId": "earth-abc123def456",
  "eventType": "app_opened",
  "data": { "appId": "calculator" },
  "severity": "info"
}
```

**Batch Events:**
```bash
POST /batch-events
{
  "deviceId": "earth-abc123def456",
  "events": [
    { "eventType": "app_opened", ... },
    { "eventType": "app_closed", ... }
  ]
}
```

## .eapp Package Format

### Structure
```
myapp.eapp (ZIP file)
├── manifest.json       (Required)
├── app/
│   └── index.js       (Entry point)
├── icon.png           (256x256)
├── permissions.json   (Optional)
├── install.js         (Optional)
└── README.md          (Optional)
```

### manifest.json Example
```json
{
  "id": "myapp",
  "name": "My App",
  "version": "1.0.0",
  "description": "My awesome app",
  "author": "Developer",
  "icon": "icon.png",
  "permissions": ["storage", "network"],
  "requiredVersion": "1.0.0",
  "protected": false,
  "entryPoint": "app/index.js",
  "keywords": ["productivity"],
  "license": "MIT"
}
```

### Protected Apps
Cannot be uninstalled:
- Camera
- App Store
- Browser
- AI Chat
- Settings
- Files

## Security Features

- **Device IDs:** Cryptographically secure (earth-[16 random hex chars])
- **Checksum Validation:** SHA256 verification for updates
- **Protected Apps:** Core system apps cannot be removed
- **Permission System:** Apps request specific permissions
- **Local Logging:** Offline-first event logging with cloud sync

## Development

### Environment Variables

Create `.env` files in each service:

```
# daemon/.env
PORT=3002
SHELL_URL=http://localhost:3003

# shell/.env
PORT=3003
CLOUD_API=https://earthling.tjstudios.xyz/api/logs

# appstore/.env
PORT=3004
CLOUD_API=https://earthling.tjstudios.xyz/api/apps

# updater/.env
PORT=3005

# simulator/.env
PORT=3006

# earthling-cli/.env
DAEMON_URL=http://localhost:3002
SHELL_URL=http://localhost:3003
APPSTORE_URL=http://localhost:3004
UPDATER_URL=http://localhost:3005
SIMULATOR_URL=http://localhost:3006

# earthling-server/.env
PORT=8080
```

### Project Structure

```
earthos/
├── ui/                 - Next.js frontend
├── daemon/             - Core OS backend
├── shell/              - Event logger
├── appstore/           - App registry
├── updater/            - Update engine
├── simulator/          - Dev tools
├── earthling-cli/      - Command line tool
├── earthling-server/   - Cloud backend
├── shared/
│   ├── types/          - Shared TypeScript types
│   └── utils/          - Validators, crypto utilities
└── docs/               - Documentation
```

## Dashboards

- **EarthOS Simulator Dashboard:** http://localhost:3006/dashboard
- **Earthling Cloud Dashboard:** http://localhost:8080/dashboard

## Troubleshooting

### Services Won't Connect
- Ensure all services are running on correct ports
- Check environment variables
- Verify `localhost` is resolvable

### Device Registration Fails
- Make sure Daemon is running on port 3002
- Check device name is provided

### Apps Won't Install
- Verify App Store is running (port 3004)
- Check app ID is valid
- Ensure device exists

### Updates Stuck
- Check Updater service (port 3005)
- Verify checksums are valid
- Try canceling and retrying

## Performance Tips

- Run services on different cores: `taskset` or `numactl`
- Use production build: `npm run build && npm start`
- Monitor logs: `earthos-shell` on port 3003
- Check simulator dashboard for virtual device metrics

## Contributing

1. Follow TypeScript conventions
2. Add tests for new features
3. Update API documentation
4. Follow existing code style
5. Commit with meaningful messages

## License

MIT - See LICENSE file

## Support

Issues and PRs welcome on GitHub!

---

**Made with ❤️ by the EarthOS Team**
