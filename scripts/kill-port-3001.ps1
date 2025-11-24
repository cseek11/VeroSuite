# Kill process using port 3001
# Usage: .\scripts\kill-port-3001.ps1

Write-Host "Finding process using port 3001..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

if ($connections) {
    foreach ($conn in $connections) {
        $pid = $conn.OwningProcess
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        
        if ($proc) {
            Write-Host "Found process:" -ForegroundColor Cyan
            Write-Host "  PID: $pid" -ForegroundColor White
            Write-Host "  Name: $($proc.ProcessName)" -ForegroundColor White
            Write-Host "  Path: $($proc.Path)" -ForegroundColor Gray
            
            Write-Host ""
            Write-Host "Stopping process $pid..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $pid -Force
                Write-Host "✓ Process $pid stopped successfully" -ForegroundColor Green
            } catch {
                Write-Host "✗ Error stopping process: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    Write-Host ""
    Write-Host "Waiting 2 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    $check = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
    if (-not $check) {
        Write-Host "✓ Port 3001 is now free!" -ForegroundColor Green
    } else {
        Write-Host "⚠ Port 3001 is still in use" -ForegroundColor Red
        Write-Host "You may need to run this script as Administrator" -ForegroundColor Yellow
    }
} else {
    Write-Host "No process found on port 3001" -ForegroundColor Green
    Write-Host "Port is already free!" -ForegroundColor Green
}
