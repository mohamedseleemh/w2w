/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Supabase Advanced Configuration
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly SUPABASE_JWT_SECRET: string;

  // PostgreSQL Database Configuration
  readonly POSTGRES_URL: string;
  readonly POSTGRES_URL_NON_POOLING: string;
  readonly POSTGRES_PRISMA_URL: string;
  readonly POSTGRES_USER: string;
  readonly POSTGRES_PASSWORD: string;
  readonly POSTGRES_HOST: string;
  readonly POSTGRES_DATABASE: string;
  
  // Application Settings
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  
  // Contact Information
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_CONTACT_PHONE: string;
  
  // Admin Configuration
  readonly ADMIN_PASSWORD: string;
  readonly VITE_ADMIN_EMAIL: string;
  
  // Development/Production Settings
  readonly NODE_ENV: string;
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG_MODE: string;
  
  // Security Settings
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_JWT_SECRET: string;
  
  // Analytics & Tracking
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  
  // Performance Settings
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_CACHE_TIMEOUT: string;
  readonly VITE_API_TIMEOUT: string;
  
  // Feature Flags
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_ENABLE_MULTILANG: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_OFFLINE_MODE: string;
  
  // Build Configuration
  readonly VITE_BUILD_VERSION: string;
  readonly VITE_BUILD_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
