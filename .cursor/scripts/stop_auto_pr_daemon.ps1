# PowerShell script to stop the Auto-PR daemon
# Usage: .\stop_auto_pr_daemon.ps1

$ErrorActionPreference = "Stop"

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$pidFile = Join-Path $repoRoot ".cursor\cache\auto_pr_daemon.pid"

# Check if PID file exists
if (-not (Test-Path $pidFile)) {
    Write-Host "Auto-PR daemon is not running (no PID file found)" -ForegroundColor Yellow
    exit 0
}

# Read PID
$processId = Get-Content $pidFile

# Check if process exists
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue
if (-not $process) {
    Write-Host "Auto-PR daemon process not found (PID: $processId)" -ForegroundColor Yellow
    Write-Host "Removing stale PID file..." -ForegroundColor Yellow
    Remove-Item $pidFile -Force
    exit 0
}

# Stop process
Write-Host "Stopping Auto-PR daemon (PID: $processId)..." -ForegroundColor Yellow
Stop-Process -Id $processId -Force

# Wait a moment
Start-Sleep -Seconds 1

# Verify it's stopped
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "Failed to stop daemon. Try: Stop-Process -Id $processId -Force" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Auto-PR daemon stopped successfully!" -ForegroundColor Green
    Remove-Item $pidFile -Force
}

