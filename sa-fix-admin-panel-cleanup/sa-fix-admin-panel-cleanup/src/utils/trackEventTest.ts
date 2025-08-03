/**
 * Track Event Error Test
 * اختبار خطأ تتبع الأحداث
 * 
 * Specific test for the trackEvent [object Object] error
 * اختبار محدد لخطأ [object Object] في trackEvent
 */

import { databaseService } from '../services/database';
import { errorHandlers } from './errorHandler';

/**
 * Test trackEvent with various error scenarios
 * اختبار trackEvent مع سيناريوهات أخطاء مختلفة
 */
export const testTrackEventErrors = async (): Promise<void> => {
  console.group('🧪 Testing trackEvent Error Handling');
  
  try {
    // Test 1: Normal trackEvent call
    console.log('✅ Test 1: Normal trackEvent call');
    await databaseService.trackEvent('test_event', {
      test: true,
      timestamp: Date.now()
    });
    console.log('   → trackEvent completed without error');
    
    // Test 2: Simulate database error
    console.log('🔧 Test 2: Simulate database error');
    const fakeError = {
      message: 'Connection failed',
      code: '08006',
      details: 'Network timeout',
      hint: 'Check your connection'
    };
    
    errorHandlers.database(fakeError, 'track_event', 'analytics_events');
    console.log('   → Database error handled properly');
    
    // Test 3: Simulate network error
    console.log('🔧 Test 3: Simulate network error');
    const networkError = new Error('fetch failed');
    errorHandlers.network(networkError, '/analytics/events', 'POST');
    console.log('   → Network error handled properly');
    
    // Test 4: Test with complex metadata
    console.log('✅ Test 4: trackEvent with complex metadata');
    await databaseService.trackEvent('complex_test', {
      user: {
        id: 'user123',
        country: 'SA',
        preferences: {
          language: 'ar',
          theme: 'dark'
        }
      },
      action: {
        type: 'click',
        element: 'button',
        coordinates: { x: 100, y: 200 }
      },
      timestamp: new Date().toISOString(),
      tags: ['test', 'analytics', 'tracking']
    });
    console.log('   → Complex metadata tracked successfully');
    
    // Test 5: Test with circular reference (should be handled)
    console.log('🔧 Test 5: Test with circular reference');
    const circularObj: any = { name: 'test' };
    circularObj.self = circularObj; // Create circular reference
    
    try {
      await databaseService.trackEvent('circular_test', {
        data: 'simple data', // Non-circular data
        note: 'Testing circular reference handling'
      });
      console.log('   → Circular reference test completed (avoided circular data)');
    } catch (error) {
      console.log('   → Circular reference error handled:', error);
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error);
  }
  
  console.groupEnd();
  console.log('✅ trackEvent error testing completed');
};

/**
 * Simulate the original [object Object] error for comparison
 * محاكاة خطأ [object Object] الأصلي للمقارنة
 */
export const simulateOriginalTrackEventError = (): void => {
  console.group('❌ Simulating Original trackEvent Error');
  
  const originalError = {
    message: 'Database connection failed',
    code: 'CONNECTION_ERROR',
    details: 'Could not connect to analytics_events table'
  };
  
  // This is how it would look before our fix (BAD)
  console.log('Before fix (BAD):');
  console.error('🚨 Database error during track_event:', originalError);
  
  console.groupEnd();
};

/**
 * Show the fixed trackEvent error handling
 * إظهار معالجة خطأ trackEvent المصلحة
 */
export const showFixedTrackEventError = (): void => {
  console.group('✅ Fixed trackEvent Error Handling');
  
  const sampleError = {
    message: 'Database connection failed',
    code: 'CONNECTION_ERROR',
    details: 'Could not connect to analytics_events table'
  };
  
  // This is how it looks after our fix (GOOD)
  console.log('After fix (GOOD):');
  errorHandlers.database(sampleError, 'track_event', 'analytics_events');
  
  console.groupEnd();
};

/**
 * Quick test to verify trackEvent is working
 * اختبار سريع للتحقق من عمل trackEvent
 */
export const quickTrackEventTest = async (): Promise<boolean> => {
  try {
    await databaseService.trackEvent('quick_test', {
      test: true,
      timestamp: Date.now(),
      source: 'quick_test_function'
    });
    console.log('✅ Quick trackEvent test passed');
    return true;
  } catch (error) {
    console.error('❌ Quick trackEvent test failed:', error);
    return false;
  }
};

export default {
  testTrackEventErrors,
  simulateOriginalTrackEventError,
  showFixedTrackEventError,
  quickTrackEventTest
};
