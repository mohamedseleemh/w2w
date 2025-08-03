#!/bin/bash

# KYCtrust Auto Deployment Script for Vercel
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting KYCtrust deployment process..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    print_success "All dependencies are installed"
}

# Check Node.js version
check_node_version() {
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    print_success "Node.js version check passed: $(node -v)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    if npm run test --silent; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but continuing deployment"
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    # Clean previous builds
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    # Build
    npm run build
    
    if [ -d "dist" ]; then
        print_success "Build completed successfully"
    else
        print_error "Build failed - dist directory not found"
        exit 1
    fi
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Check if .env.example exists
    if [ -f ".env.example" ]; then
        if [ ! -f ".env" ]; then
            cp .env.example .env
            print_warning "Created .env file from .env.example. Please configure your environment variables."
        fi
    fi
    
    # Check required environment variables
    REQUIRED_VARS=(
        "VITE_API_URL"
        "DATABASE_URL" 
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
    )
    
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -ne 0 ]; then
        print_warning "Missing environment variables: ${MISSING_VARS[*]}"
        print_warning "Please set these variables in Vercel dashboard or .env file"
    else
        print_success "Environment variables check passed"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Login to Vercel if not already logged in
    if ! vercel whoami &> /dev/null; then
        print_status "Please login to Vercel..."
        vercel login
    fi
    
    # Deploy
    if [ "$1" = "production" ]; then
        print_status "Deploying to production..."
        vercel --prod --yes
    else
        print_status "Deploying to preview..."
        vercel --yes
    fi
    
    print_success "Deployment completed!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if [ -f "database/schema.sql" ] && [ -f "database/seed.sql" ]; then
        print_status "Database files found. Please run these manually on your database:"
        print_status "1. Run database/schema.sql to create tables"
        print_status "2. Run database/seed.sql to insert default data"
    fi
    
    print_success "Database setup instructions provided"
}

# Generate sitemap
generate_sitemap() {
    print_status "Generating sitemap..."
    
    # Create a simple sitemap
    cat > public/sitemap.xml << EOL
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://kyctrust.vercel.app/</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://kyctrust.vercel.app/services</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://kyctrust.vercel.app/admin</loc>
        <lastmod>$(date -u +%Y-%m-%d)</lastmod>
        <priority>0.3</priority>
    </url>
</urlset>
EOL
    
    print_success "Sitemap generated"
}

# Create robots.txt
create_robots() {
    print_status "Creating robots.txt..."
    
    cat > public/robots.txt << EOL
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://kyctrust.vercel.app/sitemap.xml
EOL
    
    print_success "robots.txt created"
}

# Main deployment function
main() {
    print_status "🎯 KYCtrust Deployment Script v2.0"
    print_status "======================================="
    
    # Parse arguments
    DEPLOY_ENV="preview"
    SKIP_TESTS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --production|-p)
                DEPLOY_ENV="production"
                shift
                ;;
            --skip-tests|-s)
                SKIP_TESTS=true
                shift
                ;;
            --help|-h)
                echo "KYCtrust Deployment Script"
                echo ""
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  -p, --production    Deploy to production"
                echo "  -s, --skip-tests    Skip running tests"
                echo "  -h, --help          Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_dependencies
    check_node_version
    setup_environment
    install_dependencies
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    fi
    
    generate_sitemap
    create_robots
    build_project
    setup_database
    deploy_to_vercel "$DEPLOY_ENV"
    
    print_success "🎉 Deployment completed successfully!"
    print_status "======================================="
    
    if [ "$DEPLOY_ENV" = "production" ]; then
        print_success "🌐 Your app is live at: https://kyctrust.vercel.app"
    else
        print_success "🔍 Your preview is available (check Vercel output above)"
    fi
    
    print_status "📊 Next steps:"
    print_status "1. Configure your environment variables in Vercel dashboard"
    print_status "2. Set up your database using the SQL files in database/"
    print_status "3. Configure your domain (if production)"
    print_status "4. Set up monitoring and analytics"
    
    print_success "Happy coding! 🚀"
}

# Run main function with all arguments
main "$@"
