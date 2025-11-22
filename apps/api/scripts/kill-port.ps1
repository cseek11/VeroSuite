# Kill Process on Port Script
# Usage: .\scripts\kill-port.ps1 -Port 3001

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "🔍 Finding process using port $Port..." -ForegroundColor Yellow

# Find process using the port
$connection = netstat -ano | findstr ":$Port" | findstr "LISTENING"

if ($connection) {
    $pid = ($connection -split '\s+')[-1]
    Write-Host "✅ Found process with PID: $pid" -ForegroundColor Green
    
    # Get process info
    try {
        $process = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "   Process Name: $($process.ProcessName)" -ForegroundColor Cyan
        Write-Host "   Process Path: $($process.Path)" -ForegroundColor Cyan
        
        # Ask for confirmation
        $confirm = Read-Host "   Kill this process? (Y/N)"
        
        if ($confirm -eq 'Y' -or $confirm -eq 'y') {
            Stop-Process -Id $pid -Force
            Write-Host "✅ Process $pid killed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Process not killed" -ForegroundColor Red
        }
    } catch {
        Write-Host "⚠️  Process $pid not found (may have already ended)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ No process found using port $Port" -ForegroundColor Red
}

