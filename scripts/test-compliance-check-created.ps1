# Test if Compliance Check was Created
# Checks queue status and compliance checks table

param(
    [string]$ApiUrl = "http://localhost:3001/api/v1",
    [string]$Token = ""
)

Write-Host "Testing Compliance Check Creation" -ForegroundColor Cyan
Write-Host ""

if (-not $Token) {
    Write-Host "Getting token..." -ForegroundColor Yellow
    $Token = Read-Host "Enter your JWT token (or press Enter to skip API test)"
}

$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

# Test: Get compliance checks
Write-Host "1. Testing GET /api/v1/compliance/checks..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/compliance/checks" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "   Success!" -ForegroundColor Green
    Write-Host "   Total checks: $($response.total)" -ForegroundColor White
    
    if ($response.data.Count -gt 0) {
        Write-Host "   Checks found:" -ForegroundColor Green
        $response.data | ForEach-Object {
            Write-Host "     • PR #$($_.pr_number) | Rule: $($_.rule_id) | Status: $($_.status) | Severity: $($_.severity)" -ForegroundColor Gray
            Write-Host "       Message: $($_.violation_message)" -ForegroundColor Gray
            Write-Host "       Created: $($_.created_at)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   No checks found" -ForegroundColor Yellow
        Write-Host "   Possible reasons:" -ForegroundColor Yellow
        Write-Host "     • Queue hasn't processed yet (wait 5-10 seconds)" -ForegroundColor Gray
        Write-Host "     • Tenant ID mismatch" -ForegroundColor Gray
        Write-Host "     • Error during processing" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "2. Check API server logs for:" -ForegroundColor Yellow
Write-Host "   • 'Queue processor started (database-based)'" -ForegroundColor Gray
Write-Host "   • Any error messages during processing" -ForegroundColor Gray
Write-Host "   • 'Compliance check queued' messages" -ForegroundColor Gray

Write-Host ""
Write-Host "3. Check database directly:" -ForegroundColor Yellow
Write-Host "   Run: .\scripts\check-compliance-queue-status.ps1" -ForegroundColor Gray
Write-Host "   Or check manually:" -ForegroundColor Gray
Write-Host "     SELECT * FROM compliance.write_queue ORDER BY created_at DESC LIMIT 5;" -ForegroundColor Gray
Write-Host "     SELECT * FROM compliance.compliance_checks ORDER BY created_at DESC LIMIT 5;" -ForegroundColor Gray

