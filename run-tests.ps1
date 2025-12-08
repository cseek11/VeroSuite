# VeroField Comprehensive Test Runner
# This script runs all tests for both backend and frontend

Write-Host "🧪 VeroField Comprehensive Test Suite" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "apps/api") -or -not (Test-Path "apps/web")) {
    Write-Host "❌ Error: Please run this script from the VeroField root directory" -ForegroundColor Red
    exit 1
}

# Function to run tests with error handling
function Run-Tests {
    param(
        [string]$Directory,
        [string]$TestCommand,
        [string]$Description
    )
    
    Write-Host "`n🔍 Running $Description..." -ForegroundColor Yellow
    Write-Host "Directory: $Directory" -ForegroundColor Gray
    Write-Host "Command: $TestCommand" -ForegroundColor Gray
    
    Push-Location $Directory
    
    try {
        $result = Invoke-Expression $TestCommand
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $Description completed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $Description failed with error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
}

# Initialize test results
$testResults = @{}

# Backend Tests
Write-Host "`n📦 Backend Testing" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta

# Install backend dependencies if needed
if (-not (Test-Path "apps/api/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location "apps/api"
    npm install
    Pop-Location
}

# Run backend unit tests
$testResults.BackendUnit = Run-Tests "apps/api" "npm run test:unit" "Backend Unit Tests"

# Run backend E2E tests
$testResults.BackendE2E = Run-Tests "apps/api" "npm run test:e2e" "Backend E2E Tests"

# Frontend Tests
Write-Host "`n🎨 Frontend Testing" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta

# Install frontend dependencies if needed
if (-not (Test-Path "apps/web/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location "apps/web"
    npm install
    Pop-Location
}

# Run frontend unit tests
$testResults.FrontendUnit = Run-Tests "apps/web" "npm run test:unit" "Frontend Unit Tests"

# Run frontend E2E tests (if Playwright is installed)
$testResults.FrontendE2E = Run-Tests "frontend" "npm run test:e2e" "Frontend E2E Tests"

# Generate test report
Write-Host "`n📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

$totalTests = $testResults.Count
$passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total Test Suites: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red

Write-Host "`nDetailed Results:" -ForegroundColor White
foreach ($test in $testResults.GetEnumerator()) {
    $status = if ($test.Value) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($test.Value) { "Green" } else { "Red" }
    Write-Host "  $($test.Key): $status" -ForegroundColor $color
}

# Overall result
if ($failedTests -eq 0) {
    Write-Host "`n🎉 All tests passed! VeroField is ready for production." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the errors above." -ForegroundColor Yellow
    exit 1
}


