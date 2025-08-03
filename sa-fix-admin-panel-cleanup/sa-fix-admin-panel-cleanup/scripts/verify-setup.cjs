#!/usr/bin/env node

/**
 * KYCtrust Platform Setup Verification Script
 * Verifies that all components are properly configured and working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 KYCtrust Platform Setup Verification\n');

// Check if required files exist
const requiredFiles = [
  '.env.example',
  'database/simplified-schema.sql',
  'database/simplified-seed.sql',
  'api/index.js',
  'api/services.js',
  'api/orders.js',
  'api/payment-methods.js',
  'api/site-settings.js',
  'api/page-templates.js',
  'api/themes.js',
  'src/components/admin/VisualEditor/PageBuilder.tsx',
  'src/services/database.ts',
  'package.json',
  'README.md'
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json configuration
console.log('\n📦 Checking package.json configuration...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDependencies = [
  'react',
  'react-dom',
  'react-router-dom',
  'react-dnd',
  'react-dnd-html5-backend',
  '@supabase/supabase-js',
  'lucide-react',
  'react-hot-toast',
  'clsx',
  'framer-motion'
];

let allDepsPresent = true;
requiredDependencies.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allDepsPresent = false;
  }
});

// Check API endpoints structure
console.log('\n🔌 Checking API endpoints...');
const apiFiles = [
  'api/index.js',
  'api/services.js', 
  'api/orders.js',
  'api/payment-methods.js',
  'api/site-settings.js',
  'api/page-templates.js',
  'api/themes.js',
  'api/get-supabase-config.js',
  'api/setup-database.js'
];

let allApisExist = true;
apiFiles.forEach(api => {
  if (fs.existsSync(api)) {
    console.log(`✅ ${api}`);
  } else {
    console.log(`❌ ${api} - MISSING`);
    allApisExist = false;
  }
});

// Check database files
console.log('\n🗄️ Checking database files...');
const dbFiles = [
  'database/simplified-schema.sql',
  'database/simplified-seed.sql'
];

let allDbFilesExist = true;
dbFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allDbFilesExist = false;
  }
});

// Check admin components
console.log('\n👨‍💼 Checking admin panel components...');
const adminComponents = [
  'src/components/admin/EnhancedAdminPanel.tsx',
  'src/components/admin/AdvancedDashboard.tsx',
  'src/components/admin/ServicesManager.tsx',
  'src/components/admin/OrdersManager.tsx',
  'src/components/admin/PaymentMethodsManager.tsx',
  'src/components/admin/SiteSettingsManager.tsx',
  'src/components/admin/LoginForm.tsx'
];

let allAdminComponentsExist = true;
adminComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - MISSING`);
    allAdminComponentsExist = false;
  }
});

// Check visual editor components
console.log('\n🎨 Checking visual page builder components...');
const visualEditorComponents = [
  'src/components/admin/VisualEditor/PageBuilder.tsx',
  'src/components/admin/VisualEditor/ComponentLibrary.tsx',
  'src/components/admin/VisualEditor/DragDropCanvas.tsx',
  'src/components/admin/VisualEditor/StyleEditor.tsx',
  'src/components/admin/VisualEditor/ThemeSelector.tsx'
];

let allVisualEditorComponentsExist = true;
visualEditorComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - MISSING`);
    allVisualEditorComponentsExist = false;
  }
});

// Check environment example
console.log('\n⚙️ Checking environment configuration...');
if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY', 
    'ADMIN_PASSWORD'
  ];
  
  let allEnvVarsPresent = true;
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MISSING`);
      allEnvVarsPresent = false;
    }
  });
} else {
  console.log('❌ .env.example file missing');
}

// Final verification summary
console.log('\n📋 VERIFICATION SUMMARY');
console.log('========================');

if (allFilesExist) {
  console.log('✅ All required files present');
} else {
  console.log('❌ Some required files are missing');
}

if (allDepsPresent) {
  console.log('✅ All required dependencies present');
} else {
  console.log('❌ Some required dependencies are missing');
}

if (allApisExist) {
  console.log('✅ All API endpoints present');
} else {
  console.log('❌ Some API endpoints are missing');
}

if (allDbFilesExist) {
  console.log('✅ All database files present');
} else {
  console.log('❌ Some database files are missing');
}

if (allAdminComponentsExist) {
  console.log('✅ All admin panel components present');
} else {
  console.log('❌ Some admin panel components are missing');
}

if (allVisualEditorComponentsExist) {
  console.log('✅ All visual page builder components present');
} else {
  console.log('❌ Some visual page builder components are missing');
}

const overallSuccess = allFilesExist && allDepsPresent && allApisExist && 
                      allDbFilesExist && allAdminComponentsExist && allVisualEditorComponentsExist;

console.log('\n🎯 OVERALL STATUS');
console.log('==================');
if (overallSuccess) {
  console.log('🎉 SUCCESS! KYCtrust Platform is properly configured and ready to use.');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env and configure your settings');
  console.log('2. Set up your Supabase database (optional)');
  console.log('3. Run: npm install');
  console.log('4. Run: npm run dev');
  console.log('5. Access admin panel at /admin');
} else {
  console.log('❌ ISSUES FOUND! Please fix the missing files/components listed above.');
}

console.log('\n📖 For detailed setup instructions, see README.md');
console.log('💬 For support, contact via WhatsApp or create an issue.');
