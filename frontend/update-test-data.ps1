# Update Test Data Script for VeroField
Write-Host "Updating test data for VeroField..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "scripts/update-test-data.js")) {
    Write-Host "Error: update-test-data.js not found. Please run this from the frontend directory." -ForegroundColor Red
    exit 1
}

# Check if SUPABASE_SERVICE_ROLE_KEY is set
if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set." -ForegroundColor Red
    Write-Host "Please set it with your Supabase service role key." -ForegroundColor Yellow
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules/@supabase/supabase-js")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install @supabase/supabase-js
}

# Run the update script
Write-Host "Running test data update..." -ForegroundColor Cyan
node scripts/update-test-data.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "Test data update completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Test data update failed!" -ForegroundColor Red
}











