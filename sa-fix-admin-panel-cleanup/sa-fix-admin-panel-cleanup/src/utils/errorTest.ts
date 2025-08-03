/**
 * Error Logging Test Utility
 * أداة اختبار تسجيل الأخطاء
 * 
 * Use this to test the error logging improvements
 * استخدم هذا لاختبار تحسينات تسجيل الأخطاء
 */

import { logError, logWarning, logInfo, errorHandlers } from './errorHandler';
import { testTrackEventErrors } from './trackEventTest';

/**
 * Test different types of error logging
 * اختبار أنواع مختلفة من تسجيل الأخطاء
 */
export const testErrorLogging = () => {
  console.group('🧪 Testing Error Logging');

  // Test 1: Standard Error object
  try {
    throw new Error('This is a test error');
  } catch (error) {
    logError(error, 'Test: Standard Error', {
      component: 'ErrorTest',
      action: 'test_standard_error'
    });
  }

  // Test 2: Simulated Supabase error
  const fakeSupabaseError = {
    message: 'Database connection failed',
    code: '08006',
    details: 'Connection to server failed',
    hint: 'Check your network connection'
  };
  
  errorHandlers.database(fakeSupabaseError, 'test_connection', 'test_table');

  // Test 3: String error
  logError('Simple string error', 'Test: String Error');

  // Test 4: Unknown error type
  logError({ weird: 'object', number: 42 }, 'Test: Unknown Error Type');

  // Test 5: Network error
  errorHandlers.network(
    new Error('Network timeout'),
    '/api/test-endpoint',
    'POST'
  );

  // Test 6: User action error
  errorHandlers.userAction(
    new Error('User action failed'),
    'test_button_click',
    'test-user-123'
  );

  // Test 7: Warning
  logWarning('This is a test warning', {
    component: 'ErrorTest',
    action: 'test_warning'
  });

  // Test 8: Info
  logInfo('This is a test info message', { data: 'test' });

  console.groupEnd();

  console.log("🎯 Running specific trackEvent tests...");
  runTrackEventTests();
};

async function runTrackEventTests() {
  await testTrackEventErrors();
  console.log("✅ All error logging tests completed. Check the logs above for properly formatted error messages.");
}

/**
 * Simulate the original "[object Object]" error
 * محاكاة خطأ "[object Object]" الأصلي
 */
export const simulateOriginalError = () => {
  console.group('❌ Simulating Original Error (BAD)');
  
  const fakeError = {
    message: 'Database connection failed',
    code: '08006',
    details: 'Connection to server failed'
  };
  
  // This is what was happening before (BAD)
  console.error('Failed to track event:', fakeError);
  
  console.groupEnd();
};

/**
 * Show the fixed error logging
 * إظهار تسجيل الأخطاء المُصحح
 */
export const showFixedErrorLogging = () => {
  console.group('✅ Fixed Error Logging (GOOD)');
  
  const fakeError = {
    message: 'Database connection failed',
    code: '08006',
    details: 'Connection to server failed'
  };
  
  // This is the new improved way (GOOD)
  errorHandlers.database(fakeError, 'track_event', 'analytics_events');
  
  console.groupEnd();
};
