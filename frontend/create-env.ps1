# Create .env file for VeroSuite Frontend
Write-Host "Creating .env file for VeroSuite Frontend..." -ForegroundColor Green

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host ".env file already exists. Do you want to overwrite it? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "y") {
        Write-Host "Operation cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Please enter your Supabase configuration:" -ForegroundColor Cyan
$supabaseUrl = Read-Host "Supabase URL (e.g., https://your-project.supabase.co)"
$supabaseAnonKey = Read-Host "Supabase Anonymous Key"

# Create the .env content
$envContent = @"
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
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "You can now start the frontend with: npm run dev" -ForegroundColor Cyan


