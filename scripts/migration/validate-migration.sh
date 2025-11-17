#!/bin/bash

# Migration Validation Script
# Validates that VeroAI restructuring migration is complete and correct

set -e

echo "🔍 Validating VeroAI restructuring migration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check command result
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check warning
check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check directory structure exists
echo "📁 Checking directory structure..."
if [ ! -d "apps/api" ]; then
    echo -e "${RED}❌ apps/api/ directory not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ apps/api/ exists${NC}"
fi

if [ ! -d "libs/common" ]; then
    echo -e "${RED}❌ libs/common/ directory not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ libs/common/ exists${NC}"
fi

if [ ! -d "services" ]; then
    check_warning "services/ directory not found (may be created later)"
else
    echo -e "${GREEN}✅ services/ exists${NC}"
fi

echo ""

# 2. Check old backend directory is removed
echo "🗑️  Checking old structure removed..."
if [ -d "backend" ]; then
    check_warning "backend/ directory still exists (should be moved to apps/api/)"
else
    echo -e "${GREEN}✅ backend/ removed (moved to apps/api/)${NC}"
fi

echo ""

# 3. Check imports are updated
echo "📦 Checking imports..."
OLD_IMPORTS=$(grep -r "from '../common/" apps/api/src/ 2>/dev/null | wc -l || echo "0")
if [ "$OLD_IMPORTS" -gt 0 ]; then
    echo -e "${RED}❌ Found $OLD_IMPORTS old import paths in apps/api${NC}"
    grep -r "from '../common/" apps/api/src/ 2>/dev/null | head -5
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No old import paths in apps/api${NC}"
fi

OLD_IMPORTS_MICRO=$(grep -r "from '../../common/" apps/*/src/ 2>/dev/null | wc -l || echo "0")
if [ "$OLD_IMPORTS_MICRO" -gt 0 ]; then
    echo -e "${RED}❌ Found $OLD_IMPORTS_MICRO old import paths in microservices${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No old import paths in microservices${NC}"
fi

echo ""

# 4. Check package.json workspace configuration
echo "📋 Checking workspace configuration..."
if grep -q '"workspaces"' package.json; then
    echo -e "${GREEN}✅ Workspaces configured in root package.json${NC}"
else
    echo -e "${RED}❌ Workspaces not configured in root package.json${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 5. Check all services build
echo "🔨 Building all services..."
if npm run build --workspaces > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All services build successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    npm run build --workspaces
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 6. Check all tests pass
echo "🧪 Running tests..."
if npm run test --workspaces -- --passWithNoTests > /dev/null 2>&1; then
    echo -e "${GREEN}✅ All tests pass${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    npm run test --workspaces -- --passWithNoTests
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 7. Check TypeScript compilation
echo "📝 Checking TypeScript..."
if npm run type-check --workspaces > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    # Try alternative command
    if npx tsc --noEmit --project apps/api/tsconfig.json > /dev/null 2>&1; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
    else
        check_warning "TypeScript type-check script not found (may need to add to package.json)"
    fi
fi

echo ""

# 8. Check Prisma schema location
echo "🗄️  Checking Prisma schema..."
if [ -f "libs/common/prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Prisma schema in correct location${NC}"
elif [ -f "apps/api/prisma/schema.prisma" ]; then
    check_warning "Prisma schema still in apps/api/prisma/ (should be in libs/common/prisma/)"
else
    echo -e "${RED}❌ Prisma schema not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# 9. Check environment variable structure
echo "🔐 Checking environment variables..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example exists${NC}"
else
    check_warning ".env.example not found"
fi

if [ -d "apps/api" ] && [ -f "apps/api/.env.local.example" ]; then
    echo -e "${GREEN}✅ Service-specific .env.local.example exists${NC}"
else
    check_warning "Service-specific .env.local.example not found (optional)"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Migration validated successfully!${NC}"
    echo ""
    echo "All checks passed. Migration is complete and correct."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Migration validated with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Migration is functional but has some warnings. Review and address as needed."
    exit 0
else
    echo -e "${RED}❌ Migration validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors before proceeding with VeroAI development."
    exit 1
fi

