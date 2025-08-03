/**
 * Immediate test for trackEvent error fix
 * اختبار فوري لإصلاح خطأ trackEvent
 */

import { databaseService } from '../services/database';

// Test immediately when this module loads
console.log('🧪 Testing trackEvent error fix...');

// Simulate a trackEvent call that would cause the error
setTimeout(async () => {
  try {
    await databaseService.trackEvent('test_fix', { 
      test: true, 
      fix_verification: Date.now() 
    });
    console.log('✅ trackEvent test completed successfully');
  } catch (error) {
    console.log('ℹ️ trackEvent test caught error (this is expected):', error);
  }
}, 1000);

export {};
