# Test Compliance Integration
# Tests: API server, queue processor, compliance checks

param(
    [string]$ApiUrl = "http://localhost:3001/api/v1",
    [string]$Token = ""
)

Write-Host "Testing Compliance Integration" -ForegroundColor Cyan
Write-Host ""

# Check if API server is running
Write-Host "1. Checking API server..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-WebRequest -Uri "$ApiUrl/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   API server is running" -ForegroundColor Green
} catch {
    Write-Host "   API server is not running" -ForegroundColor Red
    Write-Host "   Start it with: cd apps/api; npm run start:dev" -ForegroundColor Yellow
    exit 1
}

# Get token if not provided
if (-not $Token) {
    Write-Host "2. Getting authentication token..." -ForegroundColor Yellow
    $authData = Get-Content "$env:USERPROFILE\AppData\Local\Google\Chrome\User Data\Default\Local Storage\leveldb\*.log" -ErrorAction SilentlyContinue | Select-String "verofield_auth"
    if (-not $authData) {
        Write-Host "   Token not found in localStorage" -ForegroundColor Yellow
        Write-Host "   Please provide token: -Token 'your-token'" -ForegroundColor Yellow
        $Token = Read-Host "   Enter your JWT token"
    } else {
        Write-Host "   Token found" -ForegroundColor Green
        # Extract token (simplified - in production, parse JSON properly)
        Write-Host "   Note: Token extraction from localStorage not implemented" -ForegroundColor Yellow
        $Token = Read-Host "   Enter your JWT token"
    }
}

# Test: Get rules
Write-Host "3. Testing GET /compliance/rules..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/rules" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   Retrieved $($response.total) rules" -ForegroundColor Green
    Write-Host "   First rule: $($response.data[0].id) - $($response.data[0].name)" -ForegroundColor Gray
} catch {
    Write-Host "   Failed to get rules: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
}

# Test: Create compliance check
Write-Host "4. Testing POST /compliance/checks..." -ForegroundColor Yellow
try {
    $checkData = @{
        pr_number = 999
        commit_sha = "test-commit-sha-123"
        rule_id = "R01"
        status = "VIOLATION"
        severity = "WARNING"
        violation_message = "Test violation from integration test"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/checks" -Method POST -Headers $headers -Body $checkData -ErrorAction Stop
    Write-Host "   Compliance check queued successfully" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "   Failed to create compliance check: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
}

# Wait for queue to process
Write-Host "5. Waiting for queue to process (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test: Get compliance checks
Write-Host "6. Testing GET /compliance/checks..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/checks?prNumber=999" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   Retrieved $($response.total) compliance checks" -ForegroundColor Green
    if ($response.data.Count -gt 0) {
        Write-Host "   Latest check: $($response.data[0].violation_message)" -ForegroundColor Gray
        Write-Host "   Status: $($response.data[0].status), Severity: $($response.data[0].severity)" -ForegroundColor Gray
    } else {
        Write-Host "   No checks found (queue may still be processing)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Failed to get compliance checks: $($_.Exception.Message)" -ForegroundColor Red
}

# Test: Get compliance score
Write-Host "7. Testing GET /compliance/pr/999/score..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/pr/999/score" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   Compliance score: $($response.score)/100" -ForegroundColor Green
    Write-Host "   Can merge: $($response.can_merge)" -ForegroundColor Gray
    Write-Host "   Violations: BLOCK=$($response.block_count), OVERRIDE=$($response.override_count), WARNING=$($response.warning_count)" -ForegroundColor Gray
} catch {
    Write-Host "   Failed to get compliance score: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   (This is expected if no checks exist for PR 999)" -ForegroundColor Yellow
}

# Check queue status
Write-Host "8. Queue processor status..." -ForegroundColor Yellow
Write-Host "   Queue processor runs automatically in the background" -ForegroundColor Gray
Write-Host "   Check API logs for 'Queue processor started (database-based)' message" -ForegroundColor Gray

Write-Host ""
Write-Host "Integration test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check dashboard: http://localhost:5173/compliance" -ForegroundColor White
Write-Host "  2. Verify violations appear in Violations tab" -ForegroundColor White
Write-Host "  3. Test with a real PR to verify OPA integration" -ForegroundColor White
