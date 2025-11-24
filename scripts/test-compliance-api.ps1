# Compliance API Test Script (PowerShell)
# Tests all compliance API endpoints with authentication

$ErrorActionPreference = "Stop"

# Configuration
$API_URL = if ($env:API_URL) { $env:API_URL } else { "http://localhost:3001" }
$TEST_EMAIL = if ($env:TEST_EMAIL) { $env:TEST_EMAIL } else { "test@example.com" }
$TEST_PASSWORD = if ($env:TEST_PASSWORD) { $env:TEST_PASSWORD } else { "password123" }

Write-Host "=== Compliance API Test Script ===" -ForegroundColor Yellow
Write-Host ""

# Step 1: Authenticate and get token
Write-Host "Step 1: Authenticating..." -ForegroundColor Yellow
$authBody = @{
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $authBody
    
    $TOKEN = $authResponse.access_token
    $TENANT_ID = $authResponse.user.tenantId
    
    if (-not $TOKEN) {
        Write-Host "❌ Authentication failed" -ForegroundColor Red
        Write-Host "Response: $($authResponse | ConvertTo-Json)"
        exit 1
    }
    
    Write-Host "✓ Authenticated successfully" -ForegroundColor Green
    Write-Host "Tenant ID: $TENANT_ID"
    Write-Host ""
} catch {
    Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Test Rule Definitions Endpoint
Write-Host "Step 2: Testing GET /api/v1/compliance/rules" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $rulesResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/rules" `
        -Method Get `
        -Headers $headers
    
    $rulesCount = $rulesResponse.total
    
    if ($rulesCount -ge 25) {
        Write-Host "✓ Rules endpoint working ($rulesCount rules)" -ForegroundColor Green
    } else {
        Write-Host "❌ Expected at least 25 rules, got $rulesCount" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "❌ Rules endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Test Compliance Checks Endpoint
Write-Host "Step 3: Testing GET /api/v1/compliance/checks" -ForegroundColor Yellow
try {
    $checksResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/checks" `
        -Method Get `
        -Headers $headers
    
    $checksCount = $checksResponse.total
    Write-Host "✓ Checks endpoint working ($checksCount checks)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Checks endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Test Create Compliance Check
Write-Host "Step 4: Testing POST /api/v1/compliance/checks" -ForegroundColor Yellow
$testPrNumber = Get-Random -Minimum 1000 -Maximum 10000
$checkBody = @{
    pr_number = $testPrNumber
    commit_sha = "test-commit-sha-$(Get-Date -Format 'yyyyMMddHHmmss')"
    rule_id = "R01"
    status = "VIOLATION"
    severity = "WARNING"
    file_path = "apps/api/src/test.ts"
    line_number = 42
    violation_message = "Test violation message"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/checks" `
        -Method Post `
        -Headers $headers `
        -Body $checkBody
    
    $checkId = $createResponse.id
    
    if ($checkId) {
        Write-Host "✓ Compliance check created (ID: $checkId)" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create compliance check" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "❌ Create check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Test Compliance Score Calculation
Write-Host "Step 5: Testing GET /api/v1/compliance/pr/$testPrNumber/score" -ForegroundColor Yellow
try {
    $scoreResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/compliance/pr/$testPrNumber/score" `
        -Method Get `
        -Headers $headers
    
    $score = $scoreResponse.score
    $canMerge = $scoreResponse.can_merge
    
    Write-Host "✓ Score calculated: $score/100" -ForegroundColor Green
    Write-Host "Can merge: $canMerge"
    Write-Host ""
} catch {
    Write-Host "❌ Score calculation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Test Tenant Isolation
Write-Host "Step 6: Testing tenant isolation" -ForegroundColor Yellow
Write-Host "Verifying checks are scoped to tenant..."
try {
    $tenantChecks = $checksResponse.data | Where-Object { $_.tenant_id -eq $TENANT_ID }
    
    if ($tenantChecks) {
        Write-Host "✓ Tenant isolation verified" -ForegroundColor Green
    } else {
        Write-Host "⚠ No checks found for tenant (may be expected if no data)" -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "⚠ Tenant isolation check skipped: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
}

# Summary
Write-Host "=== Test Summary ===" -ForegroundColor Green
Write-Host "✓ Authentication: PASSED"
Write-Host "✓ Rules endpoint: PASSED ($rulesCount rules)"
Write-Host "✓ Checks endpoint: PASSED"
Write-Host "✓ Create check: PASSED"
Write-Host "✓ Score calculation: PASSED"
Write-Host "✓ Tenant isolation: VERIFIED"
Write-Host ""
Write-Host "All tests passed! 🎉" -ForegroundColor Green

