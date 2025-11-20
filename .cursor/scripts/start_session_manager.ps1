# PowerShell script to start Auto-PR Session Manager
# This can be run manually or scheduled to run on Cursor startup

$ErrorActionPreference = "Continue"

$scriptPath = Join-Path $PSScriptRoot "start_session_manager.py"
$pythonPath = "python"

Write-Host "🚀 Starting Auto-PR Session Manager..." -ForegroundColor Green

try {
    # Start the session manager
    $process = Start-Process -FilePath $pythonPath -ArgumentList $scriptPath -NoNewWindow -PassThru
    
    Write-Host "✅ Session Manager started (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "   Session will be tracked automatically" -ForegroundColor Gray
    Write-Host "   Monitoring daemon is running" -ForegroundColor Gray
    Write-Host "   Session will complete when Cursor closes" -ForegroundColor Gray
    
    # Store PID for shutdown
    $pidFile = Join-Path $PSScriptRoot ".session_manager.pid"
    $process.Id | Out-File -FilePath $pidFile -Encoding ASCII
    
    return $process
} catch {
    Write-Host "❌ Failed to start Session Manager: $_" -ForegroundColor Red
    exit 1
}







