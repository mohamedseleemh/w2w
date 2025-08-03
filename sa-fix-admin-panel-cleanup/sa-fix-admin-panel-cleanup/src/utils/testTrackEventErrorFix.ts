/**
 * Quick test for trackEvent error handling fix
 * اختبار سريع لإصلاح معالجة أخطاء trackEvent
 */

// Test different error scenarios that were causing [object Object]
export const testTrackEventErrorHandling = () => {
  console.log('🧪 Testing trackEvent error handling fixes...');

  // Test 1: Empty object (the original problem)
  const emptyError = {};
  console.log('Test 1 - Empty object:', JSON.stringify({
    input: emptyError,
    result: extractErrorMessageTest(emptyError)
  }));

  // Test 2: Object with no useful properties
  const uselessError = { constructor: Object };
  console.log('Test 2 - Useless object:', JSON.stringify({
    input: uselessError,
    result: extractErrorMessageTest(uselessError)
  }));

  // Test 3: Supabase-like error
  const supabaseError = {
    message: 'relation "analytics_events" does not exist',
    details: null,
    hint: null,
    code: '42P01'
  };
  console.log('Test 3 - Supabase error:', JSON.stringify({
    input: supabaseError,
    result: extractErrorMessageTest(supabaseError)
  }));

  // Test 4: Object with toString that returns [object Object]
  const badToStringError = {
    toString: () => '[object Object]'
  };
  console.log('Test 4 - Bad toString:', JSON.stringify({
    input: badToStringError,
    result: extractErrorMessageTest(badToStringError)
  }));

  console.log('✅ trackEvent error handling test completed');
};

// Mock the extractErrorMessage logic for testing
function extractErrorMessageTest(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>;
    
    // Specific handling for Supabase/PostgrestError
    if (obj.message && typeof obj.message === 'string') {
      return obj.message;
    }
    
    // Try other common error properties
    const candidates = [
      obj.details,
      obj.hint,
      obj.description,
      obj.error,
      obj.statusText,
      obj.reason
    ];
    
    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }
    
    // If object has meaningful toString
    if (obj.toString && typeof obj.toString === 'function') {
      const stringified = obj.toString();
      if (stringified !== '[object Object]' && stringified !== 'undefined' && stringified.trim()) {
        return stringified;
      }
    }
    
    // Last resort: try to describe the error object
    const keys = Object.keys(obj);
    if (keys.length > 0) {
      return `Database error (type: ${obj.constructor?.name || 'Unknown'}, keys: ${keys.join(', ')})`;
    }
    
    return 'Database operation failed (empty error object)';
  }
  
  const errorString = String(error);
  return errorString && errorString !== '[object Object]' && errorString !== 'undefined' && errorString.trim()
         ? errorString : 'Unknown database error';
}

// Auto-run in development - DISABLED to prevent test errors
// Tests can be run manually using: testTrackEventErrorHandling()
if (import.meta.env.DEV && import.meta.env.VITE_AUTO_RUN_TESTS) {
  console.log('🚀 Auto-running trackEvent error handling tests...');
  testTrackEventErrorHandling();
}
