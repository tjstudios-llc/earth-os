#!/bin/bash

# Stop all EarthOS services

echo "🌍 Stopping EarthOS services..."
echo ""

# Function to stop a service
stop_service() {
  local service=$1
  
  if [ -f "logs/$service.pid" ]; then
    local pid=$(cat "logs/$service.pid")
    if kill -0 $pid 2>/dev/null; then
      kill $pid
      echo "✓ Stopped $service (PID: $pid)"
      rm "logs/$service.pid"
    fi
  fi
}

# Stop all services
stop_service "daemon"
stop_service "shell"
stop_service "appstore"
stop_service "updater"
stop_service "simulator"
stop_service "earthling-server"

echo ""
echo "✅ All services stopped"
