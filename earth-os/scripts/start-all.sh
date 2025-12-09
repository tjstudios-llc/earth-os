#!/bin/bash

# Start all EarthOS services
# Run this script to start all services in the background

echo "🌍 Starting EarthOS services..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to start a service
start_service() {
  local service=$1
  local port=$2
  
  echo -e "${BLUE}Starting $service on port $port...${NC}"
  cd "$service"
  npm run dev > "../logs/$service.log" 2>&1 &
  local pid=$!
  echo $pid > "../logs/$service.pid"
  cd ..
  
  # Wait a moment and check if process is still running
  sleep 2
  if kill -0 $pid 2>/dev/null; then
    echo -e "${GREEN}✓ $service started (PID: $pid)${NC}"
  else
    echo -e "${RED}✗ Failed to start $service${NC}"
    return 1
  fi
}

# Create logs directory
mkdir -p logs

# Start all services
start_service "daemon" "3002"
start_service "shell" "3003"
start_service "appstore" "3004"
start_service "updater" "3005"
start_service "simulator" "3006"
start_service "earthling-server" "8080"

echo ""
echo -e "${GREEN}🎉 All services started!${NC}"
echo ""
echo "Services running on:"
echo "  - Daemon:         http://localhost:3002"
echo "  - Shell:          http://localhost:3003"
echo "  - App Store:      http://localhost:3004"
echo "  - Updater:        http://localhost:3005"
echo "  - Simulator:      http://localhost:3006/dashboard"
echo "  - Cloud Server:   http://localhost:8080/dashboard"
echo ""
echo "To stop all services, run: ./scripts/stop-all.sh"
echo "To view logs, check: ./logs/"
