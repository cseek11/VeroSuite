# Check Compliance Queue Status
# Verifies if queue processed the job and compliance check was created

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:DATABASE_URL = 'postgresql://...'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking Compliance Queue Status..." -ForegroundColor Cyan
Write-Host ""

# Check queue status
Write-Host "1. Queue Status:" -ForegroundColor Yellow
try {
    $queueQuery = @"
    SELECT 
        id,
        job_type,
        status,
        attempts,
        created_at,
        processed_at,
        error_message
    FROM compliance.write_queue
    ORDER BY created_at DESC
    LIMIT 5;
"@

    Write-Host "   Running query to check queue..." -ForegroundColor Gray
    
    # Try using psql if available
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlPath) {
        $queueResult = $queueQuery | psql $DatabaseUrl -t -A -F "|" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   Queue Jobs:" -ForegroundColor Green
            $queueResult | ForEach-Object {
                if ($_ -match '\|') {
                    $fields = $_ -split '\|'
                    Write-Host "     Job: $($fields[1]) | Status: $($fields[2]) | Attempts: $($fields[3])" -ForegroundColor White
                }
            }
        } else {
            Write-Host "   Could not query queue (psql error)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   psql not found. Install PostgreSQL client tools to check queue." -ForegroundColor Yellow
        Write-Host "   Or run this SQL manually:" -ForegroundColor Gray
        Write-Host $queueQuery -ForegroundColor Gray
    }
} catch {
    Write-Host "   Error checking queue: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check compliance checks
Write-Host "2. Compliance Checks:" -ForegroundColor Yellow
try {
    $checksQuery = @"
    SELECT 
        id,
        pr_number,
        rule_id,
        status,
        severity,
        violation_message,
        created_at
    FROM compliance.compliance_checks
    ORDER BY created_at DESC
    LIMIT 5;
"@

    if ($psqlPath) {
        $checksResult = $checksQuery | psql $DatabaseUrl -t -A -F "|" 2>&1
        if ($LASTEXITCODE -eq 0 -and $checksResult) {
            Write-Host "   Compliance Checks Found:" -ForegroundColor Green
            $checksResult | ForEach-Object {
                if ($_ -match '\|') {
                    $fields = $_ -split '\|'
                    Write-Host "     PR: $($fields[1]) | Rule: $($fields[2]) | Status: $($fields[3]) | Severity: $($fields[4])" -ForegroundColor White
                }
            }
        } else {
            Write-Host "   No compliance checks found yet" -ForegroundColor Yellow
            Write-Host "   (Queue may still be processing)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   psql not found. Run this SQL manually:" -ForegroundColor Yellow
        Write-Host $checksQuery -ForegroundColor Gray
    }
} catch {
    Write-Host "   Error checking compliance checks: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Troubleshooting:" -ForegroundColor Cyan
Write-Host "  • If queue status is 'pending': Wait 5-10 seconds" -ForegroundColor White
Write-Host "  • If queue status is 'processing': Job is being processed" -ForegroundColor White
Write-Host "  • If queue status is 'failed': Check error_message" -ForegroundColor White
Write-Host "  • If queue status is 'completed' but no check: Check API logs for errors" -ForegroundColor White
Write-Host "  • Check API server logs for queue processing messages" -ForegroundColor White

