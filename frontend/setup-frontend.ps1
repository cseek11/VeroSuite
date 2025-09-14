# VeroField Frontend Setup Script
Write-Host "Setting up VeroField frontend environment..." -ForegroundColor Green

# Create .env file if it doesn't exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    # Get Supabase credentials from user
    Write-Host "Please enter your Supabase configuration:" -ForegroundColor Cyan
    $supabaseUrl = Read-Host "Supabase URL (e.g., https://your-project.supabase.co)"
    $supabaseAnonKey = Read-Host "Supabase Anonymous Key"
    
    @"
# Supabase Configuration
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseAnonKey

# Application Configuration
VITE_APP_NAME=VeroPest Suite
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
"@ | Out-File -FilePath $envFile -Encoding UTF8
    
    Write-Host ".env file created successfully!" -ForegroundColor Green
} else {
    Write-Host ".env file already exists." -ForegroundColor Yellow
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Yellow
}

Write-Host "Frontend environment setup complete!" -ForegroundColor Green
Write-Host "You can now run 'npm run dev' to start the frontend development server." -ForegroundColor Cyan

