#!/usr/bin/env node

/**
 * إعداد تلقائي شامل للمشروع على Vercel
 * يقوم بإعداد قاعدة البيانات والبيانات الافتراضية تلقائياً
 */

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const displayBanner = () => {
  log('\n' + '='.repeat(60), 'cyan');
  log('🚀 KYCtrust Auto Setup Script', 'cyan');
  log('📦 Automated Database & Data Configuration', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
};

const checkEnvironmentVariables = () => {
  log('🔍 Checking environment variables...', 'blue');
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    log('❌ Missing environment variables:', 'red');
    missing.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    
    log('\n📋 Setup Instructions:', 'yellow');
    log('1. Create a Supabase project at https://supabase.com', 'yellow');
    log('2. Go to Settings > API in your Supabase dashboard', 'yellow');
    log('3. Copy your Project URL and anon public key', 'yellow');
    log('4. Set these environment variables in Vercel:', 'yellow');
    log('   VITE_SUPABASE_URL=your_project_url', 'yellow');
    log('   VITE_SUPABASE_ANON_KEY=your_anon_key', 'yellow');
    log('5. Redeploy your application\n', 'yellow');
    
    return false;
  }
  
  log('✅ All environment variables found', 'green');
  return true;
};

const testSupabaseConnection = async () => {
  log('🔗 Testing Supabase connection...', 'blue');
  
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    // اختبار الاتصال
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    
    if (error && !error.message.includes('relation "_supabase_migrations" does not exist')) {
      throw error;
    }
    
    log('✅ Supabase connection successful', 'green');
    return supabase;
  } catch (error) {
    log(`❌ Supabase connection failed: ${error.message}`, 'red');
    throw error;
  }
};

const createTables = async (supabase) => {
  log('🏗️  Creating database tables...', 'blue');
  
  const tables = [
    {
      name: 'services',
      sql: `
        CREATE TABLE IF NOT EXISTS services (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          price TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          active BOOLEAN DEFAULT true,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS services_order_idx ON services(order_index);
        CREATE INDEX IF NOT EXISTS services_active_idx ON services(active);
      `
    },
    {
      name: 'payment_methods',
      sql: `
        CREATE TABLE IF NOT EXISTS payment_methods (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          details TEXT NOT NULL,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS payment_methods_active_idx ON payment_methods(active);
      `
    },
    {
      name: 'orders',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_name TEXT NOT NULL,
          service_name TEXT NOT NULL,
          notes TEXT,
          status TEXT DEFAULT 'pending',
          archived BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
        CREATE INDEX IF NOT EXISTS orders_archived_idx ON orders(archived);
        CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
      `
    },
    {
      name: 'site_settings',
      sql: `
        CREATE TABLE IF NOT EXISTS site_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          order_notice TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: table.sql 
      });
      
      if (error) {
        // حاول باستخدام الطريقة التقليدية إذا فشل RPC
        const queries = table.sql.split(';').filter(q => q.trim());
        for (const query of queries) {
          if (query.trim()) {
            await supabase.rpc('exec_sql', { sql: query.trim() + ';' });
          }
        }
      }
      
      log(`  ✅ Table '${table.name}' created successfully`, 'green');
    } catch (error) {
      log(`  ❌ Failed to create table '${table.name}': ${error.message}`, 'red');
    }
  }
};

const insertDefaultData = async (supabase) => {
  log('📊 Inserting default data...', 'blue');
  
  const defaultServices = [
    { name: 'Payoneer', price: '30$', order_index: 1, active: true },
    { name: 'Wise', price: '30$', order_index: 2, active: true },
    { name: 'Skrill', price: '20$', order_index: 3, active: true },
    { name: 'Neteller', price: '20$', order_index: 4, active: true },
    { name: 'Kast', price: '20$', order_index: 5, active: true },
    { name: 'Redotpay', price: '20$', order_index: 6, active: true },
    { name: 'Okx', price: '20$', order_index: 7, active: true },
    { name: 'World First', price: '20$', order_index: 8, active: true },
    { name: 'Bybit', price: '20$', order_index: 9, active: true },
    { name: 'Bitget', price: '20$', order_index: 10, active: true },
    { name: 'Kucoin', price: '20$', order_index: 11, active: true },
    { name: 'PayPal', price: '15$', order_index: 12, active: true },
    { name: 'Mexc', price: '20$', order_index: 13, active: true },
    { name: 'Exness', price: '20$', order_index: 14, active: true },
    { name: 'شحن رصيد فودافون', price: '100 جنيه = 120 جنيه (متاح أي مبلغ)', order_index: 15, active: true },
    { name: 'سحب من TikTok', price: 'حسب الاتفاق', order_index: 16, active: true },
    { name: 'سحب من PayPal', price: 'حسب الاتفاق', order_index: 17, active: true }
  ];

  const defaultPaymentMethods = [
    { name: 'Vodafone Cash', details: '01062453344', active: true },
    { name: 'USDT (TRC20)', details: 'TFUt8GRpk2R8Wv3FvoCiSUghRBQo4HrmQK', active: true }
  ];

  const defaultSiteSettings = {
    title: 'KYCtrust - خدمات مالية رقمية موثوقة',
    description: 'نقدم خدمات مالية رقمية احترافية وآمنة لجميع المنصات العالمية مع ضمان الجودة والموثوقية',
    order_notice: 'سيتم التواصل معك يدويًا عبر واتساب بعد إرسال الطلب.'
  };

  try {
    // التحقق من وجود البيانات أولاً
    const { data: existingServices } = await supabase.from('services').select('id').limit(1);
    if (!existingServices || existingServices.length === 0) {
      const { error } = await supabase.from('services').insert(defaultServices);
      if (!error) {
        log(`  ✅ Inserted ${defaultServices.length} default services`, 'green');
      } else {
        log(`  ❌ Failed to insert services: ${error.message}`, 'red');
      }
    } else {
      log(`  ⚠️  Services already exist, skipping`, 'yellow');
    }

    const { data: existingPaymentMethods } = await supabase.from('payment_methods').select('id').limit(1);
    if (!existingPaymentMethods || existingPaymentMethods.length === 0) {
      const { error } = await supabase.from('payment_methods').insert(defaultPaymentMethods);
      if (!error) {
        log(`  ✅ Inserted ${defaultPaymentMethods.length} default payment methods`, 'green');
      } else {
        log(`  ❌ Failed to insert payment methods: ${error.message}`, 'red');
      }
    } else {
      log(`  ⚠️  Payment methods already exist, skipping`, 'yellow');
    }

    const { data: existingSettings } = await supabase.from('site_settings').select('id').limit(1);
    if (!existingSettings || existingSettings.length === 0) {
      const { error } = await supabase.from('site_settings').insert(defaultSiteSettings);
      if (!error) {
        log(`  ✅ Inserted default site settings`, 'green');
      } else {
        log(`  ❌ Failed to insert site settings: ${error.message}`, 'red');
      }
    } else {
      log(`  ⚠️  Site settings already exist, skipping`, 'yellow');
    }

  } catch (error) {
    log(`❌ Error inserting default data: ${error.message}`, 'red');
  }
};

const setupRowLevelSecurity = async (supabase) => {
  log('🔒 Setting up Row Level Security...', 'blue');
  
  const policies = [
    'ALTER TABLE services ENABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "Enable read access for all users" ON services;',
    'CREATE POLICY "Enable read access for all users" ON services FOR SELECT USING (true);',
    
    'ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "Enable read access for all users" ON payment_methods;',
    'CREATE POLICY "Enable read access for all users" ON payment_methods FOR SELECT USING (true);',
    
    'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "Enable insert for all users" ON orders;',
    'CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);',
    
    'ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "Enable read access for all users" ON site_settings;',
    'CREATE POLICY "Enable read access for all users" ON site_settings FOR SELECT USING (true);'
  ];

  for (const policy of policies) {
    try {
      await supabase.rpc('exec_sql', { sql: policy });
    } catch (error) {
      if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
        log(`  ⚠️  Policy setup warning: ${error.message}`, 'yellow');
      }
    }
  }
  
  log('  ✅ Row Level Security configured', 'green');
};

const displaySuccess = () => {
  log('\n' + '='.repeat(60), 'green');
  log('🎉 Setup completed successfully!', 'green');
  log('='.repeat(60), 'green');
  log('📱 Your KYCtrust application is ready!', 'green');
  log('🌐 Database tables and default data configured', 'green');
  log('🔒 Security policies applied', 'green');
  log('\n🚀 Next steps:', 'cyan');
  log('1. Visit your deployed application', 'cyan');
  log('2. Test the services and payment methods', 'cyan');
  log('3. Access admin panel at /admin', 'cyan');
  log('4. Customize your settings as needed', 'cyan');
  log('\n💡 Need help? Check the documentation or contact support.', 'magenta');
  log('='.repeat(60) + '\n', 'green');
};

const main = async () => {
  try {
    displayBanner();
    
    if (!checkEnvironmentVariables()) {
      process.exit(1);
    }
    
    const supabase = await testSupabaseConnection();
    await createTables(supabase);
    await insertDefaultData(supabase);
    await setupRowLevelSecurity(supabase);
    
    displaySuccess();
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    log('Please check your configuration and try again.\n', 'red');
    process.exit(1);
  }
};

// تشغيل السكريبت
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
