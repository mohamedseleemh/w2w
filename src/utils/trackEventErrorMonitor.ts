/**
 * TrackEvent Error Monitor
 * مراقب أخطاء trackEvent
 * 
 * Real-time monitoring and debugging for trackEvent errors
 */

// Enhanced console.error override specifically for trackEvent debugging
const originalConsoleError = console.error;

console.error = function(...args: unknown[]) {
  // Check if this is a trackEvent related error
  const isTrackEventError = args.some(arg => 
    (typeof arg === 'string' && arg.includes('trackEvent')) ||
    (typeof arg === 'object' && JSON.stringify(arg).includes('track_event'))
  );

  if (isTrackEventError) {
    console.group('🔍 TrackEvent Error Debug');
    console.log('📍 Error detected at:', new Date().toISOString());
    
    args.forEach((arg, index) => {
      console.log(`Argument ${index + 1}:`, typeof arg);
      
      if (typeof arg === 'object' && arg !== null) {
        try {
          // Safe object inspection
          console.log('Object keys:', Object.keys(arg));
          console.log('Object constructor:', arg.constructor?.name);
          console.log('Object toString:', arg.toString?.());
          
          // Try to extract meaningful info
          if (arg.message) console.log('Message:', arg.message);
          if (arg.code) console.log('Code:', arg.code);
          if (arg.details) console.log('Details:', arg.details);
          if (arg.hint) console.log('Hint:', arg.hint);
          
          // Show full object structure (safely)
          console.log('Full object:', JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (typeof value === 'undefined') return '[Undefined]';
            return value;
          }, 2));
        } catch (e) {
          console.log('Failed to inspect object:', e);
          console.log('Raw object:', arg);
        }
      } else {
        console.log('Raw value:', arg);
      }
    });
    
    console.groupEnd();
    
    // Still call the original console.error for visibility
    originalConsoleError.apply(console, ['🚨 [ENHANCED] TrackEvent Error:', ...args]);
  } else {
    // For non-trackEvent errors, use original behavior
    originalConsoleError.apply(console, args);
  }
};

// Monitor for trackEvent calls to see what's being passed
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
  const url = typeof input === 'string' ? input : input.toString();
  
  if (url.includes('analytics_events')) {
    console.group('📊 TrackEvent Database Call');
    console.log('URL:', url);
    console.log('Method:', init?.method || 'GET');
    console.log('Headers:', init?.headers);
    console.log('Body:', init?.body);
    console.groupEnd();
  }
  
  return originalFetch.call(this, input, init);
};

// Add global error listener for uncaught trackEvent errors
window.addEventListener('error', (event) => {
  if (event.error && JSON.stringify(event.error).includes('track_event')) {
    console.error('🌐 Global trackEvent error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  }
});

// Add promise rejection listener
window.addEventListener('unhandledrejection', (event) => {
  if (JSON.stringify(event.reason).includes('track_event')) {
    console.error('🔄 Unhandled trackEvent promise rejection:', {
      reason: event.reason,
      promise: event.promise
    });
  }
});

console.log('🛡️ TrackEvent Error Monitor activated');

export const trackEventMonitor = {
  disable: () => {
    console.error = originalConsoleError;
    window.fetch = originalFetch;
    console.log('🛡️ TrackEvent Error Monitor disabled');
  }
};
