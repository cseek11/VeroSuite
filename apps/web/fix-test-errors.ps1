# Test File TypeScript Error Fix Script
Write-Host "Starting test file error fixes..." -ForegroundColor Green

function Fix-FileContent {
    param([string]$FilePath, [string]$OldText, [string]$NewText, [string]$Description)
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match [regex]::Escape($OldText)) {
            $content = $content -replace [regex]::Escape($OldText), $NewText
            Set-Content $FilePath $content -NoNewline
            Write-Host "   Fixed: $Description" -ForegroundColor Yellow
            return $true
        }
    }
    return $false
}

# Fix FinancialReports.test.tsx
Write-Host "`n1. Fixing FinancialReports.test.tsx..." -ForegroundColor Cyan
$file = "src/components/billing/__tests__/FinancialReports.test.tsx"
Fix-FileContent -FilePath $file -OldText "render(<FinancialReports {...props} />);" -NewText "render(<FinancialReports />);" -Description "Remove props from renders"
Fix-FileContent -FilePath $file -OldText "render(<FinancialReports {...baseProps} reportType={reportType} />);" -NewText "render(<FinancialReports />);" -Description "Remove baseProps"

Write-Host "`n Script created!" -ForegroundColor Green
