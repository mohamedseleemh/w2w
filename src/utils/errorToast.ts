/**
 * Enhanced Error Toast Handler
 * معالج محسن لرسائل الأخطاء
 * 
 * يوفر عرض رسائل أخطاء مفهومة ومترجمة للمستخدم
 */

import toast from 'react-hot-toast';
import { errorHandlers } from './errorHandler';

export interface ErrorToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  showStack?: boolean;
  autoHide?: boolean;
}

/**
 * Show error toast with better messages
 * عرض رسالة خطأ محسنة
 */
export const showErrorToast = (
  error: unknown, 
  context?: string,
  options: ErrorToastOptions = {}
): void => {
  const { duration = 4000, position = 'top-center', showStack = false } = options;
  
  let message = '';
  
  // Extract user-friendly error message
  if (error instanceof Error) {
    message = translateErrorMessage(error.message, context);
  } else if (typeof error === 'string') {
    message = translateErrorMessage(error, context);
  } else if (error && typeof error === 'object') {
    const obj = error as Record<string, any>;
    
    // Handle common error patterns
    if (obj.message) {
      message = translateErrorMessage(obj.message, context);
    } else if (obj.error) {
      message = translateErrorMessage(obj.error, context);
    } else if (obj.details) {
      message = translateErrorMessage(obj.details, context);
    } else {
      message = getGenericErrorMessage(context);
    }
  } else {
    message = getGenericErrorMessage(context);
  }

  // Show toast
  toast.error(message, {
    duration,
    position,
    style: {
      background: '#FEE2E2',
      color: '#DC2626',
      border: '1px solid #FECACA',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '400px',
      textAlign: 'right' as const,
      direction: 'rtl' as const
    },
  });

  // Log the original error for debugging
  if (showStack || import.meta.env.DEV) {
    console.error('Error details:', error);
  }
};

/**
 * Show success toast
 * عرض رسالة نجاح
 */
export const showSuccessToast = (
  message: string,
  options: ErrorToastOptions = {}
): void => {
  const { duration = 3000, position = 'top-center' } = options;
  
  toast.success(message, {
    duration,
    position,
    style: {
      background: '#DCFCE7',
      color: '#166534',
      border: '1px solid #BBF7D0',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '400px',
      textAlign: 'right' as const,
      direction: 'rtl' as const
    },
  });
};

/**
 * Show warning toast
 * عرض رسالة تحذير
 */
export const showWarningToast = (
  message: string,
  options: ErrorToastOptions = {}
): void => {
  const { duration = 3500, position = 'top-center' } = options;
  
  toast(message, {
    duration,
    position,
    icon: '⚠️',
    style: {
      background: '#FEF3C7',
      color: '#D97706',
      border: '1px solid #FDE68A',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '400px',
      textAlign: 'right' as const,
      direction: 'rtl' as const
    },
  });
};

/**
 * Show info toast
 * عرض رسالة معلومات
 */
export const showInfoToast = (
  message: string,
  options: ErrorToastOptions = {}
): void => {
  const { duration = 3000, position = 'top-center' } = options;
  
  toast(message, {
    duration,
    position,
    icon: 'ℹ️',
    style: {
      background: '#DBEAFE',
      color: '#1D4ED8',
      border: '1px solid #BFDBFE',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '400px',
      textAlign: 'right' as const,
      direction: 'rtl' as const
    },
  });
};

/**
 * Translate common error messages to Arabic
 * ترجمة رسائل الأخطاء الشائعة للعربية
 */
const translateErrorMessage = (errorMessage: string, context?: string): string => {
  const message = errorMessage.toLowerCase();
  
  // Network and fetch errors
  if (message.includes('failed to fetch') || message.includes('network error')) {
    return 'فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.';
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.';
  }
  
  // Authentication errors
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
  }
  
  if (message.includes('forbidden') || message.includes('403')) {
    return 'ليس لديك صلاحية للقيام بهذا الإجراء.';
  }
  
  // Database errors
  if (message.includes('database') || message.includes('sql') || message.includes('connection')) {
    return 'مشكلة في قاعدة البيانات. تم حفظ البيانات محلياً.';
  }
  
  // Validation errors
  if (message.includes('required') || message.includes('missing')) {
    return 'يرجى ملء جميع الحقول المطلوبة.';
  }
  
  if (message.includes('invalid') || message.includes('malformed')) {
    return 'البيانات المدخلة غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
  }
  
  // File upload errors
  if (message.includes('file') && (message.includes('too large') || message.includes('size'))) {
    return 'حجم الملف كبير جداً. يرجى اختيار ملف أصغر.';
  }
  
  if (message.includes('file') && message.includes('type')) {
    return 'نوع الملف غير مدعوم. يرجى اختيار ملف من النوع المسموح.';
  }
  
  // Permission errors
  if (message.includes('permission') || message.includes('access denied')) {
    return 'ليس لديك الصلاحية الكافية لهذا الإجراء.';
  }
  
  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'تم تجاوز الحد الأقصى للطلبات. يرجى الانتظار قليلاً.';
  }
  
  // Server errors
  if (message.includes('500') || message.includes('internal server error')) {
    return 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
  }
  
  if (message.includes('502') || message.includes('bad gateway')) {
    return 'الخادم غير متاح حالياً. يرجى المحاولة لاحقاً.';
  }
  
  if (message.includes('503') || message.includes('service unavailable')) {
    return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
  }
  
  // Context-specific errors
  if (context) {
    switch (context.toLowerCase()) {
      case 'template':
      case 'page template':
        if (message.includes('save') || message.includes('saving')) {
          return 'فشل في حفظ القالب. تم الحفظ محلياً كنسخة احتياطية.';
        }
        if (message.includes('load') || message.includes('loading')) {
          return 'فشل في تحميل القالب. تم استخدام القالب الافتراض��.';
        }
        break;
        
      case 'customization':
        if (message.includes('load') || message.includes('loading')) {
          return 'فشل في تحميل إعدادات التخصيص. تم استخدام الإعدادات الافتراضية.';
        }
        if (message.includes('save') || message.includes('saving')) {
          return 'فشل في حفظ التخصيص. تم الحفظ محلياً كنسخة احتياطية.';
        }
        break;
        
      case 'login':
        return 'فشل في تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.';
        
      case 'registration':
        return 'فشل في إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.';
        
      case 'upload':
        return 'فشل في رفع الملف. تحقق من نوع وحجم الملف.';
    }
  }
  
  // If the message is already in Arabic, return it as is
  if (containsArabic(errorMessage)) {
    return errorMessage;
  }
  
  // Return translated message or generic fallback
  return getGenericErrorMessage(context);
};

/**
 * Get generic error message based on context
 * الحصول على رسالة خطأ عامة حسب السياق
 */
const getGenericErrorMessage = (context?: string): string => {
  if (context) {
    switch (context.toLowerCase()) {
      case 'template':
      case 'page template':
        return 'حدث خطأ في القالب. يرجى المحاولة مرة أخرى.';
      case 'customization':
        return 'حدث خطأ في التخصيص. يرجى المحاولة مرة أخرى.';
      case 'save':
      case 'saving':
        return 'فشل في الحفظ. يرجى المحاولة مرة أخرى.';
      case 'load':
      case 'loading':
        return 'فشل في التحميل. يرجى تحديث الصفحة.';
      case 'delete':
        return 'فشل في الحذف. يرجى المحاولة مرة أخرى.';
      case 'update':
        return 'فشل في التحديث. يرجى المحاولة مرة أخرى.';
      default:
        return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }
  
  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو تحديث الصفحة.';
};

/**
 * Check if string contains Arabic characters
 * التحقق من وجود أحرف عربية في النص
 */
const containsArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicPattern.test(text);
};

/**
 * Handle and show error with context
 * معالجة وعرض الخطأ مع السياق
 */
export const handleError = (
  error: unknown,
  context?: string,
  options: ErrorToastOptions = {}
): void => {
  // Log the error for debugging
  console.error(`Error in ${context || 'unknown context'}:`, error);
  
  // Show user-friendly toast
  showErrorToast(error, context, options);
};

/**
 * Async wrapper that handles errors
 * مغلف غير متزامن لمعالجة الأخطاء
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string,
  options: ErrorToastOptions = {}
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, context, options);
    return null;
  }
};

/**
 * Component error boundary helper
 * مساعد لحدود الأخطاء في المكونات
 */
export const handleComponentError = (
  error: Error,
  componentName: string
): void => {
  console.error(`Error in component ${componentName}:`, error);
  
  showErrorToast(
    'حدث خطأ في عرض هذا الجزء من الصفحة. يرجى تحديث الصفحة.',
    componentName,
    { duration: 5000 }
  );
};

export default {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
  showInfoToast,
  handleError,
  withErrorHandling,
  handleComponentError
};
