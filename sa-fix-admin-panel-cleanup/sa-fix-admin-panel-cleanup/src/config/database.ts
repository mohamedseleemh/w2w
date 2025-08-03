/**
 * Database Configuration
 * إعدادات قاعدة البيانات
 * 
 * Centralized database configuration for Supabase and PostgreSQL connections
 * إعدادات مركزية لقاعدة البيانات لاتصالات Supabase و PostgreSQL
 */

import { env } from '../utils/env';

/**
 * Supabase configuration
 * إعدادات Supabase
 */
export const supabaseConfig = {
  url: env.SUPABASE_URL,
  anonKey: env.SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: env.SUPABASE_JWT_SECRET,
} as const;

/**
 * PostgreSQL configuration
 * إعدادات PostgreSQL
 */
export const postgresConfig = {
  // Connection URLs
  url: env.POSTGRES_URL,
  urlNonPooling: env.POSTGRES_URL_NON_POOLING,
  prismaUrl: env.POSTGRES_PRISMA_URL,
  
  // Connection details
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DATABASE,
  
  // Default port
  port: 5432,
  
  // SSL configuration
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} as const;

/**
 * Database connection options
 * خيارات اتصال قاعدة البيانات
 */
export const connectionOptions = {
  supabase: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-application-name': env.APP_NAME,
      }
    }
  },
  
  postgres: {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20, // Maximum number of connections
    ssl: postgresConfig.ssl
  }
} as const;

/**
 * Validate database configuration
 * التحقق من صحة إعدادات قاعدة البيانات
 */
export const validateDatabaseConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check Supabase config
  if (!supabaseConfig.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  
  if (!supabaseConfig.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }
  
  // Validate URL format
  if (supabaseConfig.url && !supabaseConfig.url.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must be a valid HTTPS URL');
  }
  
  // Check if URL ends with .supabase.co
  if (supabaseConfig.url && !supabaseConfig.url.includes('.supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get database configuration for current environment
 * الحصول على إعدادات قاعدة البيانات للبيئة الحالية
 */
export const getDatabaseConfig = () => {
  const validation = validateDatabaseConfig();
  
  if (!validation.isValid) {
    console.warn('⚠️ Database configuration issues:', validation.errors);
  }
  
  return {
    supabase: supabaseConfig,
    postgres: postgresConfig,
    options: connectionOptions,
    validation
  };
};

/**
 * Database health check utilities
 * أدوات فحص صحة قاعدة البيانات
 */
export const healthCheck = {
  /**
   * Check Supabase connection
   * فحص اتصال Supabase
   */
  async checkSupabase(): Promise<boolean> {
    try {
      const response = await fetch(`${supabaseConfig.url}/rest/v1/`, {
        headers: {
          'apikey': supabaseConfig.anonKey,
          'authorization': `Bearer ${supabaseConfig.anonKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  },
  
  /**
   * Check database tables exist
   * فحص وجود جداول قاعدة البيانات
   */
  async checkTables(): Promise<{ exists: string[]; missing: string[] }> {
    const requiredTables = [
      'services',
      'payment_methods',
      'orders',
      'site_settings',
      'analytics_events'
    ];
    
    const exists: string[] = [];
    const missing: string[] = [];
    
    // This would need to be implemented with actual Supabase calls
    // For now, return empty arrays
    return { exists, missing };
  }
};

/**
 * Export default configuration
 * تصدير الإعدادات الافتراضية
 */
export default {
  supabase: supabaseConfig,
  postgres: postgresConfig,
  options: connectionOptions,
  validate: validateDatabaseConfig,
  getDatabaseConfig,
  healthCheck
};
