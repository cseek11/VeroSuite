# Verify Compliance Rules Seeded
# This script verifies that all 25 compliance rules were seeded correctly

$ErrorActionPreference = "Stop"

Write-Host "=== Compliance Rules Verification ===" -ForegroundColor Yellow
Write-Host ""

# Load DATABASE_URL from .env file
$envFile = "libs/common/prisma/.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $dbUrl = ($envContent | Select-String "DATABASE_URL=").ToString().Split("=", 2)[1]
    $env:DATABASE_URL = $dbUrl
    Write-Host "✓ Loaded DATABASE_URL from $envFile" -ForegroundColor Green
} else {
    Write-Host "✗ Could not find $envFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Connecting to database..." -ForegroundColor Yellow

# Use Prisma Studio or direct query
# For now, we'll use a Node.js script to query
$verifyScript = @"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    const count = await prisma.ruleDefinition.count();
    console.log(\`Total rules: \${count}\`);
    
    if (count === 25) {
      console.log('✅ SUCCESS: All 25 rules are seeded');
    } else {
      console.log(\`❌ ERROR: Expected 25 rules, found \${count}\`);
      process.exit(1);
    }
    
    const rules = await prisma.ruleDefinition.findMany({
      select: { id: true, name: true, tier: true },
      orderBy: { id: 'asc' }
    });
    
    console.log('\\nRules list:');
    rules.forEach(rule => {
      console.log(\`  \${rule.id}: \${rule.name} (\${rule.tier})\`);
    });
    
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
"@

$verifyScript | Out-File -FilePath "temp-verify.js" -Encoding UTF8

try {
    node temp-verify.js
    Remove-Item temp-verify.js -ErrorAction SilentlyContinue
} catch {
    Write-Host "❌ Error running verification: $_" -ForegroundColor Red
    Remove-Item temp-verify.js -ErrorAction SilentlyContinue
    exit 1
}

