#!/bin/bash

# VeroSuite V4 Migration Script
# This script safely migrates from old layout to V4 layout

set -e  # Exit on any error

echo "🐜 VeroSuite V4 Migration Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create backup
create_backup() {
    print_status "Creating backup..."
    
    # Create backup branch
    BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$BACKUP_BRANCH"
    git add .
    git commit -m "Backup before V4 migration - $(date)"
    
    print_success "Backup created: $BACKUP_BRANCH"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the frontend directory."
        exit 1
    fi
    
    # Check if git is available
    if ! command_exists git; then
        print_error "Git is not installed. Please install git first."
        exit 1
    fi
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        print_error "Not in a git repository. Please initialize git first."
        exit 1
    fi
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "There are uncommitted changes. Please commit or stash them first."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    print_success "Prerequisites check passed"
}

# Function to rename legacy components
rename_legacy_components() {
    print_status "Renaming legacy components..."
    
    # Create legacy directory if it doesn't exist
    mkdir -p src/routes/legacy
    
    # Rename old dashboard components
    if [ -f "src/routes/Dashboard.tsx" ]; then
        mv src/routes/Dashboard.tsx src/routes/legacy/LegacyDashboard.tsx
        print_success "Renamed Dashboard.tsx → LegacyDashboard.tsx"
    fi
    
    if [ -f "src/routes/EnhancedDashboard.tsx" ]; then
        mv src/routes/EnhancedDashboard.tsx src/routes/legacy/LegacyEnhancedDashboard.tsx
        print_success "Renamed EnhancedDashboard.tsx → LegacyEnhancedDashboard.tsx"
    fi
    
    if [ -f "src/routes/ResizableDashboard.tsx" ]; then
        mv src/routes/ResizableDashboard.tsx src/routes/legacy/LegacyResizableDashboard.tsx
        print_success "Renamed ResizableDashboard.tsx → LegacyResizableDashboard.tsx"
    fi
    
    # Rename old layout components
    if [ -f "src/components/LayoutWrapper.tsx" ]; then
        mv src/components/LayoutWrapper.tsx src/components/legacy/LayoutWrapper.tsx
        print_success "Moved LayoutWrapper.tsx to legacy directory"
    fi
    
    if [ -f "src/components/DashboardSidebar.tsx" ]; then
        mv src/components/DashboardSidebar.tsx src/components/legacy/DashboardSidebar.tsx
        print_success "Moved DashboardSidebar.tsx to legacy directory"
    fi
    
    if [ -f "src/components/DashboardHeader.tsx" ]; then
        mv src/components/DashboardHeader.tsx src/components/legacy/DashboardHeader.tsx
        print_success "Moved DashboardHeader.tsx to legacy directory"
    fi
    
    print_success "Legacy components renamed"
}

# Function to update route configuration
update_routes() {
    print_status "Updating route configuration..."
    
    # This would require manual editing of App.tsx
    print_warning "Please manually update src/routes/App.tsx with the new route configuration"
    print_warning "See MIGRATION_STRATEGY.md for the exact changes needed"
    
    # Create a backup of the current App.tsx
    cp src/routes/App.tsx src/routes/App.tsx.backup
    print_success "Created backup of App.tsx"
}

# Function to update environment variables
update_environment() {
    print_status "Updating environment configuration..."
    
    # Copy example environment file if .env doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Created .env from env.example"
        else
            print_warning "No .env file found and no env.example available"
        fi
    fi
    
    # Update .env with V4 feature flags
    if [ -f ".env" ]; then
        # Add V4 feature flags if they don't exist
        if ! grep -q "VITE_V4_LAYOUT" .env; then
            echo "" >> .env
            echo "# V4 Migration Feature Flags" >> .env
            echo "VITE_V4_LAYOUT=true" >> .env
            echo "VITE_V4_DASHBOARD=true" >> .env
            echo "VITE_V4_SCHEDULER=true" >> .env
            echo "VITE_UNIFIED_SCHEDULER=false" >> .env
            echo "VITE_V4_NAVIGATION=true" >> .env
            echo "VITE_V4_ROLLOUT_PERCENTAGE=100" >> .env
            echo "VITE_EMERGENCY_ROLLBACK=false" >> .env
            print_success "Added V4 feature flags to .env"
        fi
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if command_exists npm; then
        npm install
        print_success "Dependencies installed with npm"
    elif command_exists yarn; then
        yarn install
        print_success "Dependencies installed with yarn"
    else
        print_error "Neither npm nor yarn is available"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if command_exists npm; then
        npm test -- --watchAll=false --passWithNoTests
        print_success "Tests completed"
    elif command_exists yarn; then
        yarn test --watchAll=false --passWithNoTests
        print_success "Tests completed"
    else
        print_warning "Skipping tests (no package manager found)"
    fi
}

# Function to build the project
build_project() {
    print_status "Building project..."
    
    if command_exists npm; then
        npm run build
        print_success "Build completed"
    elif command_exists yarn; then
        yarn build
        print_success "Build completed"
    else
        print_error "Cannot build project (no package manager found)"
        exit 1
    fi
}

# Function to show post-migration instructions
show_post_migration_instructions() {
    echo
    echo "🎉 Migration completed successfully!"
    echo "=================================="
    echo
    echo "Next steps:"
    echo "1. Review the changes in git: git diff"
    echo "2. Test the application: npm run dev"
    echo "3. Update any import statements that reference old component names"
    echo "4. Remove legacy components when you're confident everything works"
    echo
    echo "Emergency rollback:"
    echo "If you need to rollback, run: git checkout backup-YYYYMMDD-HHMMSS"
    echo
    echo "Feature flags:"
    echo "You can control V4 features using environment variables in .env"
    echo "Set VITE_EMERGENCY_ROLLBACK=true to disable all V4 features"
    echo
    echo "Documentation:"
    echo "See MIGRATION_STRATEGY.md for detailed migration information"
}

# Main migration function
main() {
    echo "Starting V4 migration..."
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Create backup
    create_backup
    
    # Rename legacy components
    rename_legacy_components
    
    # Update routes (manual step)
    update_routes
    
    # Update environment
    update_environment
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build project
    build_project
    
    # Show instructions
    show_post_migration_instructions
}

# Check if script is being sourced or run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi





