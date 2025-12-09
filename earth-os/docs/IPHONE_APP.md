# Earthling iPhone Companion App Specification

## Overview

The Earthling app is a native iOS application (Swift + SwiftUI) that pairs with EarthOS devices for remote management, monitoring, and control.

## Features

### 1. Device Pairing

**QR Code Pairing Flow:**
1. Open Earthling app
2. Tap "Pair New Device"
3. Point camera at EarthOS device's QR code
4. Scan contains: deviceId + pairingToken
5. Establish secure HTTPS connection
6. Bi-directional WebSocket sync

**Manual Pairing:**
- Enter device ID
- Enter 6-digit pairing code (sent via SMS)
- Confirm on EarthOS device

### 2. Main Tabs

#### Device Dashboard
- Device name and status
- Battery level (with visual indicator)
- WiFi signal strength
- Last sync time
- Storage usage
- System version
- Real-time metrics
  - CPU usage
  - Memory usage
  - Network activity

**Actions:**
- Remote restart
- Force sync
- System info
- Device settings

#### Messages
- Real-time message queue from device
- Push notifications
- Message history
- Device alerts
  - Low battery
  - Update available
  - App crash reports
  - Network issues

#### AI Chat History
- Conversation history from AI Chat app
- Search conversations
- Export chat logs
- Sync status
- Offline access

#### Installed Apps
- List of installed apps on device
- App icons
- Versions
- Storage used by each app
- Quick actions:
  - Remote install
  - Remote uninstall
  - Check for updates
  - View app details

#### Logs & Analytics
- Real-time event log viewer
- Filters:
  - By event type
  - By date range
  - By severity
- Search functionality
- Export logs
- Chart views:
  - App usage trends
  - Crash statistics
  - Performance metrics

#### Settings
- Linked devices
  - Manage paired devices
  - Remove device
  - Device nickname
  - Trust level
- App settings
  - Push notifications
  - Sync frequency
  - Auto-sync WiFi only
  - Cloud backup
  - Data retention
- About
  - App version
  - Terms of service
  - Privacy policy

### 3. Remote Management

**Remote Install**
- Browse cloud app store
- Install apps on remote device
- Monitor installation progress
- Automatic sync

**Remote Uninstall**
- List installed apps
- Remove apps (protected apps are disabled)
- Confirmation prompt
- Automatic sync

**Remote Update**
- Trigger OS updates on device
- Monitor progress
- Rollback option
- Update history

**Remote Restart**
- Graceful shutdown
- Force restart option
- Confirmation dialog

### 4. Real-Time Sync

**WebSocket Connection:**
```
wss://earthling.tjstudios.xyz/sync/<deviceId>
```

**Sync Messages:**
- Device status changes
- Battery level updates
- New app installations
- Update progress
- System events
- New logs
- Error reports

**Offline Handling:**
- Queue changes locally
- Retry on connection
- Conflict resolution
- Cache recent data

### 5. Notifications

**Push Notifications:**
- Update available
- App crashes
- Low battery warning
- Storage full
- WiFi disconnected
- Security alerts
- Important system messages

**In-App Alerts:**
- Banner notifications
- Modal alerts for critical issues
- Notification center

### 6. Security

**Authentication:**
- OAuth2 via Earthling Cloud
- JWT token refresh
- Biometric unlock (Face ID / Touch ID)
- Session timeout

**Data Protection:**
- HTTPS/TLS 1.3
- End-to-end encryption for sensitive data
- Local keychain storage
- No sensitive data in logs

**Trust Management:**
- Trust specific devices
- Require biometric auth for remote actions
- Log all remote operations
- Geo-fencing (optional)

## Technical Architecture

### Stack
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Networking:** URLSession + WebSocket
- **Storage:** Core Data
- **Auth:** OAuth2 + Keychain

### Data Models
```swift
struct Device {
    let deviceId: String
    let name: String
    var batteryLevel: Int
    var wifiConnected: Bool
    var lastSync: Date
    var status: DeviceStatus
    var systemVersion: String
    var theme: String
}

struct InstalledApp {
    let id: String
    let name: String
    let version: String
    let icon: URL
    let size: Int64
    let protected: Bool
}

struct SystemEvent {
    let id: UUID
    let eventType: String
    let timestamp: Date
    let data: [String: Any]
    let severity: Severity
}

enum Severity {
    case info, warning, error, critical
}
```

### API Integration

**Base URL:** `https://earthling.tjstudios.xyz`

**Endpoints:**
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

GET    /api/devices
GET    /api/devices/:deviceId
POST   /api/devices/:deviceId/pair
DELETE /api/devices/:deviceId/unpair
POST   /api/devices/:deviceId/restart
POST   /api/devices/:deviceId/sync

GET    /api/devices/:deviceId/apps
POST   /api/devices/:deviceId/apps/:appId/install
DELETE /api/devices/:deviceId/apps/:appId/uninstall

GET    /api/devices/:deviceId/updates
POST   /api/devices/:deviceId/updates/install
POST   /api/devices/:deviceId/updates/rollback

GET    /api/devices/:deviceId/logs
GET    /api/devices/:deviceId/metrics

GET    /api/apps (cloud store)

WS     /sync/:deviceId (WebSocket)
```

### UI Screens

1. **Launch Screen**
   - App logo with animation
   - Loading indicator

2. **Login Screen**
   - Email/password fields
   - OAuth options (Apple, Google)
   - Sign up link

3. **Pairing Screen**
   - QR code scanner
   - Manual entry option
   - Instructions

4. **Main Tab Navigation**
   - 5 tabs: Dashboard, Messages, Chat, Apps, Logs, Settings

5. **Device Dashboard**
   - Device card with metrics
   - Status indicator
   - Quick actions
   - Recent events

6. **App Management**
   - List view of apps
   - Swipe to remove (protected apps disabled)
   - Tap for details
   - Remote install dialog

7. **Logs Viewer**
   - List of events
   - Filter/search bar
   - Pull to refresh
   - Export button

8. **Settings**
   - Linked devices list
   - App preferences
   - About section
   - Logout button

## Installation & Distribution

### Development
1. Clone repository
2. Open in Xcode
3. Select target device/simulator
4. Build and run

### Testing
- Unit tests for models
- UI tests for screens
- Network mocking for API
- Integration tests with simulator

### Release
1. Update version number
2. Create release notes
3. Build archive
4. Submit to App Store
5. Monitor TestFlight feedback

## Performance Targets

- Launch time: < 1.5s
- Tab switching: < 200ms
- Device sync: Real-time (< 100ms latency)
- Memory usage: < 150MB
- Scrolling: 60 FPS

## Accessibility

- VoiceOver support
- Dynamic type support
- High contrast mode
- Haptic feedback
- Keyboard navigation

## Internationalization

- English (US, UK)
- Spanish
- French
- German
- Japanese
- Simplified Chinese

## Versioning

Current: v1.0.0

### Semantic Versioning
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

---

**Earthling iOS v1.0.0 - Connect to EarthOS on the Go**
