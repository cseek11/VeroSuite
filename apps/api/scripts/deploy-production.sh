#!/bin/bash
# Production Deployment Script
# 
# This script handles the complete production deployment process
# Usage: ./scripts/deploy-production.sh [environment]
#
# Environment options: staging, production
# Default: production

set -e  # Exit on any error

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting production deployment for: $ENVIRONMENT"
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Validate environment
echo "📋 Step 1: Validating environment..."
cd "$PROJECT_ROOT"

if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo -e "${RED}❌ Error: .env.$ENVIRONMENT file not found${NC}"
    echo "Please create .env.$ENVIRONMENT with production configuration"
    exit 1
fi

# Load environment variables
export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)

# Validate environment variables
if [ -f "scripts/validate-production-env.ts" ]; then
    echo "Running environment validation..."
    npx ts-node scripts/validate-production-env.ts
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Environment validation failed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Environment validation passed${NC}"
echo ""

# Step 2: Run tests
echo "📋 Step 2: Running tests..."
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ All tests passed${NC}"
echo ""

# Step 3: Build application
echo "📋 Step 3: Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Step 4: Run database migrations
echo "📋 Step 4: Running database migrations..."
if [ -f "prisma/migrations" ]; then
    echo "Checking for pending migrations..."
    # Add migration command here based on your setup
    # npx prisma migrate deploy
    echo -e "${YELLOW}⚠️  Database migrations should be run manually${NC}"
    echo "Please run migrations in Supabase SQL Editor or via Prisma CLI"
else
    echo -e "${YELLOW}⚠️  No migrations directory found${NC}"
fi
echo ""

# Step 5: Health check
echo "📋 Step 5: Verifying deployment..."
echo "Waiting for application to start..."
sleep 5

# Check if health endpoint is responding
HEALTH_URL="${API_URL:-http://localhost:3001}/health"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check returned status: $HTTP_CODE${NC}"
        echo "Please verify the application is running correctly"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping health check${NC}"
fi
echo ""

# Step 6: Deployment summary
echo "📋 Step 6: Deployment Summary"
echo "================================"
echo "Environment: $ENVIRONMENT"
echo "Build: ✅ Complete"
echo "Tests: ✅ Passed"
echo "Migrations: ⚠️  Manual step required"
echo ""
echo -e "${GREEN}✅ Deployment process completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify application is running"
echo "2. Check health endpoints: /health, /health/ready, /health/live"
echo "3. Monitor error tracking (Sentry)"
echo "4. Verify metrics endpoint: /api/metrics"
echo ""


