# PowerShell script to set up Windows Task Scheduler to run Auto-PR daemon automatically
# This will start the daemon when you log in to Windows
# Usage: Run as Administrator: .\setup_windows_task.ps1

$ErrorActionPreference = "Stop"

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$daemonScript = Join-Path $scriptDir "start_auto_pr_daemon.ps1"
$taskName = "VeroField_AutoPR_Daemon"
$taskDescription = "Automatically starts the VeroField Auto-PR daemon on user login"

Write-Host "Setting up Windows Task Scheduler for Auto-PR daemon..." -ForegroundColor Green
Write-Host "  Task Name: $taskName" -ForegroundColor Gray
Write-Host "  Script: $daemonScript" -ForegroundColor Gray
Write-Host ""

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create action (run PowerShell script)
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$daemonScript`"" -WorkingDirectory $repoRoot

# Create trigger (on user logon)
$trigger = New-ScheduledTaskTrigger -AtLogOn

# Create principal (run as current user)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

# Create settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Register task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description $taskDescription | Out-Null
    Write-Host "Task scheduled successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The Auto-PR daemon will start automatically when you log in." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To test immediately, run:" -ForegroundColor Yellow
    Write-Host "  Start-ScheduledTask -TaskName `"$taskName`"" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To remove the scheduled task, run:" -ForegroundColor Yellow
    Write-Host "  Unregister-ScheduledTask -TaskName `"$taskName`" -Confirm:`$false" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: Failed to create scheduled task: $_" -ForegroundColor Red
    exit 1
}

