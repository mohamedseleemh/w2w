/**
 * Centralized Error Handling Utility
 * أداة مر��زية للتعامل مع الأخطاء
 * 
 * Provides consistent error logging and handling across the application
 * يوفر تسجيل وإدارة أخطاء متسقة عبر التطبيق
 */

import { env } from './env';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface SerializedError {
  message: string;
  name?: string;
  stack?: string;
  code?: string | number;
  timestamp: string;
  context?: ErrorContext;
}

/**
 * Serialize error object for safe logging
 * تسلسل كائن الخطأ للتسجيل الآمن
 */
export const serializeError = (error: unknown, context?: ErrorContext): SerializedError => {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: env.DEBUG_MODE ? error.stack : undefined,
      timestamp,
      context
    };
  }

  // Handle Supabase errors - more comprehensive check
  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>;

    // Check for Supabase PostgrestError pattern
    if (obj.message || obj.code || obj.details || obj.hint) {
      return {
        message: obj.message || obj.details || obj.hint || 'Database operation failed',
        name: 'SupabaseError',
        code: obj.code || obj.status || obj.statusCode || '',
        details: obj.details || obj.hint || '',
        stack: env.DEBUG_MODE ? (obj.stack || obj.details || obj.hint) : undefined,
        timestamp,
        context: {
          ...context,
          supabaseError: true,
          errorType: typeof error,
          constructor: obj.constructor?.name || 'Object'
        }
      };
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      name: 'StringError',
      timestamp,
      context
    };
  }

  // Handle unknown errors - try harder to extract useful info
  try {
    // Try to extract any useful properties from the object
    if (error && typeof error === 'object') {
      const obj = error as Record<string, unknown>;

      // Try to get common error properties - improved extraction
      let message = '';

      // Try specific properties first
      const messageProps = ['message', 'error', 'description', 'msg', 'reason', 'statusText', 'details', 'hint'];
      for (const prop of messageProps) {
        if (obj[prop] && typeof obj[prop] === 'string' && obj[prop].trim()) {
          message = obj[prop];
          break;
        }
      }

      // If no message found, try toString
      if (!message && obj.toString && typeof obj.toString === 'function') {
        const stringified = obj.toString();
        if (stringified !== '[object Object]' && stringified !== 'undefined' && stringified.trim()) {
          message = stringified;
        }
      }

      // If still no message, describe the object
      if (!message) {
        const keys = Object.keys(obj);
        const constructorName = obj.constructor?.name || 'Object';
        if (keys.length > 0) {
          message = `Unknown error (type: ${constructorName}, properties: ${keys.join(', ')})`;
        } else {
          // Provide more specific messages for empty objects
          if (constructorName === 'Object') {
            message = 'Database connection interrupted - no error details available';
          } else {
            message = `Database operation failed (empty ${constructorName} response)`;
          }
        }
      }
      const name = obj.name || obj.type || obj.constructor?.name || 'DatabaseError';
      const code = obj.code || obj.status || obj.statusCode || obj.errno || '';
      const details = obj.details || obj.detail || obj.hint || obj.info || '';

      // Try to get all enumerable properties
      const properties: Record<string, unknown> = {};
      try {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          if (value !== undefined && value !== null && typeof value !== 'function') {
            if (typeof value === 'object') {
              try {
                properties[key] = JSON.stringify(value);
              } catch {
                properties[key] = String(value);
              }
            } else {
              properties[key] = String(value);
            }
          }
        });
      } catch (e) {
        properties.serialization_error = 'Could not enumerate properties';
      }

      return {
        message: String(message),
        name: String(name),
        code: String(code),
        details: String(details),
        properties,
        timestamp,
        context: {
          ...context,
          errorType: typeof error,
          constructor: obj.constructor?.name || 'Unknown'
        }
      };
    }

    // Fallback for non-object errors
    const errorString = String(error);
    return {
      message: errorString && errorString !== '[object Object]' && errorString !== 'undefined' && errorString !== 'null'
               ? errorString : 'Database operation failed with unknown error',
      name: 'UnknownError',
      timestamp,
      context: {
        ...context,
        errorType: typeof error,
        primitive: true,
        rawError: errorString
      }
    };
  } catch (serializationError) {
    // Ultimate fallback if even our enhanced serialization fails
    return {
      message: 'Error serialization failed',
      name: 'SerializationError',
      originalError: String(error),
      serializationError: String(serializationError),
      timestamp,
      context
    };
  }
};

/**
 * Log error with proper serialization
 * تسجيل الخطأ مع التسلسل المناسب
 */
export const logError = (
  error: unknown,
  message: string = 'An error occurred',
  context?: ErrorContext
): void => {
  const serializedError = serializeError(error, context);

  // Use safe logging to prevent [object Object] errors
  console.error(`🚨 ${message}:`, JSON.stringify(serializedError, null, 2));
  
  // In production, you might want to send errors to an external service
  if (env.IS_PRODUCTION && env.ENABLE_ANALYTICS) {
    // Send to analytics service
    try {
      // You can integrate with services like Sentry, LogRocket, etc.
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: serializedError.message,
          fatal: false
        });
      }
    } catch (reportingError) {
      console.warn('Failed to report error to analytics:', reportingError);
    }
  }
};

/**
 * Log warning with context
 * تسجيل تحذير مع السياق
 */
export const logWarning = (
  message: string,
  context?: ErrorContext
): void => {
  console.warn(`⚠️ ${message}`, {
    timestamp: new Date().toISOString(),
    context
  });
};

/**
 * Log info message
 * تسجيل رسالة معلومات
 */
export const logInfo = (
  message: string,
  data?: unknown
): void => {
  if (env.DEBUG_MODE) {
    console.info(`ℹ️ ${message}`, data);
  }
};

/**
 * Error boundary helper for React components
 * مساعد حدود الخطأ لمكونات React
 */
export const handleComponentError = (
  error: Error,
  errorInfo: { componentStack: string },
  componentName: string
): void => {
  logError(error, `Error in ${componentName} component`, {
    component: componentName,
    metadata: {
      componentStack: errorInfo.componentStack
    }
  });
};

/**
 * Network error helper
 * مساعد أخطاء الشبكة
 */
export const handleNetworkError = (
  error: unknown,
  endpoint: string,
  method: string = 'GET'
): void => {
  logError(error, `Network error: ${method} ${endpoint}`, {
    action: 'network_request',
    metadata: {
      endpoint,
      method
    }
  });
};

/**
 * Database error helper
 * مساعد أخطاء قاعدة البيانات
 */
export const handleDatabaseError = (
  error: unknown,
  operation: string,
  table?: string
): void => {
  logError(error, `Database error during ${operation}`, {
    action: 'database_operation',
    metadata: {
      operation,
      table
    }
  });
};

/**
 * User action error helper
 * مساعد أخطاء إجراءات المستخدم
 */
export const handleUserActionError = (
  error: unknown,
  action: string,
  userId?: string
): void => {
  logError(error, `User action failed: ${action}`, {
    action,
    userId,
    metadata: {
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }
  });
};

/**
 * Create error handler with context
 * إنشاء معالج خطأ م�� السياق
 */
export const createErrorHandler = (defaultContext: ErrorContext) => {
  return (error: unknown, message?: string, additionalContext?: ErrorContext) => {
    logError(error, message, {
      ...defaultContext,
      ...additionalContext
    });
  };
};

/**
 * Extract user-friendly error message from any error
 * استخراج رسالة خطأ مفهومة للمستخدم من أي خطأ
 */
export const extractErrorMessage = (error: unknown): string => {
  const serialized = serializeError(error);

  // Return the most user-friendly message available
  if (serialized.message && serialized.message !== '[object Object]') {
    return serialized.message;
  }

  // Fallback to a generic message if serialization failed
  return 'An unexpected error occurred. Please try again.';
};

// Export commonly used error handlers
export const errorHandlers = {
  network: handleNetworkError,
  database: handleDatabaseError,
  userAction: handleUserActionError,
  component: handleComponentError,
  extractErrorMessage
};

export default {
  logError,
  logWarning,
  logInfo,
  serializeError,
  extractErrorMessage,
  errorHandlers,
  createErrorHandler
};
