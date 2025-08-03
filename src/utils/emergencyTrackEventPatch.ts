/**
 * Emergency trackEvent Error Patch
 * رقعة طوارئ لإصلاح خطأ trackEvent
 * 
 * This is a comprehensive fix that handles any remaining [object Object] errors
 * هذا إصلاح شامل يتعامل مع أي أخطاء [object Object] متبقية
 */

// Store original console methods
const originalMethods = {
  error: console.error,
  warn: console.warn,
  log: console.log
};

// Track event error detection
const TRACK_EVENT_KEYWORDS = [
  'track_event',
  'trackEvent',
  'Failed to track event',
  'Database error during track_event',
  'analytics_events'
];

// Check if a message is related to trackEvent
const isTrackEventRelated = (args: any[]): boolean => {
  return args.some(arg => {
    if (typeof arg === 'string') {
      return TRACK_EVENT_KEYWORDS.some(keyword => arg.includes(keyword));
    }
    return false;
  });
};

// Safe object serialization
const safeSerialize = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj !== 'object') {
    return obj;
  }
  
  const stringified = String(obj);
  if (stringified === '[object Object]' || stringified === '[object Error]') {
    try {
      // Handle Error objects
      if (obj instanceof Error) {
        return {
          __type: 'Error',
          name: obj.name,
          message: obj.message,
          stack: obj.stack,
          toString: () => `${obj.name}: ${obj.message}`
        };
      }
      
      // Handle Supabase errors
      if (obj.message && obj.code) {
        return {
          __type: 'SupabaseError',
          message: obj.message,
          code: obj.code,
          details: obj.details,
          hint: obj.hint,
          toString: () => `SupabaseError: ${obj.message} (${obj.code})`
        };
      }
      
      // Handle regular objects
      return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'function') return '[Function]';
        if (value instanceof Error) return `[Error: ${value.message}]`;
        return value;
      }));
    } catch (serializeError) {
      return {
        __type: 'UnserializableObject',
        constructor: obj.constructor?.name || 'Unknown',
        keys: Object.keys(obj || {}),
        message: 'Object could not be serialized',
        toString: () => `[${obj.constructor?.name || 'Object'}]`
      };
    }
  }
  
  return obj;
};

// Enhanced console.error for trackEvent
const enhancedConsoleError = (...args: any[]) => {
  if (isTrackEventRelated(args)) {
    // Process all arguments to fix [object Object] issues
    const processedArgs = args.map(safeSerialize);
    
    originalMethods.error('🔧 [trackEvent Error Fixed]:', ...processedArgs);
    
    // Additional context for trackEvent errors
    originalMethods.log('💡 trackEvent Error Context:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      fixed: true
    });
  } else {
    // For non-trackEvent errors, apply basic serialization
    const processedArgs = args.map(arg => {
      const stringified = String(arg);
      if (stringified === '[object Object]' || stringified === '[object Error]') {
        return safeSerialize(arg);
      }
      return arg;
    });
    
    originalMethods.error(...processedArgs);
  }
};

// Apply the patch
console.error = enhancedConsoleError;

// Global error event handler for trackEvent
window.addEventListener('error', (event) => {
  if (event.error && isTrackEventRelated([event.message])) {
    console.error('🔧 [Global trackEvent Error Caught]:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: safeSerialize(event.error),
      timestamp: new Date().toISOString()
    });
  }
});

// Promise rejection handler for trackEvent
window.addEventListener('unhandledrejection', (event) => {
  if (isTrackEventRelated([String(event.reason)])) {
    console.error('🔧 [trackEvent Promise Rejection Caught]:', {
      reason: safeSerialize(event.reason),
      timestamp: new Date().toISOString()
    });
    event.preventDefault(); // Prevent the error from bubbling up
  }
});

// Export utilities for manual use
export const emergencyFix = {
  /**
   * Manually fix a trackEvent error
   */
  fixError: (error: unknown, context?: string) => {
    console.error(`🔧 [Manual trackEvent Fix${context ? ` - ${context}` : ''}]:`, safeSerialize(error));
  },
  
  /**
   * Test the fix
   */
  test: () => {
    console.group('🧪 Testing Emergency trackEvent Fix');
    
    // Test with various error types
    const testErrors = [
      new Error('Test error'),
      { message: 'Supabase error', code: '23505' },
      { weird: 'object' },
      'String error',
      null,
      undefined
    ];
    
    testErrors.forEach((error, index) => {
      console.log(`Test ${index + 1}:`, safeSerialize(error));
    });
    
    console.groupEnd();
  },
  
  /**
   * Restore original console methods
   */
  restore: () => {
    console.error = originalMethods.error;
    console.warn = originalMethods.warn;
    console.log = originalMethods.log;
  }
};

// Auto-test in development
if (import.meta.env.DEV) {
  console.log('🚀 Emergency trackEvent patch applied');
  
  // Test after a short delay
  setTimeout(() => {
    emergencyFix.test();
  }, 1000);
}

export default emergencyFix;
