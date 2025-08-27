# VeroSuite Development Setup Script
Write-Host "Setting up VeroSuite development environment..." -ForegroundColor Green

# Create .env file if it doesn't exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/verosuite"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
"@ | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host ".env file created successfully!" -ForegroundColor Green
} else {
    Write-Host ".env file already exists." -ForegroundColor Yellow
}

# Note: PostgreSQL should be running locally or via your preferred method
Write-Host "Please ensure PostgreSQL is running on localhost:5432" -ForegroundColor Yellow
Write-Host "You can start it manually or use your preferred database setup method" -ForegroundColor Yellow

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

# Push database schema
Write-Host "Pushing database schema..." -ForegroundColor Yellow
npm run db:push

Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host "You can now run 'npm run start' to start the application." -ForegroundColor Cyan

