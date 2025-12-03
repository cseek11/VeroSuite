# Diagnostic script to identify MODULE_NOT_FOUND errors
# Run this to check for common issues

$ErrorActionPreference = "Stop"

Write-Host "=== Module Error Diagnostic ===" -ForegroundColor Yellow
Write-Host ""

# Check 1: Prisma Client
Write-Host "1. Checking Prisma Client..." -ForegroundColor Cyan
$prismaClientPath = "node_modules\@prisma\client"
if (Test-Path $prismaClientPath) {
    Write-Host "   ✓ @prisma/client exists" -ForegroundColor Green
    
    # Check if compliance models are in Prisma client
    $indexFile = "$prismaClientPath\index.d.ts"
    if (Test-Path $indexFile) {
        $content = Get-Content $indexFile -Raw
        if ($content -match "RuleDefinition|ComplianceCheck") {
            Write-Host "   ✓ Compliance models found in Prisma client" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Compliance models NOT found in Prisma client" -ForegroundColor Red
            Write-Host "   → Run: cd libs/common/prisma && npx prisma generate" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ✗ @prisma/client missing" -ForegroundColor Red
    Write-Host "   → Run: cd libs/common/prisma && npx prisma generate" -ForegroundColor Yellow
}

Write-Host ""

# Check 2: Node modules
Write-Host "2. Checking node_modules..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ node_modules missing" -ForegroundColor Red
    Write-Host "   → Run: npm install" -ForegroundColor Yellow
}

Write-Host ""

# Check 3: Compliance module files
Write-Host "3. Checking compliance module files..." -ForegroundColor Cyan
$files = @(
    "apps/api/src/compliance/compliance.module.ts",
    "apps/api/src/compliance/compliance.service.ts",
    "apps/api/src/compliance/compliance.controller.ts",
    "apps/api/src/compliance/dto/rule-definition.dto.ts",
    "apps/api/src/compliance/dto/compliance-check.dto.ts",
    "apps/api/src/compliance/dto/compliance-score.dto.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file MISSING" -ForegroundColor Red
    }
}

Write-Host ""

# Check 4: Common module
Write-Host "4. Checking CommonModule..." -ForegroundColor Cyan
if (Test-Path "apps/api/src/common/common.module.ts") {
    Write-Host "   ✓ CommonModule exists" -ForegroundColor Green
    
    # Check if DatabaseService is exported
    $content = Get-Content "apps/api/src/common/common.module.ts" -Raw
    if ($content -match "DatabaseService") {
        Write-Host "   ✓ DatabaseService exported" -ForegroundColor Green
    } else {
        Write-Host "   ✗ DatabaseService not found in CommonModule" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ CommonModule missing" -ForegroundColor Red
}

Write-Host ""

# Check 5: TypeScript compilation
Write-Host "5. Testing TypeScript compilation..." -ForegroundColor Cyan
cd apps/api
try {
    $tscOutput = npx tsc --noEmit 2>&1 | Out-String
    if ($tscOutput -match "error TS") {
        Write-Host "   ✗ TypeScript errors found:" -ForegroundColor Red
        $tscOutput | Select-String "error TS" | ForEach-Object {
            Write-Host "     $_" -ForegroundColor Red
        }
    } else {
        Write-Host "   ✓ No TypeScript errors" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠ Could not run TypeScript compiler" -ForegroundColor Yellow
}

cd ../..

Write-Host ""
Write-Host "=== Diagnostic Complete ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "If issues found, try:" -ForegroundColor Cyan
Write-Host "  1. Regenerate Prisma client: cd libs/common/prisma && npx prisma generate" -ForegroundColor White
Write-Host "  2. Install dependencies: npm install" -ForegroundColor White
Write-Host "  3. Rebuild: cd apps/api && npm run build" -ForegroundColor White



