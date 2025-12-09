# API Configuration for EarthOS Services

## Service Endpoints

### Daemon (Port 3002)
- Base URL: `http://localhost:3002`
- Timeout: 30s
- Retry: 3 attempts
- Protected routes: None (all public)

### Shell (Port 3003)
- Base URL: `http://localhost:3003`
- Timeout: 10s
- Batch size: Max 100 events per request

### App Store (Port 3004)
- Base URL: `http://localhost:3004`
- Timeout: 20s
- Cache: 5 minutes (registry)

### Updater (Port 3005)
- Base URL: `http://localhost:3005`
- Timeout: 60s (downloads)
- Max file size: 500MB

### Simulator (Port 3006)
- Base URL: `http://localhost:3006`
- Dashboard: http://localhost:3006/dashboard
- Max virtual devices: 100

### Cloud Server (Port 8080)
- Base URL: `http://localhost:8080`
- API: `/api/`
- Dashboard: http://localhost:8080/dashboard
- Timeout: 30s

## Cross-Service Communication

```
Daemon ──→ Shell     (Log events)
  ↓
Daemon ──→ AppStore (Search apps, get manifest)
  ↓
Daemon ──→ Updater  (Check, download, install updates)
  ↓
Shell ──→ Cloud     (Send logs)
  ↓
AppStore ──→ Cloud  (Sync app registry)
  ↓
Updater ──→ Cloud   (Get update manifests)
```

## Authentication

Currently no authentication required for local services.
For cloud services, implement:
- OAuth2 for user authentication
- JWT tokens for service-to-service communication
- API keys for external access

## Rate Limiting

Not implemented in v1.0. Consider adding:
- Device request limit: 1000 req/min
- User request limit: 100 req/min
- Update download: 5 concurrent per device

## Data Validation

### Device ID Format
```
earth-[16 hex chars]
e.g., earth-a1b2c3d4e5f6g7h8
```

### Version Format (Semantic Versioning)
```
major.minor.patch[-pre][+build]
e.g., 1.0.0, 1.0.0-beta, 1.0.0+20230101
```

### App ID Format
```
[a-z0-9-]{3,64}
e.g., com-example-myapp, my-app-v2
```

### File Size Limits
- App icon: 2MB
- App package: 500MB
- Update file: 1GB
- Log file: 100MB

## Error Handling

### Status Codes
- 200: Success
- 201: Created
- 400: Bad request
- 403: Forbidden (e.g., protected app removal)
- 404: Not found
- 409: Conflict (e.g., app already installed)
- 500: Server error

### Error Response Format
```json
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Caching Strategy

### Local Caches
- Device config: In-memory, expires 1 hour
- App registry: File-based, expires 5 minutes
- Update manifests: In-memory, expires 24 hours

### Cache Invalidation
- Device config: On update
- App registry: On app install/remove
- Update: On new version detection

## Logging Levels

- `debug`: Detailed information
- `info`: General information
- `warn`: Warning messages
- `error`: Error messages
- `fatal`: Critical failures

## Performance Targets

- Device registration: < 100ms
- App install: < 500ms
- Update check: < 200ms
- Log submission: < 50ms
- Dashboard load: < 1s

## Security Headers

For production deployment, add:
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## CORS Configuration

Currently allows all origins. For production:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

## Database (Future)

When adding database support, consider:
- PostgreSQL for relational data
- Redis for caching
- MongoDB for logs
- S3 for app packages

Migrations should be backward compatible.

## API Versioning

Current: v1
Future versions use URL paths: `/api/v2/...`

## Webhooks (Future)

For app updates and system events:
- Device status changes
- Update available
- App installed
- Error reports

## Monitoring & Metrics (Future)

Track:
- Request count per endpoint
- Response times
- Error rates
- Device count
- Active sessions
- Storage usage
