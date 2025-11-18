# PowerShell script to start the Auto-PR daemon in the background
# Usage: .\start_auto_pr_daemon.ps1

$ErrorActionPreference = "Stop"

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$daemonScript = Join-Path $scriptDir "auto_pr_daemon.py"
$pidFile = Join-Path $repoRoot ".cursor\cache\auto_pr_daemon.pid"
$logFile = Join-Path $repoRoot ".cursor\cache\auto_pr_daemon.log"

# Check if daemon is already running
if (Test-Path $pidFile) {
    $pid = Get-Content $pidFile
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Auto-PR daemon is already running (PID: $pid)" -ForegroundColor Yellow
        Write-Host "To stop it, run: Stop-Process -Id $pid" -ForegroundColor Yellow
        exit 0
    } else {
        # PID file exists but process is dead, remove stale PID file
        Remove-Item $pidFile -Force
    }
}

# Ensure cache directory exists
$cacheDir = Split-Path -Parent $pidFile
if (-not (Test-Path $cacheDir)) {
    New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null
}

# Change to repo root
Set-Location $repoRoot

# Start daemon in background
Write-Host "Starting Auto-PR daemon..." -ForegroundColor Green
Write-Host "  Script: $daemonScript" -ForegroundColor Gray
Write-Host "  Log file: $logFile" -ForegroundColor Gray
Write-Host "  PID file: $pidFile" -ForegroundColor Gray
Write-Host ""

# Start process
$errorLogFile = $logFile -replace "\.log$", ".error.log"
$process = Start-Process -FilePath "python" -ArgumentList $daemonScript, "--interval", "300" -PassThru -NoNewWindow -RedirectStandardOutput $logFile -RedirectStandardError $errorLogFile

# Save PID
$process.Id | Out-File -FilePath $pidFile -Encoding ASCII

Write-Host "Auto-PR daemon started successfully!" -ForegroundColor Green
Write-Host "  PID: $($process.Id)" -ForegroundColor Cyan
Write-Host "  Log: $logFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the daemon, run:" -ForegroundColor Yellow
Write-Host "  Stop-Process -Id $($process.Id)" -ForegroundColor Yellow
Write-Host "  or" -ForegroundColor Yellow
Write-Host "  .\stop_auto_pr_daemon.ps1" -ForegroundColor Yellow

