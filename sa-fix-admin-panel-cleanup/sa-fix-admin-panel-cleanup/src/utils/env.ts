/**
 * Environment Variables Helper
 * مساعد متغيرات البيئة
 * 
 * يوفر طرق آمنة للوصول لمتغيرات البيئة مع التحقق من الأخطاء
 * Provides safe methods to access environment variables with error checking
 */

// Environment variable validation
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

// Type definitions
type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar =
  | 'VITE_APP_NAME'
  | 'VITE_APP_DESCRIPTION'
  | 'VITE_APP_URL'
  | 'VITE_WHATSAPP_NUMBER'
  | 'VITE_SUPPORT_EMAIL'
  | 'VITE_CONTACT_PHONE'
  | 'VITE_ADMIN_EMAIL'
  | 'VITE_API_URL'
  | 'VITE_DEBUG_MODE'
  | 'VITE_ENCRYPTION_KEY'
  | 'VITE_JWT_SECRET'
  | 'VITE_GOOGLE_ANALYTICS_ID'
  | 'VITE_ENABLE_ANALYTICS'
  | 'VITE_ENABLE_PWA'
  | 'VITE_CACHE_TIMEOUT'
  | 'VITE_API_TIMEOUT'
  | 'VITE_ENABLE_DARK_MODE'
  | 'VITE_ENABLE_MULTILANG'
  | 'VITE_ENABLE_NOTIFICATIONS'
  | 'VITE_ENABLE_OFFLINE_MODE'
  | 'VITE_BUILD_VERSION'
  | 'VITE_BUILD_ENVIRONMENT'
  | 'SUPABASE_SERVICE_ROLE_KEY'
  | 'SUPABASE_JWT_SECRET'
  | 'POSTGRES_URL'
  | 'POSTGRES_URL_NON_POOLING'
  | 'POSTGRES_PRISMA_URL'
  | 'POSTGRES_USER'
  | 'POSTGRES_PASSWORD'
  | 'POSTGRES_HOST'
  | 'POSTGRES_DATABASE';
type EnvVar = RequiredEnvVar | OptionalEnvVar;

/**
 * Get environment variable with validation
 * الحصول على متغير البيئة مع التحقق
 */
export const getEnv = (key: EnvVar, defaultValue?: string): string => {
  const value = import.meta.env[key];

  if (!value && requiredEnvVars.includes(key as RequiredEnvVar)) {
    console.warn(`⚠️ Required environment variable ${key} is not set. Using fallback.`);
    return defaultValue || '';
  }

  return value || defaultValue || '';
};

/**
 * Get boolean environment variable
 * الحصول على متغير بيئة من نوع boolean
 */
export const getEnvBoolean = (key: EnvVar, defaultValue = false): boolean => {
  const value = getEnv(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
};

/**
 * Get number environment variable
 * الحصول على متغير بيئة من نوع number
 */
export const getEnvNumber = (key: EnvVar, defaultValue = 0): number => {
  const value = getEnv(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Validate all required environment variables
 * التحقق من جميع متغيرات البيئة المطلوبة
 */
export const validateEnv = (): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return { isValid: missingVars.length === 0, missingVars };
};

/**
 * Environment configuration object
 * كائن إعدادات البيئة
 */
export const env = {
  // Application
  APP_NAME: getEnv('VITE_APP_NAME', 'KYCtrust'),
  APP_DESCRIPTION: getEnv('VITE_APP_DESCRIPTION', 'Digital Financial Services Platform'),
  APP_URL: getEnv('VITE_APP_URL', 'http://localhost:5173'),

  // Supabase
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY', ''),
  SUPABASE_JWT_SECRET: getEnv('SUPABASE_JWT_SECRET', ''),

  // PostgreSQL Database
  POSTGRES_URL: getEnv('POSTGRES_URL', ''),
  POSTGRES_URL_NON_POOLING: getEnv('POSTGRES_URL_NON_POOLING', ''),
  POSTGRES_PRISMA_URL: getEnv('POSTGRES_PRISMA_URL', ''),
  POSTGRES_USER: getEnv('POSTGRES_USER', 'postgres'),
  POSTGRES_PASSWORD: getEnv('POSTGRES_PASSWORD', ''),
  POSTGRES_HOST: getEnv('POSTGRES_HOST', ''),
  POSTGRES_DATABASE: getEnv('POSTGRES_DATABASE', 'postgres'),
  
  // Contact
  WHATSAPP_NUMBER: getEnv('VITE_WHATSAPP_NUMBER', '+966501234567'),
  SUPPORT_EMAIL: getEnv('VITE_SUPPORT_EMAIL', 'support@kyctrust.com'),
  CONTACT_PHONE: getEnv('VITE_CONTACT_PHONE', '+966501234567'),
  ADMIN_EMAIL: getEnv('VITE_ADMIN_EMAIL', 'admin@kyctrust.com'),
  
  // API
  API_URL: getEnv('VITE_API_URL', '/api'),
  API_TIMEOUT: getEnvNumber('VITE_API_TIMEOUT', 30000),
  
  // Features
  DEBUG_MODE: getEnvBoolean('VITE_DEBUG_MODE', false),
  ENABLE_ANALYTICS: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
  ENABLE_PWA: getEnvBoolean('VITE_ENABLE_PWA', true),
  ENABLE_DARK_MODE: getEnvBoolean('VITE_ENABLE_DARK_MODE', true),
  ENABLE_MULTILANG: getEnvBoolean('VITE_ENABLE_MULTILANG', true),
  ENABLE_NOTIFICATIONS: getEnvBoolean('VITE_ENABLE_NOTIFICATIONS', true),
  ENABLE_OFFLINE_MODE: getEnvBoolean('VITE_ENABLE_OFFLINE_MODE', false),
  
  // Performance
  CACHE_TIMEOUT: getEnvNumber('VITE_CACHE_TIMEOUT', 300000),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: getEnv('VITE_GOOGLE_ANALYTICS_ID', ''),
  
  // Build info
  BUILD_VERSION: getEnv('VITE_BUILD_VERSION', '1.0.0'),
  BUILD_ENVIRONMENT: getEnv('VITE_BUILD_ENVIRONMENT', 'development'),
  
  // Runtime
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;

/**
 * Log environment configuration (for debugging)
 * طباعة إعدادات البيئة (للتطوير)
 */
export const logEnvConfig = (): void => {
  if (env.DEBUG_MODE) {
    console.group('🔧 Environment Configuration');
    console.log('Mode:', env.MODE);
    console.log('App Name:', env.APP_NAME);
    console.log('App URL:', env.APP_URL);
    console.log('API URL:', env.API_URL);
    console.log('Debug Mode:', env.DEBUG_MODE);
    console.log('Analytics Enabled:', env.ENABLE_ANALYTICS);
    console.log('PWA Enabled:', env.ENABLE_PWA);
    console.log('Build Version:', env.BUILD_VERSION);
    console.groupEnd();
  }
};

// Validate environment on module load
if (env.IS_DEVELOPMENT) {
  const validation = validateEnv();
  if (!validation.isValid) {
    console.warn('⚠️ Environment validation issues found, but continuing with defaults');
  }
  logEnvConfig();
}

export default env;
