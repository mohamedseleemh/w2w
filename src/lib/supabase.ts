import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, validateDatabaseConfig, connectionOptions } from '../config/database';

// Validate configuration
const validation = validateDatabaseConfig();

// Check if we're in development mode and provide helpful warning
const isDevelopment = import.meta.env.MODE === 'development';
const hasValidConfig = validation.isValid;

if (!hasValidConfig) {
  if (isDevelopment) {
    console.warn('⚠️ Supabase configuration issues:');
    validation.errors.forEach(error => console.warn(`   - ${error}`));
    console.warn('Using local storage fallback for development.');
  } else {
    console.error('❌ Supabase configuration is invalid in production!');
    validation.errors.forEach(error => console.error(`   - ${error}`));
  }
}

// Create client with error handling and proper configuration
export const supabase = hasValidConfig ? createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  connectionOptions.supabase
) : null;

// Safe Supabase operations helper
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!supabase || !isSupabaseConfigured) {
    if (isDevelopment) {
      console.warn('🔄 Supabase not configured, using fallback');
    }
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.warn('🔄 Supabase operation failed, using fallback:', error);
    return fallback;
  }
};

// Export a flag to check if Supabase is available
export const isSupabaseConfigured = hasValidConfig;

// Types for database tables
export interface DatabaseService {
  id: string;
  name: string;
  price: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePaymentMethod {
  id: string;
  name: string;
  details: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: string;
  customer_name: string;
  service_name: string;
  notes: string;
  status: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSiteSettings {
  id: string;
  title: string;
  description: string;
  order_notice: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAdminUser {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
