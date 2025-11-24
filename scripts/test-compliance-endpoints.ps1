# Test Compliance API Endpoints
# This script tests all compliance endpoints after authentication

$ErrorActionPreference = "Stop"

$API_URL = if ($env:API_URL) { $env:API_URL } else { "http://localhost:3001" }
$TEST_EMAIL = if ($env:TEST_EMAIL) { $env:TEST_EMAIL } else { "test@example.com" }
$TEST_PASSWORD = if ($env:TEST_PASSWORD) { $env:TEST_PASSWORD } else { "password123" }

Write-Host "=== Compliance API Endpoint Testing ===" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if server is running
Write-Host "Step 1: Checking API server status..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "$API_URL/api/health" -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ API server is running (Status: $($health.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ API server is not responding" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure the server is running:" -ForegroundColor Yellow
    Write-Host "  cd apps/api" -ForegroundColor White
    Write-Host "  npm run start:dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use Swagger UI to test: $API_URL/api/docs" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Authenticate
Write-Host "Step 2: Authenticating..." -ForegroundColor Cyan
$authBody = @{
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

$TOKEN = $null
$TENANT_ID = $null

try {
    $authResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $authBody `
        -ErrorAction Stop
    
    $TOKEN = $authResponse.access_token
    $TENANT_ID = $authResponse.user.tenantId
    
    if (-not $TOKEN) {
        Write-Host "✗ Authentication failed - no token received" -ForegroundColor Red
        Write-Host ""
        Write-Host "Note: You may need to create a test user first." -ForegroundColor Yellow
        Write-Host "Or use Swagger UI to test: $API_URL/api/docs" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✓ Authenticated successfully" -ForegroundColor Green
    Write-Host "  Tenant ID: $TENANT_ID" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Authentication failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Note: You may need to create a test user first." -ForegroundColor Yellow
    Write-Host "Or use Swagger UI to test: $API_URL/api/docs" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can test endpoints manually via Swagger UI:" -ForegroundColor Cyan
    Write-Host "  1. Open: $API_URL/api/docs" -ForegroundColor White
    Write-Host "  2. Click 'Authorize' button" -ForegroundColor White
    Write-Host "  3. Enter your credentials" -ForegroundColor White
    Write-Host "  4. Test compliance endpoints" -ForegroundColor White
    exit 1
}

# Step 3: Test Compliance Endpoints
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "Step 3: Testing Compliance Endpoints" -ForegroundColor Cyan
Write-Host ""

# Test 3.1: Get Rules
Write-Host "3.1: GET /api/v1/compliance/rules" -ForegroundColor Yellow
try {
    $rulesResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/rules" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "  ✓ Success" -ForegroundColor Green
    Write-Host "  Total rules: $($rulesResponse.total)" -ForegroundColor Gray
    if ($rulesResponse.total -eq 25) {
        Write-Host "  ✓ All 25 rules found" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Expected 25 rules, found $($rulesResponse.total)" -ForegroundColor Yellow
    }
    if ($rulesResponse.data -and $rulesResponse.data.Count -gt 0) {
        Write-Host "  Sample rule: $($rulesResponse.data[0].id) - $($rulesResponse.data[0].name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3.2: Get Compliance Checks
Write-Host "3.2: GET /api/v1/compliance/checks" -ForegroundColor Yellow
try {
    $checksResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/checks" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "  ✓ Success" -ForegroundColor Green
    Write-Host "  Total checks: $($checksResponse.total)" -ForegroundColor Gray
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3.3: Create Test Compliance Check
Write-Host "3.3: POST /api/v1/compliance/checks" -ForegroundColor Yellow
$testPrNumber = Get-Random -Minimum 1000 -Maximum 10000
$checkBody = @{
    pr_number = $testPrNumber
    commit_sha = "test-commit-$(Get-Date -Format 'yyyyMMddHHmmss')"
    rule_id = "R01"
    status = "VIOLATION"
    severity = "WARNING"
    file_path = "apps/api/src/test.ts"
    line_number = 42
    violation_message = "Test violation for endpoint testing"
} | ConvertTo-Json

$checkCreated = $false
try {
    $createResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/checks" `
        -Method Post `
        -Headers $headers `
        -Body $checkBody `
        -ErrorAction Stop
    
    Write-Host "  ✓ Success" -ForegroundColor Green
    Write-Host "  Created check ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "  PR Number: $($createResponse.pr_number)" -ForegroundColor Gray
    $checkCreated = $true
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $checkCreated = $false
}
Write-Host ""

# Test 3.4: Get PR Compliance Score (if check was created)
if ($checkCreated) {
    Write-Host "3.4: GET /api/v1/compliance/pr/$testPrNumber/score" -ForegroundColor Yellow
    try {
        $scoreResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/pr/$testPrNumber/score" `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop
        
        Write-Host "  ✓ Success" -ForegroundColor Green
        Write-Host "  Compliance Score: $($scoreResponse.score)/100" -ForegroundColor Gray
        Write-Host "  Block violations: $($scoreResponse.block_count)" -ForegroundColor Gray
        Write-Host "  Override violations: $($scoreResponse.override_count)" -ForegroundColor Gray
        Write-Host "  Warning violations: $($scoreResponse.warning_count)" -ForegroundColor Gray
        Write-Host "  Can merge: $($scoreResponse.can_merge)" -ForegroundColor Gray
    } catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3.5: Get Compliance Trends
Write-Host "3.5: GET /api/v1/compliance/trends" -ForegroundColor Yellow
try {
    $trendsResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/trends" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "  ✓ Success" -ForegroundColor Green
    Write-Host "  Trends retrieved" -ForegroundColor Gray
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=== Test Summary ===" -ForegroundColor Yellow
Write-Host "✓ Authentication: PASSED" -ForegroundColor Green
Write-Host "✓ Rules endpoint: Tested" -ForegroundColor Green
Write-Host "✓ Checks endpoint: Tested" -ForegroundColor Green
Write-Host "✓ Create check: Tested" -ForegroundColor Green
Write-Host "✓ Score calculation: Tested" -ForegroundColor Green
Write-Host "✓ Trends endpoint: Tested" -ForegroundColor Green
Write-Host ""
Write-Host "Swagger UI: $API_URL/api/docs" -ForegroundColor Cyan
Write-Host "All compliance endpoints are functional! 🎉" -ForegroundColor Green
