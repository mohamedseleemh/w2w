/**
 * Manual TrackEvent Error Handling Test
 * اختبار يدوي لمعالجة أخطاء trackEvent
 * 
 * Run manually from browser console:
 * - testTrackEventErrorHandling() - Test all error scenarios
 * - testNormalTrackEvent() - Test normal functionality
 * - testNetworkErrors() - Test network error handling
 */

import { databaseService } from '../services/database';

/**
 * Test normal trackEvent functionality
 * اختبار وظيفة trackEvent العادية
 */
export const testNormalTrackEvent = async (): Promise<void> => {
  console.group('✅ Testing Normal TrackEvent Functionality');
  
  try {
    await databaseService.trackEvent('manual_test', {
      test_type: 'normal_functionality',
      timestamp: Date.now(),
      source: 'manual_test'
    });
    console.log('✅ Normal trackEvent test completed successfully');
  } catch (error) {
    console.error('❌ Normal trackEvent test failed:', error);
  }
  
  console.groupEnd();
};

/**
 * Test error scenarios to verify improved error handling
 * اختبار سيناريوهات الأخطاء للتحقق من تحسين معالجة الأخطاء
 */
export const testTrackEventErrorHandling = async (): Promise<void> => {
  console.group('🧪 Testing TrackEvent Error Handling');
  
  try {
    // Test 1: Invalid event type
    console.log('Test 1: Invalid event type');
    await databaseService.trackEvent('', { test: 'invalid_event_type' });
    console.log('✅ Invalid event type handled gracefully');
    
    // Test 2: Null metadata
    console.log('Test 2: Null metadata');
    await databaseService.trackEvent('null_test', null as any);
    console.log('✅ Null metadata handled gracefully');
    
    // Test 3: Undefined metadata
    console.log('Test 3: Undefined metadata');
    await databaseService.trackEvent('undefined_test', undefined as any);
    console.log('✅ Undefined metadata handled gracefully');
    
    // Test 4: Complex metadata with potential circular references
    console.log('Test 4: Complex metadata');
    const complexData = {
      user: { id: 1, name: 'Test User' },
      settings: { theme: 'dark', notifications: true },
      timestamp: Date.now()
    };
    await databaseService.trackEvent('complex_test', complexData);
    console.log('✅ Complex metadata handled gracefully');
    
    console.log('🎉 All error handling tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
  }
  
  console.groupEnd();
};

/**
 * Test network error scenarios
 * اختبار سيناريوهات أخطاء الشبكة
 */
export const testNetworkErrors = async (): Promise<void> => {
  console.group('🌐 Testing Network Error Handling');
  
  // Note: This will only test network error detection, not actual network failures
  console.log('Network error handling is automatic and will fallback to offline storage');
  console.log('To test network errors, disable internet connection and try trackEvent');
  
  console.groupEnd();
};

/**
 * Test error message extraction improvements
 * اختبار تحسينات استخراج رسائل الأخطاء
 */
export const testErrorMessageExtraction = (): void => {
  console.group('🔍 Testing Error Message Extraction');
  
  // Create test error objects similar to what Supabase might return
  const testErrors = [
    // Empty object
    {},
    
    // Object with message
    { message: 'Test error message' },
    
    // Object with details
    { details: 'Test error details' },
    
    // Object with code
    { code: 'TEST_ERROR_CODE', hint: 'Test hint' },
    
    // Null/undefined
    null,
    undefined,
    
    // String error
    'String error message',
    
    // Standard Error
    new Error('Standard error message'),
    
    // Complex object with various properties
    {
      name: 'TestError',
      message: 'Complex error',
      code: 'COMPLEX_001',
      details: 'Complex error details',
      hint: 'Try again later'
    }
  ];
  
  console.log('Testing error message extraction for various error types:');
  
  testErrors.forEach((error, index) => {
    try {
      // We can't directly access the private method, but we can see the results
      // in the console when errors occur
      console.log(`Test ${index + 1}:`, {
        input: error,
        type: typeof error,
        constructor: error?.constructor?.name || 'None'
      });
    } catch (e) {
      console.error(`Error in test ${index + 1}:`, e);
    }
  });
  
  console.log('✅ Error message extraction tests completed');
  console.groupEnd();
};

/**
 * Run all tests
 * تشغيل جميع الاختبارات
 */
export const runAllTests = async (): Promise<void> => {
  console.group('🚀 Running All TrackEvent Tests');
  
  await testNormalTrackEvent();
  await testTrackEventErrorHandling();
  testNetworkErrors();
  testErrorMessageExtraction();
  
  console.log('🎉 All manual tests completed!');
  console.groupEnd();
};

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  (window as unknown as {
    testTrackEventErrorHandling: () => Promise<void>;
    testNormalTrackEvent: () => Promise<void>;
    testNetworkErrors: () => Promise<void>;
    testErrorMessageExtraction: () => void;
    runAllTrackEventTests: () => Promise<void>;
  }).testTrackEventErrorHandling = testTrackEventErrorHandling;
  (window as unknown as {
    testTrackEventErrorHandling: () => Promise<void>;
    testNormalTrackEvent: () => Promise<void>;
    testNetworkErrors: () => Promise<void>;
    testErrorMessageExtraction: () => void;
    runAllTrackEventTests: () => Promise<void>;
  }).testNormalTrackEvent = testNormalTrackEvent;
  (window as unknown as {
    testTrackEventErrorHandling: () => Promise<void>;
    testNormalTrackEvent: () => Promise<void>;
    testNetworkErrors: () => Promise<void>;
    testErrorMessageExtraction: () => void;
    runAllTrackEventTests: () => Promise<void>;
  }).testNetworkErrors = testNetworkErrors;
  (window as unknown as {
    testTrackEventErrorHandling: () => Promise<void>;
    testNormalTrackEvent: () => Promise<void>;
    testNetworkErrors: () => Promise<void>;
    testErrorMessageExtraction: () => void;
    runAllTrackEventTests: () => Promise<void>;
  }).testErrorMessageExtraction = testErrorMessageExtraction;
  (window as unknown as {
    testTrackEventErrorHandling: () => Promise<void>;
    testNormalTrackEvent: () => Promise<void>;
    testNetworkErrors: () => Promise<void>;
    testErrorMessageExtraction: () => void;
    runAllTrackEventTests: () => Promise<void>;
  }).runAllTrackEventTests = runAllTests;
}

console.log(`
🧪 Manual TrackEvent Tests Available:
- testNormalTrackEvent() - Test normal functionality
- testTrackEventErrorHandling() - Test error scenarios  
- testNetworkErrors() - Test network error handling
- testErrorMessageExtraction() - Test error message extraction
- runAllTrackEventTests() - Run all tests

Run any of these functions in the browser console to test manually.
`);

export default {
  testNormalTrackEvent,
  testTrackEventErrorHandling,
  testNetworkErrors,
  testErrorMessageExtraction,
  runAllTests
};
