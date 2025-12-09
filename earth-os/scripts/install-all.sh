#!/bin/bash

# EarthOS Installation Script
# Installs all dependencies for EarthOS services

echo "🌍 Installing EarthOS..."
echo ""

services=(
  "daemon"
  "shell"
  "appstore"
  "updater"
  "simulator"
  "earthling-cli"
  "earthling-server"
)

for service in "${services[@]}"; do
  echo "📦 Installing $service..."
  (cd "$service" && npm install)
  
  if [ $? -eq 0 ]; then
    echo "✅ $service installed successfully"
  else
    echo "❌ Failed to install $service"
    exit 1
  fi
  echo ""
done

echo "🎉 All services installed successfully!"
echo ""
echo "Next steps:"
echo "1. Start services in separate terminals:"
echo "   - daemon:         cd daemon && npm run dev"
echo "   - shell:          cd shell && npm run dev"
echo "   - appstore:       cd appstore && npm run dev"
echo "   - updater:        cd updater && npm run dev"
echo "   - simulator:      cd simulator && npm run dev"
echo "   - cloud server:   cd earthling-server && npm run dev"
echo ""
echo "2. Access dashboards:"
echo "   - Simulator: http://localhost:3006/dashboard"
echo "   - Cloud:     http://localhost:8080/dashboard"
echo ""
echo "3. Use the CLI:"
echo "   earthos health"
echo "   earthos device:register 'My Device'"
