# Get Workflow Failure Annotations
# Fetches all failure annotations from GitHub check runs for a specific commit

param(
    [string]$CommitSha = "",
    [string]$Branch = "phase2-backend-migration"
)

if ([string]::IsNullOrEmpty($CommitSha)) {
    $CommitSha = git rev-parse HEAD
    Write-Host "Using current HEAD: $CommitSha"
}

Write-Host "Fetching check runs for commit: $CommitSha" -ForegroundColor Cyan

# Get all check runs for the commit
$checkRunsResponse = gh api repos/cseek11/VeroSuite/commits/$CommitSha/check-runs --paginate
$checkRunsJson = $checkRunsResponse | ConvertFrom-Json
$checkRuns = $checkRunsJson.check_runs

Write-Host "`nTotal check runs: $($checkRuns.Count)" -ForegroundColor Yellow

# Filter for failed runs
$failedRuns = $checkRuns | Where-Object {$_.conclusion -eq "failure"}
Write-Host "Failed check runs: $($failedRuns.Count)" -ForegroundColor $(if ($failedRuns.Count -gt 0) { "Red" } else { "Green" })

if ($failedRuns.Count -eq 0) {
    Write-Host "`nNo failed check runs found!" -ForegroundColor Green
    exit 0
}

# Collect all failure annotations
$allFailures = @()

foreach ($run in $failedRuns) {
    Write-Host "`nProcessing: $($run.name) (ID: $($run.id))" -ForegroundColor Cyan
    
    try {
        $annotationsResponse = gh api repos/cseek11/VeroSuite/check-runs/$($run.id)/annotations --paginate
        $annotations = $annotationsResponse | ConvertFrom-Json
        
        $failures = $annotations | Where-Object {$_.annotation_level -eq "failure"}
        
        if ($failures.Count -gt 0) {
            Write-Host "  Found $($failures.Count) failure annotations" -ForegroundColor Red
            
            foreach ($failure in $failures) {
                $allFailures += [PSCustomObject]@{
                    CheckRun = $run.name
                    Path = $failure.path
                    Line = $failure.start_line
                    Title = $failure.title
                    Message = $failure.message
                }
            }
        } else {
            Write-Host "  No failure annotations (may have failed for other reasons)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Error fetching annotations: $_" -ForegroundColor Red
    }
}

# Display summary
Write-Host "`n" + "="*80 -ForegroundColor Cyan
Write-Host "FAILURE ANNOTATIONS SUMMARY" -ForegroundColor Red
Write-Host "="*80 -ForegroundColor Cyan

if ($allFailures.Count -eq 0) {
    Write-Host "No failure annotations found (check runs failed but no annotations were created)" -ForegroundColor Yellow
} else {
    Write-Host "`nTotal failure annotations: $($allFailures.Count)" -ForegroundColor Red
    
    # Group by file
    $byFile = $allFailures | Group-Object Path
    Write-Host "`nFailures by file:" -ForegroundColor Yellow
    foreach ($group in $byFile) {
        Write-Host "  $($group.Name): $($group.Count) failure(s)" -ForegroundColor White
        foreach ($item in $group.Group) {
            Write-Host "    Line $($item.Line): $($item.Title)" -ForegroundColor Gray
        }
    }
    
    # Display detailed list
    Write-Host "`nDetailed List:" -ForegroundColor Yellow
    $allFailures | Format-Table -AutoSize
}

# Export to file
$outputFile = "workflow-failures-$CommitSha.Substring(0,7).txt"
$allFailures | Format-List | Out-File $outputFile
Write-Host "`nExported to: $outputFile" -ForegroundColor Green

return $allFailures

