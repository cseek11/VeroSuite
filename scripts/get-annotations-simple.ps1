# Simple script to get workflow annotations - non-interactive
$env:GH_PAGER = "cat"
$env:GIT_PAGER = "cat"

# Get latest workflow run
Write-Host "Getting latest workflow run..." -ForegroundColor Cyan
$run = gh run list --branch phase2-backend-migration --limit 1 --json databaseId,workflowName,status,conclusion,url 2>&1 | ConvertFrom-Json

if (-not $run) {
    Write-Host "No workflow runs found" -ForegroundColor Yellow
    exit 0
}

Write-Host "Run: $($run.workflowName) - $($run.status) - $($run.conclusion)" -ForegroundColor $(if ($run.conclusion -eq "failure") { "Red" } else { "Green" })
Write-Host "URL: $($run.url)" -ForegroundColor Cyan

if ($run.conclusion -ne "failure") {
    Write-Host "`nNo failures to check!" -ForegroundColor Green
    exit 0
}

# Get jobs for this run
Write-Host "`nGetting jobs..." -ForegroundColor Cyan
$jobs = gh api repos/cseek11/VeroSuite/actions/runs/$($run.databaseId)/jobs 2>&1 | ConvertFrom-Json

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: $jobs" -ForegroundColor Red
    exit 1
}

$failedJobs = $jobs.jobs | Where-Object {$_.conclusion -eq "failure"}
Write-Host "Failed jobs: $($failedJobs.Count)" -ForegroundColor $(if ($failedJobs.Count -gt 0) { "Red" } else { "Green" })

if ($failedJobs.Count -eq 0) {
    Write-Host "No failed jobs found" -ForegroundColor Yellow
    exit 0
}

# Check for annotations
Write-Host "`nChecking for annotations..." -ForegroundColor Cyan
$allAnnotations = @()

foreach ($job in $failedJobs) {
    Write-Host "`nJob: $($job.name)" -ForegroundColor Yellow
    
    # Get check run ID from job
    $checkRunId = $job.id
    
    try {
        $annotations = gh api repos/cseek11/VeroSuite/check-runs/$checkRunId/annotations 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0 -and $annotations) {
            $failures = $annotations | Where-Object {$_.annotation_level -eq "failure"}
            
            if ($failures.Count -gt 0) {
                Write-Host "  Found $($failures.Count) failure annotations" -ForegroundColor Red
                foreach ($failure in $failures) {
                    Write-Host "    $($failure.path):$($failure.start_line) - $($failure.title)" -ForegroundColor Red
                    $allAnnotations += $failure
                }
            } else {
                Write-Host "  No failure annotations" -ForegroundColor Gray
            }
        } else {
            Write-Host "  No annotations available" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Yellow
    }
}

if ($allAnnotations.Count -eq 0) {
    Write-Host "`nNo failure annotations found" -ForegroundColor Yellow
    Write-Host "Workflows failed but no annotations were created" -ForegroundColor Gray
    Write-Host "Check the workflow logs at: $($run.url)" -ForegroundColor Cyan
} else {
    Write-Host "`nTotal failure annotations: $($allAnnotations.Count)" -ForegroundColor Red
}




