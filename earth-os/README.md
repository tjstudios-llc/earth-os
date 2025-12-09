# 🌍 EarthOS - A Complete Custom Operating System

> A full-featured operating system with modern UI, cloud backend, app ecosystem, and device synchronization

## 📋 What is EarthOS?

EarthOS is a complete, feature-rich operating system built from scratch. It includes:

- **Modern UI** - Beautiful Next.js interface with neon animations
- **Core Services** - Daemon, shell logging, update engine, simulator
- **App Store** - Full package management with .eapp format
- **Cloud Backend** - Earthling cloud server for device management
- **iPhone Integration** - Companion app for remote management
- **Developer Tools** - CLI and simulator for testing
- **Security** - Protected apps, permissions system, secure updates

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /home/earth-admin/earth-os

# Install all services
./scripts/install-all.sh
```

Or manually:
```bash
for service in daemon shell appstore updater simulator earthling-server ui earthling-cli; do
  (cd $service && npm install)
done
```

### 2. Start Services

```bash
# In separate terminals, run:

# Terminal 1: Daemon
cd daemon && npm run dev

# Terminal 2: Shell
cd shell && npm run dev

# Terminal 3: App Store
cd appstore && npm run dev

# Terminal 4: Updater
cd updater && npm run dev

# Terminal 5: Simulator
cd simulator && npm run dev

# Terminal 6: Cloud Server
cd earthling-server && npm run dev

# Terminal 7: UI
cd ui && npm run dev
```

### 3. Access EarthOS

- **UI:** http://localhost:3001
- **Simulator Dashboard:** http://localhost:3006/dashboard
- **Cloud Dashboard:** http://localhost:8080/dashboard

## 📦 Architecture

```
┌─────────────────────────────────────────────┐
│         EarthOS UI (Next.js)                │
│    - Home Screen, Apps, Settings           │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
┌───────▼──┐ ┌──▼─────┐ ┌┴───────┐
│ Daemon   │ │ Shell  │ │Simulator│
│ (3002)   │ │(3003)  │ │ (3006) │
└───────┬──┘ └────────┘ └────────┘
        │
    ┌───┴──────┬──────────┐
    │          │          │
┌───▼─────┐ ┌─▼──────┐ ┌─▼─────┐
│AppStore │ │Updater │ │  CLI  │
│ (3004)  │ │(3005)  │ │       │
└────┬────┘ └────────┘ └───────┘
     │
     └──────────┬──────────┐
                │          │
         ┌──────▼──────┐  iPhone
         │  Cloud      │  Companion
         │  Server     │  App
         │  (8080)     │
         └─────────────┘
```

## 📚 Documentation

- **[Main Documentation](./docs/README.md)** - Complete system documentation
- **[iPhone App Spec](./docs/IPHONE_APP.md)** - iOS companion app specification
- **[.eapp Format](./shared/types/eapp.ts)** - App package specification
- **[API Reference](./docs/README.md#api-reference)** - Full API documentation

## 🎯 Key Features

### UI Features
- Neon glow effects
- Smooth animations (GSAP)
- Dark/Light/Neon themes
- Real-time status indicators
- Multitasking view
- App drawer
- Download manager
- Update center

### System Features
- Device registration
- App installation/removal
- Protected apps (can't be uninstalled)
- OS updates with rollback
- Event logging & analytics
- File downloads
- Permission system

### Developer Tools
- Command-line interface (`earthos` command)
- Virtual device simulator
- Dashboard for monitoring
- Local app store testing
- Log analysis tools

### Cloud Features
- Device synchronization
- App distribution
- Update management
- Analytics aggregation
- Admin dashboard

## 🔧 Services & Ports

| Service | Port | Purpose |
|---------|------|---------|
| UI | 3001 | Web interface |
| Daemon | 3002 | Core OS backend |
| Shell | 3003 | Event logging |
| App Store | 3004 | App repository |
| Updater | 3005 | OS updates |
| Simulator | 3006 | Development tool |
| Cloud Server | 8080 | Backend API |

## 💻 CLI Commands

```bash
# Device Management
earthos device:register "My Device"
earthos device:list
earthos device:info <deviceId>

# App Management
earthos app:list <deviceId>
earthos app:install <deviceId> <appId>
earthos app:remove <deviceId> <appId>

# App Store
earthos store:browse
earthos store:search <query>

# Updates
earthos update:check <deviceId> [version]

# Simulator
earthos sim:spawn "Test Device"
earthos sim:list

# System
earthos health
earthos generate-device-id
```

## 📱 App Package Format (.eapp)

Create installable app packages:

```bash
mkdir myapp
cd myapp

# Create manifest
cat > manifest.json << EOF
{
  "id": "myapp",
  "name": "My App",
  "version": "1.0.0",
  "description": "My awesome app",
  "author": "Your Name",
  "icon": "icon.png",
  "permissions": ["storage", "network"],
  "requiredVersion": "1.0.0",
  "protected": false,
  "entryPoint": "app/index.js"
}
EOF

# Create app code
mkdir app
echo 'console.log("Hello from my app!");' > app/index.js

# Add icon
cp /path/to/icon.png .

# Create package
zip -r ../myapp.eapp .

# Install via CLI or UI
```

## 🔐 Security

- **Device IDs:** Cryptographically secure (earth-[16 random hex])
- **Updates:** SHA256 checksum validation
- **Protected Apps:** System apps can't be uninstalled
- **Permissions:** Apps request specific capabilities
- **Logs:** Encrypted cloud sync, local fallback
- **Auth:** OAuth2, JWT tokens, biometric support (iOS)

## 🎨 Customization

### Themes
- **Dark:** Black/gray with green accents
- **Neon:** Purple/cyan gradients with glow effects
- **Light:** Clean white interface

### Animations
- GSAP library for smooth transitions
- Particle effects
- Icon animations
- Loading indicators
- Ripple effects

## 📊 Monitoring

**Simulator Dashboard:**
- View active virtual devices
- Real-time metrics
- Device logs
- Start/stop devices

**Cloud Dashboard:**
- Registered devices
- Device status
- Analytics
- Update statistics
- App distribution

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Health checks
earthos health
```

## 📋 Project Structure

```
earth-os/
├── ui/                 # Next.js web interface
├── daemon/             # Core OS service
├── shell/              # Event logger
├── appstore/           # App repository
├── updater/            # Update engine
├── simulator/          # Dev simulator
├── earthling-cli/      # Command line tool
├── earthling-server/   # Cloud backend
├── shared/             # Shared types & utils
└── docs/               # Documentation
```

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check ports are free
lsof -i :3002  # Daemon
lsof -i :3003  # Shell
lsof -i :3004  # App Store
lsof -i :3005  # Updater
lsof -i :3006  # Simulator
lsof -i :8080  # Cloud Server

# Kill process on port
lsof -ti:3002 | xargs kill -9
```

### Can't Connect to Services
```bash
# Test health
earthos health

# Check service logs for errors
# Look for error messages in terminal output
```

### Device Registration Issues
```bash
# Ensure Daemon is running
curl http://localhost:3002/health

# Try registering again
earthos device:register "Test Device"
```

## 📈 Performance Tips

- Use production builds: `npm run build`
- Run on separate cores if possible
- Monitor logs with Shell service
- Use Simulator for testing
- Clear old logs periodically

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- GSAP for animations
- Next.js for the web framework
- Express for backend services
- TypeScript for type safety
- The open source community

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Include error logs and steps to reproduce

---

**EarthOS v1.0.0** - Built with ❤️ for the future of operating systems

[Documentation](./docs/README.md) • [iPhone App](./docs/IPHONE_APP.md) • [API Docs](./docs/README.md#api-reference)
