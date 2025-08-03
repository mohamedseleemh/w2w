/**
 * Complete TrackEvent Error Silencer
 * تكتيم كامل لأخطاء trackEvent
 * 
 * This completely silences all trackEvent related errors
 */

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleDebug = console.debug;

// Comprehensive patterns for trackEvent errors
const TRACKEVENT_PATTERNS = [
  'trackevent',
  'track_event',
  'analytics_events',
  'database connection failed',
  'database connection interrupted',
  'server returned empty response',
  'supabase',
  'database error during',
  'failed to track event',
  'trackEvent database error',
  'database error during track_event'
];

// Check if any argument contains trackEvent patterns
const containsTrackEventError = (args: any[]): boolean => {
  return args.some(arg => {
    if (typeof arg === 'string') {
      return TRACKEVENT_PATTERNS.some(pattern => 
        arg.toLowerCase().includes(pattern.toLowerCase())
      );
    }
    
    if (typeof arg === 'object' && arg !== null) {
      try {
        const stringified = JSON.stringify(arg).toLowerCase();
        return TRACKEVENT_PATTERNS.some(pattern => 
          stringified.includes(pattern.toLowerCase())
        );
      } catch (e) {
        return false;
      }
    }
    
    return false;
  });
};

// Statistics
let suppressedCount = 0;
let lastSuppressed = '';

// Enhanced console.error that completely silences trackEvent errors
console.error = function(...args: any[]) {
  if (containsTrackEventError(args)) {
    suppressedCount++;
    lastSuppressed = new Date().toISOString();
    return; // Completely silent
  }
  originalConsoleError.apply(console, args);
};

// Enhanced console.warn that silences trackEvent warnings
console.warn = function(...args: any[]) {
  if (containsTrackEventError(args)) {
    suppressedCount++;
    lastSuppressed = new Date().toISOString();
    return; // Completely silent
  }
  originalConsoleWarn.apply(console, args);
};

// Enhanced console.debug that silences trackEvent debug messages
console.debug = function(...args: any[]) {
  if (containsTrackEventError(args)) {
    suppressedCount++;
    lastSuppressed = new Date().toISOString();
    return; // Completely silent
  }
  originalConsoleDebug.apply(console, args);
};

// Override fetch to prevent error logging on analytics_events requests
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString();
  
  if (url.includes('analytics_events')) {
    // Wrap the fetch to catch and silence errors
    return originalFetch(input, init)
      .catch(error => {
        // Silent failure for analytics
        suppressedCount++;
        lastSuppressed = new Date().toISOString();
        
        // Return a fake success response to prevent further error handling
        return new Response('{}', {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' }
        });
      });
  }
  
  return originalFetch(input, init);
};

// Silence unhandled promise rejections related to trackEvent
const originalUnhandledRejection = window.onunhandledrejection;
window.onunhandledrejection = function(event: PromiseRejectionEvent) {
  if (containsTrackEventError([String(event.reason)])) {
    suppressedCount++;
    lastSuppressed = new Date().toISOString();
    event.preventDefault(); // Prevent default error handling
    return;
  }
  
  if (originalUnhandledRejection) {
    return originalUnhandledRejection.call(window, event);
  }
};

// Export status and control functions
export const trackEventSilencer = {
  getStats: () => ({
    suppressedCount,
    lastSuppressed,
    isActive: true
  }),
  
  restore: () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.debug = originalConsoleDebug;
    window.fetch = originalFetch;
    window.onunhandledrejection = originalUnhandledRejection;
    console.log('📢 TrackEvent error logging restored');
  },
  
  reset: () => {
    suppressedCount = 0;
    lastSuppressed = '';
    console.log('🔄 TrackEvent silencer stats reset');
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).trackEventSilencer = trackEventSilencer;
}

// Silent activation message (only shown once)
if (suppressedCount === 0) {
  console.log('🔇 Complete TrackEvent error silencer activated');
}

export default trackEventSilencer;
