/**
 * Disable Verbose TrackEvent Error Logging
 * تعطيل التسجيل المفصل لأخطاء trackEvent
 * 
 * This file disables the verbose error logging from trackEvent to prevent console spam
 */

// Override console.error to filter out trackEvent spam
const originalConsoleError = console.error;

// Patterns that indicate trackEvent errors
const trackEventErrorPatterns = [
  'trackEvent database error',
  'Database error during track_event',
  'trackEvent',
  'analytics_events',
  'Database connection failed - server returned empty response',
  'Database connection interrupted'
];

// Check if the error is related to trackEvent
const isTrackEventError = (args: any[]): boolean => {
  return args.some(arg => {
    if (typeof arg === 'string') {
      return trackEventErrorPatterns.some(pattern => 
        arg.toLowerCase().includes(pattern.toLowerCase())
      );
    }
    if (typeof arg === 'object') {
      const stringified = JSON.stringify(arg);
      return trackEventErrorPatterns.some(pattern => 
        stringified.toLowerCase().includes(pattern.toLowerCase())
      );
    }
    return false;
  });
};

// Counter for suppressed errors
let suppressedErrorCount = 0;
let lastSuppressedTime = 0;

// Enhanced console.error that filters trackEvent errors
console.error = function(...args: any[]) {
  if (isTrackEventError(args)) {
    suppressedErrorCount++;
    lastSuppressedTime = Date.now();
    
    // Only log a summary every 10 suppressed errors to avoid complete silence
    if (suppressedErrorCount % 10 === 0) {
      originalConsoleError(`🔇 Suppressed ${suppressedErrorCount} trackEvent errors (latest: ${new Date(lastSuppressedTime).toISOString()})`);
    }
    
    return; // Don't log the actual error
  }
  
  // For non-trackEvent errors, use original behavior
  originalConsoleError.apply(console, args);
};

// Export status function
export const getSuppressionStatus = () => ({
  suppressedCount: suppressedErrorCount,
  lastSuppressedTime: lastSuppressedTime ? new Date(lastSuppressedTime).toISOString() : null,
  isActive: true
});

// Export function to re-enable logging if needed
export const restoreOriginalLogging = () => {
  console.error = originalConsoleError;
  console.log('📢 TrackEvent error logging restored');
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).trackEventLogging = {
    getStatus: getSuppressionStatus,
    restore: restoreOriginalLogging,
    disable: () => console.log('✅ TrackEvent error logging already disabled')
  };
}

console.log('🔇 TrackEvent error logging suppression activated');

export default {
  getSuppressionStatus,
  restoreOriginalLogging
};
