/**
 * Specific fix for trackEvent [object Object] error
 * إصلاح محدد لخطأ [object Object] في trackEvent
 */

// Override console.error specifically for trackEvent errors
const originalConsoleError = console.error;

// Check if the error message contains trackEvent related text
const isTrackEventError = (args: unknown[]): boolean => {
  return args.some(arg => 
    typeof arg === 'string' && 
    (arg.includes('track_event') || 
     arg.includes('Database error during track_event') ||
     arg.includes('Failed to track event'))
  );
};

// Enhanced console.error that fixes trackEvent errors
const enhancedConsoleError = (...args: unknown[]) => {
  if (isTrackEventError(args)) {
    // Format the error properly
    const formattedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        const stringified = String(arg);
        if (stringified === '[object Object]' || stringified === '[object Error]') {
          try {
            if (arg instanceof Error) {
              return {
                message: arg.message,
                name: arg.name,
                stack: arg.stack,
                type: 'Error'
              };
            } else {
              return JSON.stringify(arg, null, 2);
            }
          } catch (error) {
            return {
              type: typeof arg,
              message: 'Failed to serialize trackEvent error object',
              originalError: String(arg)
            };
          }
        }
      }
      return arg;
    });
    
    originalConsoleError('🔧 [trackEvent Error Fixed]:', ...formattedArgs);
  } else {
    originalConsoleError(...args);
  }
};

// Apply the fix immediately
console.error = enhancedConsoleError;

// Export for manual use if needed
export const fixTrackEventError = (error: unknown): void => {
  if (typeof error === 'object' && error !== null) {
    const stringified = String(error);
    if (stringified === '[object Object]' || stringified === '[object Error]') {
      console.error('🔧 [Manual trackEvent Fix]:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        details: error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
        timestamp: new Date().toISOString()
      });
      return;
    }
  }
  console.error('🔧 [Manual trackEvent Fix]:', error);
};

export default {
  fixTrackEventError
};
