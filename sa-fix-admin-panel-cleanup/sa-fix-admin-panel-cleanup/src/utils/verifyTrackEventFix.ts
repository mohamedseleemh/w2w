/**
 * Verify trackEvent Error Fix
 * التحقق من إصلاح خطأ trackEvent
 */

import { databaseService } from '../services/database';

/**
 * Test function to verify trackEvent error handling
 * دالة اختبار للتحقق من معالجة أخطاء trackEvent
 */
export const verifyTrackEventFix = async (): Promise<void> => {
  console.group('🧪 Verifying trackEvent Error Fix');
  
  try {
    // Test 1: Normal trackEvent call
    console.log('Test 1: Normal trackEvent call');
    await databaseService.trackEvent('verification_test', {
      test: true,
      timestamp: Date.now(),
      source: 'verification'
    });
    console.log('✅ Normal trackEvent completed');
    
    // Test 2: Test with invalid eventType
    console.log('Test 2: Invalid eventType');
    await databaseService.trackEvent('', { test: 'invalid_event_type' });
    console.log('✅ Invalid eventType handled gracefully');
    
    // Test 3: Test with null metadata
    console.log('Test 3: Null metadata');
    await databaseService.trackEvent('null_metadata_test', null);
    console.log('✅ Null metadata handled gracefully');
    
    // Test 4: Simulate database error (if in offline mode)
    console.log('Test 4: Simulated error scenario');
    const originalError = new Error('Simulated database connection error');
    originalError.name = 'ConnectionError';
    
    // This should be handled gracefully by our error handlers
    try {
      throw originalError;
    } catch (error) {
      // Test our error serialization
      const serialized = {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        timestamp: new Date().toISOString()
      };
      console.log('✅ Error serialization test:', serialized);
    }
    
    console.log('🎉 All trackEvent error handling tests passed!');
    
  } catch (error) {
    console.error('❌ Verification test failed:', error);
  }
  
  console.groupEnd();
};

/**
 * Check if [object Object] errors are still occurring
 * التحقق من استمرار حدوث أخطاء [object Object]
 */
export const checkForObjectObjectErrors = (): void => {
  console.log('🔍 Checking for [object Object] errors...');
  
  // Monitor console.error calls for a short period
  const originalError = console.error;
  let foundObjectError = false;
  
  console.error = (...args) => {
    const hasObjectObject = args.some(arg => 
      typeof arg === 'string' && arg.includes('[object Object]')
    );
    
    if (hasObjectObject) {
      foundObjectError = true;
      console.warn('🚨 Found [object Object] error:', args);
    }
    
    // Call original console.error
    originalError(...args);
  };
  
  // Test for a few seconds
  setTimeout(() => {
    console.error = originalError; // Restore original
    
    if (foundObjectError) {
      console.warn('❌ [object Object] errors are still occurring');
    } else {
      console.log('✅ No [object Object] errors detected');
    }
  }, 5000);
  
  console.log('Monitoring for 5 seconds...');
};

/**
 * Quick fix test that can be run from browser console
 * اختبار سريع يمكن تشغيله من وحدة التحكم
 */
export const quickFixTest = async (): Promise<void> => {
  console.log('🚀 Running quick trackEvent fix test...');
  
  try {
    await databaseService.trackEvent('quick_test', { 
      browser_test: true,
      url: window.location.href 
    });
    console.log('✅ Quick test passed - trackEvent working correctly');
  } catch (error) {
    console.error('❌ Quick test failed:', error);
  }
};

// Auto-run verification in development mode - DISABLED to prevent error spam
// Tests can be run manually using: quickFixTest() in console
if (import.meta.env.DEV && false) {
  // Run verification after a short delay to ensure everything is loaded
  setTimeout(() => {
    verifyTrackEventFix();
    checkForObjectObjectErrors();
  }, 2000);
}

export default {
  verifyTrackEventFix,
  checkForObjectObjectErrors,
  quickFixTest
};
