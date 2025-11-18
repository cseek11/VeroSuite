# PowerShell script to clean up Auto-PR pull requests
# Options: Close all, Merge all, or List them
# Usage: .\cleanup_auto_prs.ps1 [--CloseAll|--MergeAll|--List]

param(
    [switch]$CloseAll,
    [switch]$MergeAll,
    [switch]$List,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "Auto-PR Cleanup Script" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Get all open PRs with "auto-pr-" in the branch name
Write-Host "Fetching open Auto-PR pull requests..." -ForegroundColor Yellow

$prsJson = gh pr list --state open --json number,title,headRefName,state,url --limit 100
$prs = $prsJson | ConvertFrom-Json
$autoPrs = $prs | Where-Object { $_.headRefName -like "auto-pr-*" }

if ($autoPrs.Count -eq 0) {
    Write-Host "No Auto-PR pull requests found." -ForegroundColor Green
    exit 0
}

Write-Host "Found $($autoPrs.Count) Auto-PR pull requests:" -ForegroundColor Yellow
Write-Host ""

# List PRs
foreach ($pr in $autoPrs) {
    Write-Host "  PR #$($pr.number): $($pr.title)" -ForegroundColor Gray
    Write-Host "    Branch: $($pr.headRefName)" -ForegroundColor DarkGray
    Write-Host "    URL: $($pr.url)" -ForegroundColor DarkGray
    Write-Host ""
}

if ($List) {
    Write-Host "Use --CloseAll or --MergeAll to take action." -ForegroundColor Yellow
    exit 0
}

# Close all
if ($CloseAll) {
    Write-Host "Closing all Auto-PR pull requests..." -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($pr in $autoPrs) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would close PR #$($pr.number): $($pr.title)" -ForegroundColor Cyan
        } else {
            Write-Host "Closing PR #$($pr.number): $($pr.title)" -ForegroundColor Yellow
            gh pr close $pr.number --comment "Closed by cleanup script - too many small PRs created" 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ Closed" -ForegroundColor Green
            } else {
                Write-Host "  ✗ Failed" -ForegroundColor Red
            }
        }
    }
    
    if (-not $DryRun) {
        Write-Host ""
        Write-Host "Closed $($autoPrs.Count) Auto-PR pull requests." -ForegroundColor Green
    }
}

# Merge all
if ($MergeAll) {
    Write-Host "Merging all Auto-PR pull requests..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "WARNING: This will merge all Auto-PRs. Are you sure? (y/N)" -ForegroundColor Red
    $confirm = Read-Host
    
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
    
    foreach ($pr in $autoPrs) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would merge PR #$($pr.number): $($pr.title)" -ForegroundColor Cyan
        } else {
            Write-Host "Merging PR #$($pr.number): $($pr.title)" -ForegroundColor Yellow
            gh pr merge $pr.number --squash --delete-branch 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✓ Merged" -ForegroundColor Green
            } else {
                Write-Host "  ✗ Failed" -ForegroundColor Red
            }
        }
    }
    
    if (-not $DryRun) {
        Write-Host ""
        Write-Host "Merged $($autoPrs.Count) Auto-PR pull requests." -ForegroundColor Green
    }
}

if (-not $List -and -not $CloseAll -and -not $MergeAll) {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\cleanup_auto_prs.ps1 --List          # List all Auto-PRs" -ForegroundColor Gray
    Write-Host "  .\cleanup_auto_prs.ps1 --CloseAll      # Close all Auto-PRs" -ForegroundColor Gray
    Write-Host "  .\cleanup_auto_prs.ps1 --MergeAll      # Merge all Auto-PRs" -ForegroundColor Gray
    Write-Host "  .\cleanup_auto_prs.ps1 --CloseAll --DryRun  # Preview close action" -ForegroundColor Gray
}
