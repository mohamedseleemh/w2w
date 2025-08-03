/**
 * Security Features Verification Test
 * Tests all implemented security measures
 */

import { hashPassword, verifyPassword, validatePasswordStrength, createSecureSession } from './auth';
import { sanitizeCSS } from './cssSanitizer';

export const runSecurityTests = async (): Promise<boolean> => {
  try {
    console.log('🔐 Starting Security Tests...');
    
    // Test 1: Password Hashing
    const testPassword = 'SecurePass123!@#';
    const hashedPassword = await hashPassword(testPassword);
    const isValidPassword = await verifyPassword(testPassword, hashedPassword);
    
    if (!isValidPassword) {
      console.error('❌ Password hashing test failed');
      return false;
    }
    console.log('✅ Password hashing: PASSED');
    
    // Test 2: Password Strength Validation
    const weakPassword = '123';
    const strongPassword = 'StrongPass123!@#';
    
    const weakValidation = validatePasswordStrength(weakPassword);
    const strongValidation = validatePasswordStrength(strongPassword);
    
    if (weakValidation.isValid || !strongValidation.isValid) {
      console.error('❌ Password strength validation test failed');
      return false;
    }
    console.log('✅ Password strength validation: PASSED');
    
    // Test 3: CSS Sanitization
    const maliciousCSS = `
      .test { 
        color: red; 
        behavior: url(evil.htc); 
        -moz-binding: url(evil.xml); 
        expression: evil(); 
      }
    `;
    
    const sanitizedCSS = sanitizeCSS(maliciousCSS);
    
    if (sanitizedCSS.includes('behavior') || sanitizedCSS.includes('binding') || sanitizedCSS.includes('expression')) {
      console.error('❌ CSS sanitization test failed');
      return false;
    }
    console.log('✅ CSS sanitization: PASSED');
    
    // Test 4: Session Creation
    const session = createSecureSession('testUser');
    
    if (!session || !session.token || !session.expiresAt) {
      console.error('❌ Session creation test failed');
      return false;
    }
    console.log('✅ Session creation: PASSED');
    
    console.log('🎉 All Security Tests PASSED!');
    return true;
    
  } catch (error) {
    console.error('❌ Security test error:', error);
    return false;
  }
};

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  runSecurityTests().then(success => {
    if (success) {
      console.log('🔐 Security verification completed successfully!');
    } else {
      console.error('🚨 Security verification failed!');
    }
  });
}
