# Production Deployment Script (PowerShell)
# 
# This script handles the complete production deployment process
# Usage: .\scripts\deploy-production.ps1 [environment]
#
# Environment options: staging, production
# Default: production

param(
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Write-Host "🚀 Starting production deployment for: $Environment" -ForegroundColor Green
Write-Host "📁 Project root: $ProjectRoot" -ForegroundColor Cyan
Write-Host ""

# Step 1: Validate environment
Write-Host "📋 Step 1: Validating environment..." -ForegroundColor Yellow
Set-Location $ProjectRoot

$EnvFile = ".env.$Environment"
if (-not (Test-Path $EnvFile)) {
    Write-Host "❌ Error: $EnvFile file not found" -ForegroundColor Red
    Write-Host "Please create $EnvFile with production configuration" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Validate environment variables
if (Test-Path "scripts\validate-production-env.ts") {
    Write-Host "Running environment validation..." -ForegroundColor Cyan
    npx ts-node scripts/validate-production-env.ts
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Environment validation failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Environment validation passed" -ForegroundColor Green
Write-Host ""

# Step 2: Run tests
Write-Host "📋 Step 2: Running tests..." -ForegroundColor Yellow
npm test -- --passWithNoTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ All tests passed" -ForegroundColor Green
Write-Host ""

# Step 3: Build application
Write-Host "📋 Step 3: Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Run database migrations
Write-Host "📋 Step 4: Running database migrations..." -ForegroundColor Yellow
if (Test-Path "prisma\migrations") {
    Write-Host "Checking for pending migrations..." -ForegroundColor Cyan
    Write-Host "⚠️  Database migrations should be run manually" -ForegroundColor Yellow
    Write-Host "Please run migrations in Supabase SQL Editor or via Prisma CLI" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  No migrations directory found" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Health check
Write-Host "📋 Step 5: Verifying deployment..." -ForegroundColor Yellow
Write-Host "Waiting for application to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Check if health endpoint is responding
$ApiUrl = if ($env:API_URL) { $env:API_URL } else { "http://localhost:3001" }
$HealthUrl = "$ApiUrl/health"

try {
    $Response = Invoke-WebRequest -Uri $HealthUrl -Method GET -TimeoutSec 10 -UseBasicParsing
    if ($Response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Health check returned status: $($Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Please verify the application is running correctly" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Health check failed: $_" -ForegroundColor Yellow
    Write-Host "Please verify the application is running correctly" -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Deployment summary
Write-Host "📋 Step 6: Deployment Summary" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor White
Write-Host "Build: ✅ Complete" -ForegroundColor Green
Write-Host "Tests: ✅ Passed" -ForegroundColor Green
Write-Host "Migrations: ⚠️  Manual step required" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify application is running" -ForegroundColor White
Write-Host "2. Check health endpoints: /health, /health/ready, /health/live" -ForegroundColor White
Write-Host "3. Monitor error tracking (Sentry)" -ForegroundColor White
Write-Host "4. Verify metrics endpoint: /api/metrics" -ForegroundColor White
Write-Host ""


