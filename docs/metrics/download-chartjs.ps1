# Download Chart.js for local use
# Usage: .\download-chartjs.ps1

$chartJsUrl = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
$outputPath = "lib/chart.umd.min.js"

Write-Host "Downloading Chart.js 4.4.0..." -ForegroundColor Yellow

try {
    # Create lib directory if it doesn't exist
    if (-not (Test-Path "lib")) {
        New-Item -ItemType Directory -Path "lib" | Out-Null
    }
    
    # Download Chart.js
    Invoke-WebRequest -Uri $chartJsUrl -OutFile $outputPath
    
    if (Test-Path $outputPath) {
        $fileSize = (Get-Item $outputPath).Length / 1KB
        Write-Host "[OK] Chart.js downloaded successfully!" -ForegroundColor Green
        Write-Host "  Location: $outputPath" -ForegroundColor Gray
        Write-Host "  Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] Download failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] Error downloading Chart.js: $_" -ForegroundColor Red
    Write-Host "  You can manually download from: $chartJsUrl" -ForegroundColor Yellow
    exit 1
}
