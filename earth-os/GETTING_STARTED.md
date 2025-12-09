# Getting Started with EarthOS

Welcome to EarthOS! This guide will walk you through setting up and using the system.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Usually comes with Node.js
- **Git** - For version control
- **A terminal/command line**

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

## Installation

### Step 1: Install Dependencies

Navigate to the EarthOS directory and install all service dependencies:

```bash
cd /home/earth-admin/earth-os
chmod +x scripts/install-all.sh
./scripts/install-all.sh
```

Or manually:
```bash
cd daemon && npm install && cd ..
cd shell && npm install && cd ..
cd appstore && npm install && cd ..
cd updater && npm install && cd ..
cd simulator && npm install && cd ..
cd earthling-server && npm install && cd ..
cd earthling-cli && npm install && cd ..
```

### Step 2: Build Services

Build all TypeScript services:

```bash
for service in daemon shell appstore updater simulator earthling-server earthling-cli; do
  (cd $service && npm run build)
done
```

## Running EarthOS

### Option A: Start Each Service Manually

Open 7 terminal windows and run:

```bash
# Terminal 1: Daemon (Port 3002)
cd /home/earth-admin/earth-os/daemon
npm run dev

# Terminal 2: Shell (Port 3003)
cd /home/earth-admin/earth-os/shell
npm run dev

# Terminal 3: App Store (Port 3004)
cd /home/earth-admin/earth-os/appstore
npm run dev

# Terminal 4: Updater (Port 3005)
cd /home/earth-admin/earth-os/updater
npm run dev

# Terminal 5: Simulator (Port 3006)
cd /home/earth-admin/earth-os/simulator
npm run dev

# Terminal 6: Cloud Server (Port 8080)
cd /home/earth-admin/earth-os/earthling-server
npm run dev
```

### Option B: Start All Services at Once

```bash
cd /home/earth-admin/earth-os
chmod +x scripts/start-all.sh
./scripts/start-all.sh

# Stop all with:
./scripts/stop-all.sh
```

### Step 3: Access the System

Once all services are running, visit:

- **Simulator Dashboard:** http://localhost:3006/dashboard
- **Cloud Dashboard:** http://localhost:8080/dashboard

## Using EarthOS CLI

The CLI tool provides command-line access to all EarthOS features.

### Basic Commands

```bash
# Check system health
earthos health

# Generate a new device ID
earthos generate-device-id

# Register a new device
earthos device:register "My Phone"

# List all devices
earthos device:list

# Get device information
earthos device:info earth-abc123def456
```

### App Management

```bash
# List installed apps on a device
earthos app:list earth-abc123def456

# Install an app
earthos app:install earth-abc123def456 calculator

# Remove an app
earthos app:remove earth-abc123def456 myapp

# Browse app store
earthos store:browse

# Search for apps
earthos store:search calculator
```

### Updates

```bash
# Check for OS updates
earthos update:check earth-abc123def456

# Check for specific version
earthos update:check earth-abc123def456 1.0.0
```

### Simulator

```bash
# Spawn a virtual device for testing
earthos sim:spawn "Test Device"

# List virtual devices
earthos sim:list

# Stop a virtual device
# (Use dashboard at http://localhost:3006/dashboard)
```

## API Usage Examples

### Register a Device

```bash
curl -X POST http://localhost:3002/register-device \
  -H "Content-Type: application/json" \
  -d '{"deviceName": "My Device"}'
```

### Install an App

```bash
curl -X POST http://localhost:3002/apps/install \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "earth-abc123def456",
    "appId": "calculator",
    "name": "Calculator",
    "version": "1.0.0"
  }'
```

### List Installed Apps

```bash
curl "http://localhost:3002/apps/list?deviceId=earth-abc123def456"
```

### Check for Updates

```bash
curl "http://localhost:3005/updates/check?deviceId=earth-abc123def456&currentVersion=1.0.0"
```

### Log an Event

```bash
curl -X POST http://localhost:3003/events \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "earth-abc123def456",
    "eventType": "app_opened",
    "data": {"appId": "calculator"},
    "severity": "info"
  }'
```

## Creating Your First App

### 1. Create App Directory

```bash
mkdir my-first-app
cd my-first-app
```

### 2. Create manifest.json

```json
{
  "id": "my-first-app",
  "name": "My First App",
  "version": "1.0.0",
  "description": "My awesome first app for EarthOS",
  "author": "Your Name",
  "icon": "icon.png",
  "permissions": ["storage"],
  "requiredVersion": "1.0.0",
  "protected": false,
  "entryPoint": "app/index.js"
}
```

### 3. Create App Code

```bash
mkdir app
cat > app/index.js << 'EOF'
export default {
  name: "My First App",
  version: "1.0.0",
  run() {
    console.log("Hello from My First App!");
  }
};
EOF
```

### 4. Create App Icon

Copy or create a 256x256 PNG image and save as `icon.png`

### 5. Package as .eapp

```bash
zip -r ../my-first-app.eapp .
cd ..
```

### 6. Install the App

```bash
earthos app:install earth-abc123def456 my-first-app
```

## Understanding the Architecture

### Service Layers

```
┌─────────────────────────────┐
│ User Interface (UI)         │
│ Web browser access          │
└──────────────┬──────────────┘
               │
┌──────────────┴────────────────────────────────┐
│         EarthOS Core Services                 │
├─────────────────────────────────────────────┬─┤
│ Daemon (3002)    │ Shell (3003) │           │ │
│ Core OS logic    │ Event logs   │           │ │
├─────────────────────────────────────────────┤ │
│ App Store (3004) │ Updater (3005)          │ │
│ App registry     │ OS updates              │ │
├─────────────────────────────────────────────┤ │
│ Simulator (3006) - Development & Testing   │ │
└─────────────────────────────────────────────┴─┘
               │
┌──────────────┴───────────────────────┐
│  Earthling Cloud Server (8080)       │
│  - Device Management                 │
│  - App Distribution                  │
│  - Analytics                         │
└──────────────────────────────────────┘
```

### Data Flow

1. **User Actions** → UI (Browser)
2. **Requests** → Local Services (Port 3001-3006)
3. **System Events** → Shell Logger (Port 3003)
4. **Cloud Sync** → Earthling Cloud (Port 8080)
5. **Updates** → Updater Service (Port 3005)

## Troubleshooting

### Port Already in Use

If you get a "port in use" error:

```bash
# Find what's using the port (e.g., 3002)
lsof -i :3002

# Kill the process
kill -9 <PID>

# Or use different ports via environment variables
PORT=3002 npm run dev
```

### Services Won't Start

1. Check Node.js version: `node --version`
2. Delete `node_modules` and reinstall: `npm install`
3. Check console for error messages
4. Ensure all dependencies installed: `npm install`

### Can't Connect to Services

```bash
# Test service health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
curl http://localhost:8080/health

# Or use CLI
earthos health
```

### Device Registration Fails

1. Ensure Daemon is running: `curl http://localhost:3002/health`
2. Try again: `earthos device:register "Test"`
3. Check daemon logs for errors

## Development Workflow

### 1. Start Services

```bash
./scripts/start-all.sh
```

### 2. Open Dashboards

- Simulator: http://localhost:3006/dashboard
- Cloud: http://localhost:8080/dashboard

### 3. Use CLI for Testing

```bash
# Register device
earthos device:register "My Test Device"

# Install app
earthos app:install <deviceId> calculator

# Check logs
curl "http://localhost:3003/logs?deviceId=<deviceId>"
```

### 4. Monitor Logs

Each service logs to `./logs/<service>.log`

```bash
tail -f logs/daemon.log
tail -f logs/shell.log
```

## Performance Tips

1. **Use Production Builds**
   ```bash
   npm run build
   npm start
   ```

2. **Monitor Resource Usage**
   - Check Simulator dashboard
   - Review logs for errors
   - Monitor CPU/Memory

3. **Optimize Queries**
   - Limit log retrieval
   - Cache device data
   - Use pagination

## Next Steps

1. ✅ Complete this Getting Started guide
2. 📖 Read the [Main Documentation](./docs/README.md)
3. 📱 Review [iPhone App Specification](./docs/IPHONE_APP.md)
4. 🛠️ Build your first app (see above)
5. 🚀 Deploy to production

## Support & Resources

- **Documentation:** `/docs/README.md`
- **API Reference:** `/docs/README.md#api-reference`
- **CLI Help:** `earthos --help`
- **Service Health:** `earthos health`

## Common Workflows

### Register a New Device

```bash
# 1. Register
earthos device:register "iPhone 15"

# 2. Get device info
earthos device:info <deviceId>

# 3. Install apps
earthos app:install <deviceId> calculator
earthos app:install <deviceId> notes

# 4. Check status
earthos device:info <deviceId>
```

### Update Device OS

```bash
# 1. Check for updates
earthos update:check <deviceId>

# 2. Download update via API
curl "http://localhost:3005/updates/download/1.0.1?deviceId=<deviceId>"

# 3. Install via API
curl -X POST http://localhost:3005/updates/install \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "<sessionId>", "version": "1.0.1"}'
```

### Test with Virtual Device

```bash
# 1. Spawn virtual device
earthos sim:spawn "Test Device"

# 2. View dashboard
open http://localhost:3006/dashboard

# 3. Register the virtual device
earthos device:register "Virtual Test"

# 4. Install apps
earthos app:install <deviceId> calculator
```

---

**You're all set! Start exploring EarthOS!** 🚀
