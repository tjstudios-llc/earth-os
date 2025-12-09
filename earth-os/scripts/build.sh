#!/bin/bash

# EarthOS Build Script
# Builds all services for production

set -e

echo "🏗️  Building EarthOS..."
echo ""

BUILD_DIR="build"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DIST_NAME="earthos-${TIMESTAMP}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Services to build
services=(
  "daemon"
  "shell"
  "appstore"
  "updater"
  "simulator"
  "earthling-cli"
  "earthling-server"
)

# Create build directory
mkdir -p "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}/${DIST_NAME}"

# Build each service
for service in "${services[@]}"; do
  echo -e "${BLUE}Building $service...${NC}"
  
  if [ ! -d "$service" ]; then
    echo -e "${RED}✗ Service directory not found: $service${NC}"
    exit 1
  fi
  
  cd "$service"
  
  # Check if TypeScript needs to be compiled
  if [ -f "tsconfig.json" ]; then
    npm run build 2>&1 || {
      echo -e "${RED}✗ Build failed for $service${NC}"
      exit 1
    }
    
    # Copy built files
    if [ -d "dist" ]; then
      mkdir -p "../${BUILD_DIR}/${DIST_NAME}/$service"
      cp -r dist/* "../${BUILD_DIR}/${DIST_NAME}/$service/" || true
      cp package.json "../${BUILD_DIR}/${DIST_NAME}/$service/" 2>/dev/null || true
      cp -r node_modules "../${BUILD_DIR}/${DIST_NAME}/$service/" 2>/dev/null || true
    fi
  fi
  
  cd ..
  echo -e "${GREEN}✓ $service built${NC}"
done

# Copy configuration files
echo ""
echo -e "${BLUE}Copying configuration files...${NC}"
cp -r docs "${BUILD_DIR}/${DIST_NAME}/" 2>/dev/null || true
cp README.md "${BUILD_DIR}/${DIST_NAME}/" 2>/dev/null || true
cp .env.example "${BUILD_DIR}/${DIST_NAME}/" 2>/dev/null || true
cp LICENSE "${BUILD_DIR}/${DIST_NAME}/" 2>/dev/null || true
cp tsconfig.json "${BUILD_DIR}/${DIST_NAME}/" 2>/dev/null || true

echo -e "${GREEN}✓ Configuration files copied${NC}"

# Create distribution archive
echo ""
echo -e "${BLUE}Creating distribution archive...${NC}"
cd "${BUILD_DIR}"
tar -czf "${DIST_NAME}.tar.gz" "${DIST_NAME}/" 2>/dev/null || {
  echo -e "${YELLOW}⚠ tar compression not available, creating zip instead${NC}"
  zip -r "${DIST_NAME}.zip" "${DIST_NAME}/" > /dev/null 2>&1 || true
}
cd ..

echo -e "${GREEN}✓ Archive created${NC}"

# Build summary
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Build artifacts:"
echo "  Directory: ${BUILD_DIR}/${DIST_NAME}/"
ls -lh "${BUILD_DIR}/${DIST_NAME}.tar.gz" 2>/dev/null || ls -lh "${BUILD_DIR}/${DIST_NAME}.zip" 2>/dev/null || echo "  (See build directory)"
echo ""
echo "Next steps:"
echo "  1. Review build output"
echo "  2. Run tests: npm test"
echo "  3. Deploy to production"
echo ""
echo "Deployment:"
echo "  - Extract archive on target server"
echo "  - Run: npm install --production"
echo "  - Run: npm start"
echo ""
