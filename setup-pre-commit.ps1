# Setup Pre-commit Hooks for VeroField Rules 2.1
#
# This script sets up pre-commit hooks for OPA policy validation
#
# Usage: .\setup-pre-commit.ps1
#
# Created: 2025-11-23

Write-Host "🔧 Setting up pre-commit hooks..." -ForegroundColor Cyan

# Check if .git directory exists
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository. Please run this from the repository root." -ForegroundColor Red
    exit 1
}

# Check if pre-commit is installed
$preCommitInstalled = Get-Command pre-commit -ErrorAction SilentlyContinue

if ($preCommitInstalled) {
    Write-Host "✅ Pre-commit framework detected" -ForegroundColor Green
    
    # Install hooks
    Write-Host "📦 Installing pre-commit hooks..." -ForegroundColor Cyan
    pre-commit install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pre-commit hooks installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To test the hooks:" -ForegroundColor Yellow
        Write-Host "  pre-commit run --all-files" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Pre-commit installation had issues. Using manual hook instead." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Pre-commit framework not installed." -ForegroundColor Yellow
    Write-Host "   Installing pre-commit framework..." -ForegroundColor Cyan
    
    # Try to install pre-commit
    pip install pre-commit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pre-commit installed. Installing hooks..." -ForegroundColor Green
        pre-commit install
    } else {
        Write-Host "⚠️  Could not install pre-commit framework." -ForegroundColor Yellow
        Write-Host "   Using manual git hook instead." -ForegroundColor Yellow
    }
}

# Setup manual git hook (fallback)
Write-Host ""
Write-Host "📝 Setting up manual git hook..." -ForegroundColor Cyan

$hookPath = ".git/hooks/pre-commit"
$hookScript = ".git/hooks/pre-commit.ps1"

if (Test-Path $hookScript) {
    # Copy PowerShell hook to pre-commit
    Copy-Item $hookScript $hookPath -Force
    Write-Host "✅ Manual git hook installed at $hookPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  Hook script not found: $hookScript" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Pre-commit setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "The hooks will run automatically on 'git commit'." -ForegroundColor Cyan
Write-Host "To test manually:" -ForegroundColor Yellow
Write-Host "  .git/hooks/pre-commit" -ForegroundColor Yellow



