# OPA Binary Finder - PowerShell Script Wrapper
#
# Quick access to OPA binary for PowerShell scripts and agents.
# Usage: . .cursor/scripts/find-opa.ps1
#        & $OPA_BIN test policies/ tests/ -v
#
# Last Updated: 2025-12-04

# Find OPA binary using Python helper
$OPA_BIN = python .cursor/scripts/find-opa.py 2>&1 | Select-Object -First 1

if (-not $OPA_BIN -or -not (Test-Path $OPA_BIN)) {
    Write-Host "❌ OPA binary not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions:" -ForegroundColor Yellow
    Write-Host "  1. Install OPA in services/opa/bin/opa.exe"
    Write-Host "  2. Set OPA_BINARY environment variable"
    Write-Host "  3. Install OPA system-wide and add to PATH"
    Write-Host ""
    Write-Host "📖 See: docs/compliance-reports/OPA-INSTALLATION-NOTES.md"
    exit 1
}

# Verify it works
$versionOutput = & $OPA_BIN version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  OPA binary found at $OPA_BIN but 'opa version' failed" -ForegroundColor Yellow
    exit 1
}

# Export for use in scripts
$env:OPA_BIN = $OPA_BIN

# Success - $OPA_BIN is now available
Write-Host "✅ OPA found: $OPA_BIN" -ForegroundColor Green


