#!/usr/bin/env node

/**
 * EarthOS Project Index
 * Quick reference guide to all project resources
 */

console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║                   🌍 EarthOS v1.0.0 - Project Index                   ║
║                                                                        ║
║              A Complete Operating System with Cloud Backend            ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝

📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Main Documentation
   └─ ./README.md                      Complete system overview

📘 Getting Started Guide
   └─ ./GETTING_STARTED.md            Installation & basic usage

📗 iPhone Companion App
   └─ ./docs/IPHONE_APP.md            iOS app specification

📙 API Configuration
   └─ ./docs/API_CONFIG.md            Service configuration & endpoints

📕 Project Summary
   └─ ./PROJECT_SUMMARY.md            Complete file listing

🔧 SERVICES & PORTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UI Layer:
  └─ ui/                              Port 3001 - Web Interface
     └─ src/apps/                     App implementations
     └─ src/setup/                    Boot animations & setup

Core Services:
  ├─ daemon/                          Port 3002 - Core OS Backend
  │  └─ src/index.ts                  ~700 lines
  │
  ├─ shell/                           Port 3003 - Event Logger
  │  └─ src/index.ts                  ~450 lines
  │
  ├─ appstore/                        Port 3004 - App Repository
  │  └─ src/index.ts                  ~350 lines
  │
  ├─ updater/                         Port 3005 - Update Engine
  │  └─ src/index.ts                  ~400 lines
  │
  └─ simulator/                       Port 3006 - DevTools + Dashboard
     └─ src/index.ts                  ~500 lines

Cloud & Tools:
  ├─ earthling-server/                Port 8080 - Cloud API
  │  └─ src/index.ts                  ~500 lines
  │
  └─ earthling-cli/                   Command-line Interface
     └─ src/index.ts                  ~600 lines

Shared Code:
  └─ shared/                          Shared types & utilities
     ├─ types/index.ts                Core type definitions
     ├─ types/eapp.ts                 .eapp package format
     └─ utils/                        Validators & crypto

🎯 QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Install All Services:
   $ cd /home/earth-admin/earth-os
   $ chmod +x scripts/install-all.sh
   $ ./scripts/install-all.sh

2. Start All Services:
   $ chmod +x scripts/start-all.sh
   $ ./scripts/start-all.sh

3. Access Dashboards:
   - Simulator:  http://localhost:3006/dashboard
   - Cloud:      http://localhost:8080/dashboard

4. Use CLI:
   $ earthos health
   $ earthos device:register "My Device"
   $ earthos device:list

💻 CLI COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Device Management:
  $ earthos device:register <name>      Register new device
  $ earthos device:list                  List all devices
  $ earthos device:info <deviceId>       Get device info

App Management:
  $ earthos app:list <deviceId>          List installed apps
  $ earthos app:install <deviceId> <appId>
  $ earthos app:remove <deviceId> <appId>

App Store:
  $ earthos store:browse                 Browse available apps
  $ earthos store:search <query>         Search for apps

Updates:
  $ earthos update:check <deviceId>      Check for OS updates

Simulator:
  $ earthos sim:spawn <name>             Spawn virtual device
  $ earthos sim:list                     List virtual devices

System:
  $ earthos health                       Check service health
  $ earthos generate-device-id           Generate new ID

🔌 API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Daemon (Port 3002):
  POST   /register-device               Register device
  GET    /system/config                 Get configuration
  GET    /apps/list                     List installed apps
  POST   /apps/install                  Install app
  DELETE /apps/remove                   Remove app
  GET    /updates/check                 Check for updates

Shell (Port 3003):
  POST   /events                        Log event
  POST   /batch-events                  Log multiple events
  GET    /logs                          Get logs

App Store (Port 3004):
  GET    /apps                          List apps
  GET    /apps/search                   Search apps
  POST   /apps/install                  Install app

Updater (Port 3005):
  GET    /updates/check                 Check updates
  GET    /updates/download/:version     Download update
  POST   /updates/install               Install update

Simulator (Port 3006):
  POST   /devices/spawn                 Create virtual device
  GET    /devices                       List devices
  POST   /devices/:deviceId/logs        Add logs

Cloud (Port 8080):
  POST   /api/devices/register          Register device
  GET    /api/devices                   List devices
  GET    /api/apps                      Get app store
  POST   /api/logs                      Send logs

📦 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

earth-os/
├── ui/                    Web interface (Next.js)
├── daemon/                Core OS service
├── shell/                 Event logger
├── appstore/              App repository
├── updater/               Update engine
├── simulator/             Developer tools & dashboard
├── earthling-server/      Cloud backend
├── earthling-cli/         Command-line tool
├── shared/                Shared types & utilities
├── docs/                  Documentation
├── scripts/               Automation scripts
├── README.md              Main documentation
├── GETTING_STARTED.md    Setup guide
├── PROJECT_SUMMARY.md    File listing
├── .env.example          Environment template
└── tsconfig.json         TypeScript config

🔐 SECURITY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Cryptographic Device IDs
   Format: earth-[16 random hex chars]

✅ Checksum Validation
   Algorithm: SHA256

✅ Protected Apps
   Cannot be uninstalled: Camera, App Store, Browser, AI Chat, Settings, Files

✅ Permission System
   Apps request: camera, storage, network, location, contacts, calendar, microphone

✅ Secure Token Generation
   CSPRNG-based tokens

✅ Update Validation
   Digital signature verification

🎨 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System:
  ✅ Device registration & management
  ✅ App installation/removal
  ✅ OS updates with rollback
  ✅ Event logging & analytics
  ✅ File downloads
  ✅ System configuration
  ✅ Permission system
  ✅ Protected apps enforcement

Developer Tools:
  ✅ Command-line interface
  ✅ Virtual device simulator
  ✅ Web dashboards
  ✅ Health check system
  ✅ Logging utilities

Cloud Features:
  ✅ Device synchronization
  ✅ App distribution
  ✅ Update management
  ✅ Analytics aggregation
  ✅ Admin dashboard

📱 APP PACKAGE FORMAT (.eapp)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

myapp.eapp (ZIP file containing):
  ├── manifest.json         App metadata & permissions
  ├── app/index.js         Main entry point
  ├── icon.png             App icon (256x256)
  ├── permissions.json     Detailed permissions (optional)
  ├── install.js           Installation hooks (optional)
  └── README.md            Documentation (optional)

Example manifest.json:
  {
    "id": "myapp",
    "name": "My App",
    "version": "1.0.0",
    "description": "...",
    "author": "...",
    "icon": "icon.png",
    "permissions": ["storage", "network"],
    "requiredVersion": "1.0.0",
    "protected": false,
    "entryPoint": "app/index.js"
  }

⚙️ CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment Variables:
  Copy .env.example to each service directory as .env

Service Ports:
  - UI: 3001           (Next.js)
  - Daemon: 3002       (Core backend)
  - Shell: 3003        (Event logger)
  - App Store: 3004    (App registry)
  - Updater: 3005      (OS updates)
  - Simulator: 3006    (DevTools)
  - Cloud: 8080        (Backend API)

🧪 TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check Service Health:
  $ earthos health

Register Test Device:
  $ earthos device:register "Test"

Spawn Virtual Device:
  $ earthos sim:spawn "Virtual"

View Dashboards:
  - Simulator: http://localhost:3006/dashboard
  - Cloud: http://localhost:8080/dashboard

📊 STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Code:
  - Total Files: 50+
  - Lines of Code: 8000+
  - Services: 7 core services
  - API Endpoints: 40+
  - CLI Commands: 20+
  - Type Definitions: 50+

Documentation:
  - Total Pages: 6
  - Lines: 2000+
  - Code Examples: 100+

🚀 DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Development:
  $ ./scripts/install-all.sh
  $ ./scripts/start-all.sh

Production:
  1. Update NODE_ENV=production in .env files
  2. Run: npm run build in each service
  3. Use: npm start in each service
  4. Configure: nginx/apache for reverse proxy
  5. Setup: SSL certificates
  6. Deploy: Docker or container orchestration

🔗 LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Main Docs:        ./README.md
Getting Started:  ./GETTING_STARTED.md
iPhone App:       ./docs/IPHONE_APP.md
API Config:       ./docs/API_CONFIG.md
Project Summary:  ./PROJECT_SUMMARY.md

📞 SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Read the documentation
2. Check the Getting Started guide
3. Use CLI health check: earthos health
4. Review service logs
5. Check dashboards for status

═══════════════════════════════════════════════════════════════════════════

                    🌍 EarthOS v1.0.0
           A Complete Operating System with Cloud Backend

                Made with ❤️ by the EarthOS Team
                  https://github.com/earthos

═══════════════════════════════════════════════════════════════════════════
`);
