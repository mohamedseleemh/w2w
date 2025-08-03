/**
 * Secure Authentication Utilities
 * أدوات المصادقة الآمنة
 * 
 * Provides secure password hashing and authentication
 */

import CryptoJS from 'crypto-js';

// Secure salt for password hashing
const SALT = 'KYCtrust_Secure_2024_Salt_Key';

/**
 * Hash password securely
 * تشفير كلمة ا��مرور بأمان
 */
export const hashPassword = (password: string): string => {
  // Use PBKDF2 for secure password hashing
  const hash = CryptoJS.PBKDF2(password, SALT, {
    keySize: 256 / 32,
    iterations: 10000
  });
  return hash.toString();
};

/**
 * Verify password against hash
 * التحقق من كلمة المرور مقابل التشفير
 */
export const verifyPassword = (password: string, hash: string): boolean => {
  const computedHash = hashPassword(password);
  return computedHash === hash;
};

/**
 * Generate secure random password
 * إنشاء كلمة مرور عشوائية آمنة
 */
export const generateSecurePassword = (length: number = 12): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  const types = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz', 
    '0123456789',
    '!@#$%^&*'
  ];
  
  // Add one character from each type
  types.forEach(type => {
    password += type.charAt(Math.floor(Math.random() * type.length));
  });
  
  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Validate password strength
 * التحقق من قوة كلمة المرور
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  issues: string[];
} => {
  const issues: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    issues.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  } else {
    score += 20;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    issues.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  } else {
    score += 20;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    issues.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  } else {
    score += 20;
  }

  // Number check
  if (!/\d/.test(password)) {
    issues.push('يجب أن تحتوي على رقم واحد على الأقل');
  } else {
    score += 20;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    issues.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  } else {
    score += 20;
  }

  return {
    isValid: issues.length === 0,
    score,
    issues
  };
};

/**
 * Secure session management
 * إدارة الجلسات الآمنة
 */
export const createSecureSession = (userId: string): string => {
  const timestamp = Date.now();
  const sessionData = {
    userId,
    timestamp,
    expiresAt: timestamp + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(sessionData), 
    SALT
  ).toString();
  
  return encrypted;
};

/**
 * Validate session token
 * التحقق من رمز الجلسة
 */
export const validateSession = (token: string): { isValid: boolean; userId?: string } => {
  try {
    const decrypted = CryptoJS.AES.decrypt(token, SALT);
    const sessionData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    
    if (sessionData.expiresAt < Date.now()) {
      return { isValid: false };
    }
    
    return { isValid: true, userId: sessionData.userId };
  } catch (error) {
    console.error('Error validating session:', error);
    return { isValid: false };
  }
};

/**
 * Rate limiting for login attempts
 * تحديد معدل محاولات تسجيل الدخول
 */
class LoginRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return { 
        allowed: false, 
        remainingAttempts: 0,
        resetTime: record.lastAttempt + this.windowMs
      };
    }

    // Increment count
    record.count++;
    record.lastAttempt = now;
    
    return { 
      allowed: true, 
      remainingAttempts: this.maxAttempts - record.count 
    };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new LoginRateLimiter();

/**
 * Get client identifier for rate limiting
 * الحصول على معرف العميل لتحديد المعدل
 */
export const getClientIdentifier = (): string => {
  // Use combination of IP simulation and browser fingerprint
  const userAgent = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const fingerprint = CryptoJS.SHA256(`${userAgent}-${screen}-${timezone}`).toString();
  return fingerprint.substring(0, 16);
};

export default {
  hashPassword,
  verifyPassword,
  generateSecurePassword,
  validatePasswordStrength,
  createSecureSession,
  validateSession,
  loginRateLimiter,
  getClientIdentifier
};
