# EarthOS

EarthOS is an experimental multi-service operating-system prototype. The repository contains several Node.js services and a CLI, but it is not yet a complete or production-ready operating system.

## Current repository layout

- `daemon/` — device registration and core system API
- `shell/` — event logging service
- `appstore/` — local app package registry
- `updater/` — update distribution service
- `simulator/` — virtual-device simulator and dashboard
- `earthling-server/` — cloud API prototype
- `earthling-cli/` — command-line client
- `shared/` — shared types and utilities
- `scripts/` — install, start, stop, and build scripts
- `docs/` — API and companion-app specifications

**There is currently no `ui/` directory in this repository.** The previously documented Next.js UI and port 3001 are not available in the checked-in source tree.

## Requirements

- Node.js 22 or newer
- npm
- Git

## Install dependencies

From the project directory:

```bash
./scripts/install-all.sh
```

The script installs dependencies for the seven checked-in service packages. It does not install or start a separate UI application.

## Start services

Run the services individually in separate terminals:

```bash
cd daemon && npm run dev
cd shell && npm run dev
cd appstore && npm run dev
cd updater && npm run dev
cd simulator && npm run dev
cd earthling-server && npm run dev
```

Or use the helper script:

```bash
./scripts/start-all.sh
```

The service ports documented by the current scripts are:

| Service | Port |
| --- | ---: |
| Daemon | 3002 |
| Shell | 3003 |
| App Store | 3004 |
| Updater | 3005 |
| Simulator | 3006 |
| Earthling Cloud Server | 8080 |

The CLI is a separate package in `earthling-cli/`; it is not a background service.

## Build

```bash
./scripts/build.sh
```

Build output is generated under `build/`. Do not commit generated build output, dependency folders, or local Python environments.

## Environment and security

Start from `.env.example` and provide real local values. The example contains placeholders only.

- Generate a unique JWT secret for each environment.
- Replace all sample database credentials.
- Do not expose the cloud server or device-management APIs publicly until authentication, authorization, request validation, and rate limiting have been reviewed.
- Do not store real access tokens or production credentials in the repository.
- Treat update installation and app package execution as privileged operations.

## Development status

The checked-in services are a prototype. Documentation and historical reports may describe planned features that are not implemented in the current source tree. Verify each service and endpoint before relying on it. There is no claim of production readiness or full operating-system functionality.
