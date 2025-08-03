/**
 * Global Error Handler
 * معالج الأخطاء الشامل
 * 
 * Intercepts and fixes any [object Object] errors globally
 * يعترض ويصلح أي أخطاء [object Object] بشكل شامل
 */

import { logError } from './errorHandler';
import { env } from './env';

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

/**
 * Check if any argument is an unserialized object
 * التحقق من وجود كائن غير مسلسل في المعاملات
 */
const hasUnserializedObject = (args: unknown[]): boolean => {
  return args.some(arg => {
    if (typeof arg === 'object' && arg !== null) {
      const stringified = String(arg);
      return stringified === '[object Object]' || stringified === '[object Error]';
    }
    return false;
  });
};

/**
 * Serialize arguments properly
 * تسلسل المعاملات بشكل صحيح
 */
const serializeArgs = (args: unknown[]): unknown[] => {
  return args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      const stringified = String(arg);
      if (stringified === '[object Object]' || stringified === '[object Error]') {
        try {
          // Try to serialize the object
          if (arg instanceof Error) {
            return {
              name: arg.name,
              message: arg.message,
              stack: env.DEBUG_MODE ? arg.stack : undefined,
              type: 'Error'
            };
          } else {
            return JSON.parse(JSON.stringify(arg, null, 2));
          }
        } catch (error) {
          // If serialization fails, return a safe representation
          return {
            type: typeof arg,
            constructor: arg.constructor?.name || 'Unknown',
            keys: Object.keys(arg || {}),
            message: 'Failed to serialize object'
          };
        }
      }
    }
    return arg;
  });
};

/**
 * Enhanced console.error that prevents [object Object] logs
 * console.error محسن يمنع سجلات [object Object]
 */
const enhancedConsoleError = (...args: unknown[]) => {
  if (hasUnserializedObject(args)) {
    const serializedArgs = serializeArgs(args);
    originalConsoleError('🔧 [Fixed Error Log]:', ...serializedArgs);
    
    // Log additional context if it seems to be a track_event error
    if (args.some(arg => typeof arg === 'string' && arg.includes('track'))) {
      originalConsoleError('💡 Hint: This appears to be a track_event error. Check trackEvent implementation.');
    }
  } else {
    originalConsoleError(...args);
  }
};

/**
 * Enhanced console.warn that prevents [object Object] logs
 * console.warn محسن يمنع سجلات [object Object]
 */
const enhancedConsoleWarn = (...args: unknown[]) => {
  if (hasUnserializedObject(args)) {
    const serializedArgs = serializeArgs(args);
    originalConsoleWarn('🔧 [Fixed Warning Log]:', ...serializedArgs);
  } else {
    originalConsoleWarn(...args);
  }
};

/**
 * Initialize global error interception
 * تهيئة اعتراض الأخطاء الشامل
 */
export const initializeGlobalErrorHandler = (): void => {
  if (env.DEBUG_MODE) {
    console.log('🛡️ Initializing global error handler to prevent [object Object] logs');
  }

  // Override console methods
  console.error = enhancedConsoleError;
  console.warn = enhancedConsoleWarn;

  // Global error event listener
  window.addEventListener('error', (event) => {
    logError(event.error, 'Global unhandled error', {
      action: 'global_error_handler',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript_error'
      }
    });
  });

  // Global promise rejection listener
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Global unhandled promise rejection', {
      action: 'global_promise_rejection',
      metadata: {
        type: 'promise_rejection'
      }
    });
    
    // Prevent the error from being logged as [object Object]
    event.preventDefault();
  });

  if (env.DEBUG_MODE) {
    console.log('✅ Global error handler initialized successfully');
  }
};

/**
 * Restore original console methods (for testing or cleanup)
 * استعادة وسائل console الأصلية (للاختبار أو التنظيف)
 */
export const restoreOriginalConsole = (): void => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
};

/**
 * Manually fix a specific error log
 * إصلاح سجل خطأ محدد يدوياً
 */
export const fixErrorLog = (error: unknown, context: string = 'Manual fix'): void => {
  if (typeof error === 'object' && error !== null) {
    const stringified = String(error);
    if (stringified === '[object Object]' || stringified === '[object Error]') {
      const serializedArgs = serializeArgs([error]);
      console.error(`🔧 [${context}]:`, ...serializedArgs);
      return;
    }
  }
  console.error(`🔧 [${context}]:`, error);
};

export default {
  initializeGlobalErrorHandler,
  restoreOriginalConsole,
  fixErrorLog,
  serializeArgs
};
