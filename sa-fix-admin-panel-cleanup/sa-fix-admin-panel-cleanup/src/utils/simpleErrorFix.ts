/**
 * Simple fix for [object Object] console errors
 * إصلاح بسيط لأخطاء [object Object] في console
 */

// Store original console.error
const originalConsoleError = console.error;

// Override console.error to fix [object Object] issues
console.error = (...args: unknown[]) => {
  const fixedArgs = args.map(arg => {
    // Check if argument shows as [object Object]
    if (typeof arg === 'object' && arg !== null && String(arg) === '[object Object]') {
      try {
        // Try to serialize it properly
        if (arg instanceof Error) {
          return {
            name: arg.name,
            message: arg.message,
            stack: arg.stack
          };
        }
        return JSON.stringify(arg, null, 2);
      } catch {
        return `[Object: ${arg.constructor?.name || 'Unknown'}]`;
      }
    }
    return arg;
  });
  
  originalConsoleError(...fixedArgs);
};

console.log('✅ Simple error fix applied - no more [object Object] errors');
