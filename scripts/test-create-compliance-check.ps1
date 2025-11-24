# Test: Create Compliance Check
# This script logs in, gets a token, and creates a test compliance check

param(
    [string]$ApiUrl = "http://localhost:3001/api/v1",
    [string]$Email = "",
    [string]$Password = ""
)

Write-Host "Testing Compliance Check Creation" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get credentials if not provided
if (-not $Email) {
    $Email = Read-Host "Enter your email"
}
if (-not $Password) {
    $SecurePassword = Read-Host "Enter your password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Step 2: Authenticate
Write-Host "1. Authenticating..." -ForegroundColor Yellow
try {
    $authBody = @{
        email = $Email
        password = $Password
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "$ApiUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $authBody `
        -ErrorAction Stop

    $token = $authResponse.access_token
    $tenantId = $authResponse.user.tenantId

    if (-not $token) {
        Write-Host "   Authentication failed - no token received" -ForegroundColor Red
        exit 1
    }

    Write-Host "   Authenticated successfully" -ForegroundColor Green
    Write-Host "   Tenant ID: $tenantId" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "   Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Tip: Use Swagger UI instead:" -ForegroundColor Yellow
    Write-Host "  1. Open: http://localhost:3001/api/docs" -ForegroundColor White
    Write-Host "  2. Click 'Authorize' button" -ForegroundColor White
    Write-Host "  3. Enter credentials and test endpoints" -ForegroundColor White
    exit 1
}

# Step 3: Create test compliance check
Write-Host "2. Creating test compliance check..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$checkData = @{
    pr_number = 999
    commit_sha = "test-commit-sha-123"
    rule_id = "R01"
    status = "VIOLATION"
    severity = "WARNING"
    violation_message = "Test violation from PowerShell script"
    file_path = "test/file.ts"
    line_number = 42
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/checks" `
        -Method Post `
        -Headers $headers `
        -Body $checkData `
        -ErrorAction Stop

    Write-Host "   Compliance check queued successfully!" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
    Write-Host ""
    
    # Step 4: Wait for queue to process
    Write-Host "3. Waiting for queue to process (10 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    # Step 5: Verify check was created
    Write-Host "4. Verifying compliance check was created..." -ForegroundColor Yellow
    try {
        $checksResponse = Invoke-RestMethod -Uri "$ApiUrl/compliance/checks?prNumber=999" `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop

        if ($checksResponse.data.Count -gt 0) {
            Write-Host "   Compliance check found!" -ForegroundColor Green
            Write-Host "   ID: $($checksResponse.data[0].id)" -ForegroundColor Gray
            Write-Host "   Status: $($checksResponse.data[0].status)" -ForegroundColor Gray
            Write-Host "   Severity: $($checksResponse.data[0].severity)" -ForegroundColor Gray
            Write-Host "   Message: $($checksResponse.data[0].violation_message)" -ForegroundColor Gray
        } else {
            Write-Host "   No checks found yet (queue may still be processing)" -ForegroundColor Yellow
            Write-Host "   Wait a few more seconds and check again" -ForegroundColor Gray
        }
    } catch {
        Write-Host "   Could not verify check: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Test complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  • Check dashboard: http://localhost:5173/compliance" -ForegroundColor White
    Write-Host "  • View in Violations tab" -ForegroundColor White
    Write-Host "  • Check queue table: SELECT * FROM compliance.write_queue WHERE status = 'completed'" -ForegroundColor White

} catch {
    Write-Host "   Failed to create compliance check: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
    exit 1
}

