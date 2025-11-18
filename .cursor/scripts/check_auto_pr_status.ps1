# PowerShell script to check Auto-PR daemon status
# Usage: .\check_auto_pr_status.ps1

$ErrorActionPreference = "Stop"

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$pidFile = Join-Path $repoRoot ".cursor\cache\auto_pr_daemon.pid"
$logFile = Join-Path $repoRoot ".cursor\cache\auto_pr_daemon.log"
$stateFile = Join-Path $repoRoot ".cursor\cache\auto_pr_state.json"

Write-Host "Auto-PR Daemon Status" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Check if daemon is running
if (Test-Path $pidFile) {
    $processId = Get-Content $pidFile
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Status: " -NoNewline
        Write-Host "RUNNING" -ForegroundColor Green
        Write-Host "  PID: $processId" -ForegroundColor Gray
        Write-Host "  Started: $($process.StartTime)" -ForegroundColor Gray
        Write-Host "  CPU Time: $($process.CPU)" -ForegroundColor Gray
        Write-Host "  Memory: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
    } else {
        Write-Host "Status: " -NoNewline
        Write-Host "NOT RUNNING (stale PID file)" -ForegroundColor Yellow
        Write-Host "  PID file exists but process not found" -ForegroundColor Gray
    }
} else {
    Write-Host "Status: " -NoNewline
    Write-Host "NOT RUNNING" -ForegroundColor Red
    Write-Host "  No PID file found" -ForegroundColor Gray
}

Write-Host ""

# Check state file
if (Test-Path $stateFile) {
    $state = Get-Content $stateFile | ConvertFrom-Json
    $trackedFiles = $state.tracked_files
    $fileCount = if ($trackedFiles) { ($trackedFiles | Get-Member -MemberType NoteProperty).Count } else { 0 }
    
    Write-Host "Tracked Files: $fileCount" -ForegroundColor Cyan
    if ($fileCount -gt 0) {
        Write-Host "  Files waiting for PR creation:" -ForegroundColor Yellow
        $trackedFiles.PSObject.Properties | ForEach-Object {
            $file = $_.Name
            $data = $_.Value
            Write-Host "    - $file" -ForegroundColor Gray
        }
    }
    
    if ($state.last_change_time) {
        Write-Host "  Last change: $($state.last_change_time)" -ForegroundColor Gray
    }
    if ($state.first_change_time) {
        Write-Host "  First change: $($state.first_change_time)" -ForegroundColor Gray
    }
} else {
    Write-Host "Tracked Files: 0 (no state file)" -ForegroundColor Gray
}

Write-Host ""

# Check log file
if (Test-Path $logFile) {
    $logSize = (Get-Item $logFile).Length
    Write-Host "Log File: $logFile" -ForegroundColor Cyan
    Write-Host "  Size: $([math]::Round($logSize / 1KB, 2)) KB" -ForegroundColor Gray
    
    # Show last few lines
    Write-Host "  Last 5 lines:" -ForegroundColor Gray
    Get-Content $logFile -Tail 5 | ForEach-Object {
        Write-Host "    $_" -ForegroundColor DarkGray
    }
} else {
    Write-Host "Log File: Not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  Start:  .\start_auto_pr_daemon.ps1" -ForegroundColor Yellow
Write-Host "  Stop:   .\stop_auto_pr_daemon.ps1" -ForegroundColor Yellow
Write-Host "  Check:  python .cursor\scripts\monitor_changes.py --check" -ForegroundColor Yellow
Write-Host "  Force:  python .cursor\scripts\monitor_changes.py --check --force" -ForegroundColor Yellow

