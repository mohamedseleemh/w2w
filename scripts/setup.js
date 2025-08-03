#!/usr/bin/env node

/**
 * KYCtrust Auto Setup Script
 * Automatically configures the development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

class KYCTrustSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.requiredDirs = [
      'src/components/admin/VisualEditor',
      'src/services/api',
      'src/hooks',
      'src/types',
      'public/assets/images',
      'public/assets/icons',
      'database',
      'scripts',
      'docs'
    ];
    this.requiredFiles = [
      '.env.example',
      '.gitignore',
      'README.md',
      'package.json'
    ];
  }

  async run() {
    log('\n🚀 KYCtrust Auto Setup Script v2.0', 'cyan');
    log('=====================================', 'cyan');
    
    try {
      await this.checkPrerequisites();
      await this.createDirectories();
      await this.createEnvironmentFile();
      await this.setupGitIgnore();
      await this.installDependencies();
      await this.setupDatabase();
      await this.createDocumentation();
      await this.setupVercel();
      await this.runPostSetup();
      
      logSuccess('\n🎉 Setup completed successfully!');
      this.printNextSteps();
    } catch (error) {
      logError(`\nSetup failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    logInfo('Checking prerequisites...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ is required. Current version: ${nodeVersion}`);
    }
    
    logSuccess(`Node.js version check passed: ${nodeVersion}`);
    
    // Check if npm is available
    try {
      execSync('npm --version', { stdio: 'ignore' });
      logSuccess('npm is available');
    } catch (error) {
      throw new Error('npm is not installed or not available');
    }
  }

  async createDirectories() {
    logInfo('Creating project directories...');
    
    for (const dir of this.requiredDirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        logSuccess(`Created directory: ${dir}`);
      } else {
        logInfo(`Directory already exists: ${dir}`);
      }
    }
  }

  async createEnvironmentFile() {
    logInfo('Setting up environment configuration...');
    
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    const envPath = path.join(this.projectRoot, '.env');
    
    const envContent = `# KYCtrust Environment Configuration

# Application
VITE_APP_NAME=KYCtrust
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=development
VITE_API_URL=http://localhost:5173/api

# Database (Supabase)
DATABASE_URL=your_database_url_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:5173

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# WhatsApp Integration
WHATSAPP_API_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER=+966501234567

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Processing (Stripe)
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_TAG_MANAGER_ID=GTM_CONTAINER_ID

# Monitoring
SENTRY_DSN=your_sentry_dsn_here

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
JWT_SECRET=your_jwt_secret_here

# External APIs
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
CRYPTO_API_KEY=your_crypto_api_key
`;

    // Create .env.example
    fs.writeFileSync(envExamplePath, envContent);
    logSuccess('Created .env.example');
    
    // Create .env if it doesn't exist
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, envContent);
      logSuccess('Created .env file');
      logWarning('Please update the environment variables in .env file');
    } else {
      logInfo('.env file already exists');
    }
  }

  async setupGitIgnore() {
    logInfo('Setting up .gitignore...');
    
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Vercel
.vercel

# Database
*.sqlite
*.db

# Backup files
backup/
*.backup
*.bak

# Image uploads
uploads/
public/uploads/

# Cache
.cache/

# Local development
local/
*.local

# Testing
coverage/
.nyc_output/

# TypeScript
*.tsbuildinfo

# Cypress
cypress/videos/
cypress/screenshots/
`;

    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, gitignoreContent);
      logSuccess('Created .gitignore');
    } else {
      logInfo('.gitignore already exists');
    }
  }

  async installDependencies() {
    logInfo('Installing additional dependencies...');
    
    const devDependencies = [
      '@types/bcryptjs',
      '@types/jsonwebtoken',
      '@types/nodemailer',
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
      'react-dnd',
      'react-dnd-html5-backend',
      '@supabase/supabase-js',
      'react-hot-toast',
      'lucide-react'
    ];

    try {
      // Check if packages are already installed
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const installedDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };

        const missingDeps = devDependencies.filter(dep => !installedDeps[dep]);
        
        if (missingDeps.length > 0) {
          logInfo(`Installing missing dependencies: ${missingDeps.join(', ')}`);
          execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
          logSuccess('Additional dependencies installed');
        } else {
          logSuccess('All dependencies are already installed');
        }
      }
    } catch (error) {
      logWarning(`Could not install additional dependencies: ${error.message}`);
    }
  }

  async setupDatabase() {
    logInfo('Setting up database files...');
    
    // Database files should already exist from the file creation above
    const schemaPath = path.join(this.projectRoot, 'database/schema.sql');
    const seedPath = path.join(this.projectRoot, 'database/seed.sql');
    
    if (fs.existsSync(schemaPath) && fs.existsSync(seedPath)) {
      logSuccess('Database files are ready');
      logInfo('To setup your database:');
      logInfo('1. Create a Supabase project at https://supabase.com');
      logInfo('2. Run database/schema.sql in your Supabase SQL editor');
      logInfo('3. Run database/seed.sql to insert default data');
      logInfo('4. Update your .env file with Supabase credentials');
    } else {
      logWarning('Database files not found. Please check the database/ directory');
    }
  }

  async createDocumentation() {
    logInfo('Creating documentation...');
    
    const readmePath = path.join(this.projectRoot, 'README.md');
    const readmeContent = `# KYCtrust - Digital Financial Services Platform

## Overview

KYCtrust is a comprehensive digital financial services platform with an advanced admin panel and visual page builder. It provides secure, reliable financial services with real-time management capabilities.

## Features

### 🎨 Visual Page Builder
- Drag & drop interface
- Pre-built components
- Custom themes
- Real-time preview
- Mobile responsive design

### 🛡️ Security & Reliability
- Bank-grade encryption
- Secure authentication
- Data protection
- Activity logging

### 📊 Admin Dashboard
- Real-time analytics
- Order management
- Customer management
- Payment tracking
- Report generation

### 🌐 Multi-language Support
- Arabic and English
- RTL/LTR support
- Localized content

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd kyctrust-platform
\`\`\`

2. Run the auto-setup script:
\`\`\`bash
node scripts/setup.js
\`\`\`

3. Install dependencies:
\`\`\`bash
npm install
\`\`\`

4. Configure environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

5. Setup database:
- Create a Supabase project
- Run \`database/schema.sql\` in Supabase SQL editor
- Run \`database/seed.sql\` for default data

6. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Run deployment script:
\`\`\`bash
# For preview deployment
./scripts/deploy.sh

# For production deployment
./scripts/deploy.sh --production
\`\`\`

### Manual Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Deploy the \`dist/\` directory to your hosting provider

## Configuration

### Environment Variables

See \`.env.example\` for all available configuration options:

- **Database**: Supabase configuration
- **Authentication**: JWT and session settings
- **Email**: SMTP configuration for notifications
- **WhatsApp**: API integration for customer communication
- **Payment**: Stripe integration (optional)
- **Analytics**: Google Analytics and monitoring

### Admin Access

Default admin credentials:
- المصادقة: ستحتاج لإنشاء كلمة مرور آمنة عند أول دخول
- الأمان: نظام تشفير متقدم مع حماية شاملة

**🔐 تم تحسين نظام الأمان بتشفير متقدم وحماية من الاختراق**

## Project Structure

\`\`\`
src/
├── components/           # React components
│   ├── admin/           # Admin panel components
│   │   └── VisualEditor/ # Page builder components
│   └── ...
├── context/             # React context providers
├── services/            # API and database services
├── utils/               # Utility functions
└── types/               # TypeScript type definitions

database/
├── schema.sql          # Database schema
└── seed.sql           # Default data

scripts/
├── setup.js           # Auto-setup script
└── deploy.sh          # Deployment script
\`\`\`

## API Endpoints

### Public API
- \`GET /api/services\` - List all services
- \`POST /api/orders\` - Create new order
- \`GET /api/testimonials\` - Get testimonials
- \`GET /api/faqs\` - Get FAQ items

### Admin API
- \`GET /api/admin/dashboard\` - Dashboard data
- \`GET|POST|PUT|DELETE /api/admin/orders\` - Order management
- \`GET|POST|PUT|DELETE /api/admin/services\` - Service management
- \`GET|POST|PUT|DELETE /api/admin/users\` - User management

## Visual Page Builder

The platform includes a powerful visual page builder with:

### Components
- Hero sections
- Service grids
- Feature lists
- Testimonials
- Statistics counters
- Contact forms
- Custom text/image blocks

### Themes
- Modern Blue (default)
- Elegant Purple
- Corporate Gray
- Green Finance
- Custom theme creator

### Features
- Drag & drop interface
- Real-time preview
- Responsive design
- Theme switching
- Export/import layouts

## Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -am 'Add new feature'\`
4. Push to branch: \`git push origin feature/new-feature\`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and inquiries:
- Email: support@kyctrust.com
- WhatsApp: +966501234567
- Documentation: [Link to docs]

---

**KYCtrust** - Empowering Digital Financial Services 🚀
`;

    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, readmeContent);
      logSuccess('Created README.md');
    } else {
      logInfo('README.md already exists');
    }

    // Create API documentation
    const apiDocsPath = path.join(this.projectRoot, 'docs/API.md');
    const apiDocsContent = `# KYCtrust API Documentation

## Authentication

Most admin endpoints require authentication via JWT token:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Public Endpoints

### GET /api/services
Get list of all active services

**Response:**
\`\`\`json
{
  "services": [
    {
      "id": "uuid",
      "name": "Payoneer",
      "price": "30$",
      "description": "...",
      "active": true
    }
  ]
}
\`\`\`

### POST /api/orders
Create a new order

**Request:**
\`\`\`json
{
  "customerName": "John Doe",
  "serviceName": "Payoneer",
  "notes": "Optional notes"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "orderId": "uuid",
  "orderNumber": "KYC20241201123456"
}
\`\`\`

## Admin Endpoints

### GET /api/admin/dashboard
Get dashboard statistics

### GET /api/admin/orders
Get all orders with pagination

### POST /api/admin/orders
Create new order (admin)

### PUT /api/admin/orders/:id
Update order status

### DELETE /api/admin/orders/:id
Delete order

... (more endpoints)
`;

    const docsDir = path.join(this.projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    if (!fs.existsSync(apiDocsPath)) {
      fs.writeFileSync(apiDocsPath, apiDocsContent);
      logSuccess('Created API documentation');
    }
  }

  async setupVercel() {
    logInfo('Setting up Vercel configuration...');
    
    const vercelJsonPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelJsonPath)) {
      logSuccess('Vercel configuration already exists');
    } else {
      logWarning('vercel.json not found. Please ensure it exists for deployment');
    }
    
    // Create .vercelignore
    const vercelIgnorePath = path.join(this.projectRoot, '.vercelignore');
    const vercelIgnoreContent = `# Vercel ignore file
node_modules
.env
.env.local
.git
*.log
coverage
.nyc_output
docs
scripts/*.sh
database/*.sql
`;

    if (!fs.existsSync(vercelIgnorePath)) {
      fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent);
      logSuccess('Created .vercelignore');
    }
  }

  async runPostSetup() {
    logInfo('Running post-setup tasks...');
    
    // Make scripts executable
    const deployScript = path.join(this.projectRoot, 'scripts/deploy.sh');
    if (fs.existsSync(deployScript)) {
      try {
        execSync(`chmod +x ${deployScript}`, { stdio: 'ignore' });
        logSuccess('Made deploy script executable');
      } catch (error) {
        logWarning('Could not make deploy script executable (Windows?)');
      }
    }
    
    // Initialize git if not already initialized
    try {
      execSync('git status', { stdio: 'ignore' });
      logInfo('Git repository already initialized');
    } catch (error) {
      try {
        execSync('git init', { stdio: 'ignore' });
        logSuccess('Initialized Git repository');
      } catch (gitError) {
        logWarning('Could not initialize Git repository');
      }
    }
  }

  printNextSteps() {
    log('\n📋 Next Steps:', 'cyan');
    log('================', 'cyan');
    
    log('\n1. 🔧 Configure Environment Variables:');
    log('   - Edit .env file with your credentials');
    log('   - Set up Supabase project and get credentials');
    log('   - Configure SMTP for email notifications');
    
    log('\n2. 🗄️ Setup Database:');
    log('   - Create Supabase project at https://supabase.com');
    log('   - Run database/schema.sql in Supabase SQL editor');
    log('   - Run database/seed.sql to insert default data');
    
    log('\n3. 🚀 Start Development:');
    log('   npm run dev');
    
    log('\n4. 🌐 Deploy to Production:');
    log('   ./scripts/deploy.sh --production');
    
    log('\n5. 🔐 Security:');
    log('   - Change default admin password');
    log('   - Set up proper authentication');
    log('   - Configure HTTPS');
    
    log('\n6. 📈 Optional Integrations:');
    log('   - Set up Google Analytics');
    log('   - Configure Stripe for payments');
    log('   - Set up Sentry for error tracking');
    
    log('\n🎉 Your KYCtrust platform is ready!', 'green');
    log('Visit: http://localhost:5173', 'cyan');
    log('Admin: http://localhost:5173/admin', 'cyan');
  }
}

// Run the setup
const setup = new KYCTrustSetup();
setup.run().catch(error => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});

module.exports = KYCTrustSetup;
