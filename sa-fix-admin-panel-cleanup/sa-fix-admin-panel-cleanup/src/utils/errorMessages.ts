/**
 * Error Messages in Arabic and English
 * رسائل الأخطاء باللغة العربية والإنجليزية
 * 
 * Centralized error messages for consistent user experience
 * رسائل أخطاء مركزية لتجربة مستخدم متسقة
 */

export interface ErrorMessage {
  ar: string;
  en: string;
}

/**
 * Database related errors
 * الأخطاء المتعلقة بقاعدة البيانات
 */
export const databaseErrors: Record<string, ErrorMessage> = {
  connection_failed: {
    ar: 'فشل في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.',
    en: 'Failed to connect to database. Please try again.'
  },
  not_found: {
    ar: 'البيانات المطلوبة غير موجودة.',
    en: 'Requested data not found.'
  },
  duplicate_entry: {
    ar: 'البيانات موجودة مسبقاً. يرجى التحقق من المدخلات.',
    en: 'Data already exists. Please check your input.'
  },
  validation_failed: {
    ar: 'البيانات المدخلة غير صحيحة. يرجى التحقق من المعلومات.',
    en: 'Invalid data provided. Please check your information.'
  },
  permission_denied: {
    ar: 'ليس لديك صلاحية للوصول إلى هذه البيانات.',
    en: 'You do not have permission to access this data.'
  },
  timeout: {
    ar: 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.',
    en: 'Connection timeout. Please try again.'
  }
};

/**
 * Authentication related errors
 * الأخطاء المتعلقة بالمصادقة
 */
export const authErrors: Record<string, ErrorMessage> = {
  invalid_credentials: {
    ar: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    en: 'Invalid username or password.'
  },
  session_expired: {
    ar: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
    en: 'Session expired. Please login again.'
  },
  access_denied: {
    ar: 'تم رفض الوصول. ليس لديك صلاحية لهذا الإجراء.',
    en: 'Access denied. You do not have permission for this action.'
  },
  account_locked: {
    ar: 'تم قفل الحساب. يرجى التواصل مع الدعم الفني.',
    en: 'Account locked. Please contact technical support.'
  },
  password_weak: {
    ar: 'كلمة المرور ضعيفة. يجب أن تحتوي على 8 أحرف على الأقل.',
    en: 'Password is weak. Must contain at least 8 characters.'
  }
};

/**
 * Order related errors
 * الأخطاء المتعلقة بالطلبات
 */
export const orderErrors: Record<string, ErrorMessage> = {
  order_creation_failed: {
    ar: 'فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى.',
    en: 'Failed to create order. Please try again.'
  },
  invalid_service: {
    ar: 'الخدمة المحددة غير متوفرة أو غير صحيحة.',
    en: 'Selected service is not available or invalid.'
  },
  missing_customer_info: {
    ar: 'معلومات العميل مطلوبة. يرجى ملء جميع الحقول المطلوبة.',
    en: 'Customer information required. Please fill all required fields.'
  },
  order_not_found: {
    ar: 'الطلب غير موجود أو تم حذفه.',
    en: 'Order not found or has been deleted.'
  },
  order_already_processed: {
    ar: 'تم معالجة هذا الطلب مسبقاً.',
    en: 'This order has already been processed.'
  },
  payment_method_required: {
    ar: 'يرجى اختيار طريقة الدفع.',
    en: 'Please select a payment method.'
  }
};

/**
 * Service related errors
 * الأخطاء المتعلقة بالخدمات
 */
export const serviceErrors: Record<string, ErrorMessage> = {
  service_unavailable: {
    ar: 'الخدمة غير متوفرة حالياً. يرجى المحاولة لاحقاً.',
    en: 'Service is currently unavailable. Please try later.'
  },
  service_creation_failed: {
    ar: 'فشل في إنشاء الخدمة. يرجى التحقق من البيانات.',
    en: 'Failed to create service. Please check the data.'
  },
  service_update_failed: {
    ar: 'فشل في تحديث الخدمة. يرجى المحاولة مرة أخرى.',
    en: 'Failed to update service. Please try again.'
  },
  service_delete_failed: {
    ar: 'فشل في حذف الخدمة. قد تكون مرتبطة بطلبات موجودة.',
    en: 'Failed to delete service. It may be linked to existing orders.'
  },
  invalid_price: {
    ar: 'سعر الخدمة غير صحيح. يرجى إدخال سعر صحيح.',
    en: 'Invalid service price. Please enter a valid price.'
  }
};

/**
 * Payment related errors
 * الأخطاء المتعلقة بالدفع
 */
export const paymentErrors: Record<string, ErrorMessage> = {
  payment_failed: {
    ar: 'فشل في معالجة الدفع. يرجى التحقق من بيانات الدفع.',
    en: 'Payment processing failed. Please check payment details.'
  },
  invalid_payment_method: {
    ar: 'طريقة الدفع غير صحيحة أو غير مدعومة.',
    en: 'Invalid or unsupported payment method.'
  },
  insufficient_funds: {
    ar: 'رصيد غير كافي. يرجى التحقق من الرصيد.',
    en: 'Insufficient funds. Please check your balance.'
  },
  payment_timeout: {
    ar: 'انتهت مهلة معالجة الدفع. يرجى المحاولة مرة أخرى.',
    en: 'Payment processing timeout. Please try again.'
  },
  payment_method_creation_failed: {
    ar: 'فشل في إضافة طريقة الدفع. يرجى التحقق من البيانات.',
    en: 'Failed to add payment method. Please check the data.'
  }
};

/**
 * Network related errors
 * الأخطاء المتعلقة بالشبكة
 */
export const networkErrors: Record<string, ErrorMessage> = {
  network_error: {
    ar: 'خطأ في الشبكة. يرجى التحقق من اتصال الإنترنت.',
    en: 'Network error. Please check your internet connection.'
  },
  server_error: {
    ar: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    en: 'Server error. Please try again later.'
  },
  api_unavailable: {
    ar: 'الخدمة غير متوفرة حالياً. يرجى المحاولة لاحقاً.',
    en: 'API service unavailable. Please try later.'
  },
  rate_limit_exceeded: {
    ar: 'تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.',
    en: 'Rate limit exceeded. Please wait a moment.'
  }
};

/**
 * Validation errors
 * أخطاء التحقق من صحة البيانات
 */
export const validationErrors: Record<string, ErrorMessage> = {
  required_field: {
    ar: 'هذا الحقل مطلوب.',
    en: 'This field is required.'
  },
  invalid_email: {
    ar: 'عنوان البريد الإلكتروني غير صحيح.',
    en: 'Invalid email address.'
  },
  invalid_phone: {
    ar: 'رقم الهاتف غير صحيح.',
    en: 'Invalid phone number.'
  },
  invalid_format: {
    ar: 'تنسيق البيانات غير صحيح.',
    en: 'Invalid data format.'
  },
  min_length: {
    ar: 'يجب أن يحتوي على {min} أحرف على الأقل.',
    en: 'Must be at least {min} characters long.'
  },
  max_length: {
    ar: 'يجب ألا يتجاوز {max} حرف.',
    en: 'Must not exceed {max} characters.'
  }
};

/**
 * Success messages
 * رسائل النجاح
 */
export const successMessages: Record<string, ErrorMessage> = {
  order_created: {
    ar: 'تم إنشاء الطلب بنجاح! سيتم التواصل معك قريباً.',
    en: 'Order created successfully! We will contact you soon.'
  },
  service_created: {
    ar: 'تم إضافة الخدمة بنجاح!',
    en: 'Service added successfully!'
  },
  service_updated: {
    ar: 'تم تحديث الخدمة بنجاح!',
    en: 'Service updated successfully!'
  },
  service_deleted: {
    ar: 'تم حذف الخدمة بنجاح!',
    en: 'Service deleted successfully!'
  },
  payment_method_added: {
    ar: 'تم إضافة طريقة الدفع بنجاح!',
    en: 'Payment method added successfully!'
  },
  settings_saved: {
    ar: 'تم حفظ الإعدادات بنجاح!',
    en: 'Settings saved successfully!'
  },
  login_success: {
    ar: 'تم تسجيل الدخول بنجاح!',
    en: 'Login successful!'
  },
  data_synced: {
    ar: 'تم مزامنة البيانات بنجاح!',
    en: 'Data synchronized successfully!'
  }
};

/**
 * Get error message based on language preference
 * الحصول على رسالة الخطأ حسب تفضيل اللغة
 */
export const getErrorMessage = (
  category: 'database' | 'auth' | 'order' | 'service' | 'payment' | 'network' | 'validation' | 'success',
  key: string,
  language: 'ar' | 'en' = 'ar',
  replacements?: Record<string, string | number>
): string => {
  const categories = {
    database: databaseErrors,
    auth: authErrors,
    order: orderErrors,
    service: serviceErrors,
    payment: paymentErrors,
    network: networkErrors,
    validation: validationErrors,
    success: successMessages
  };

  const errorCategory = categories[category];
  const errorMessage = errorCategory?.[key];
  
  if (!errorMessage) {
    return language === 'ar' 
      ? 'حدث خطأ غير متوقع.' 
      : 'An unexpected error occurred.';
  }

  let message = errorMessage[language];
  
  // Replace placeholders if provided
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      message = message.replace(`{${placeholder}}`, String(value));
    });
  }

  return message;
};

/**
 * Get user-friendly error from any error object
 * الحصول على رسالة خطأ مفهومة من أي كائن خطأ
 */
export const getUserFriendlyError = (
  error: unknown,
  language: 'ar' | 'en' = 'ar'
): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return getErrorMessage('network', 'network_error', language);
    }
    
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return getErrorMessage('auth', 'access_denied', language);
    }
    
    if (error.message.includes('timeout')) {
      return getErrorMessage('database', 'timeout', language);
    }
    
    if (error.message.includes('not found')) {
      return getErrorMessage('database', 'not_found', language);
    }
    
    // Return the original message if it's in Arabic
    if (/[\u0600-\u06FF]/.test(error.message)) {
      return error.message;
    }
  }

  // Fallback to generic error message
  return language === 'ar' 
    ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' 
    : 'An unexpected error occurred. Please try again.';
};

export default {
  getErrorMessage,
  getUserFriendlyError,
  databaseErrors,
  authErrors,
  orderErrors,
  serviceErrors,
  paymentErrors,
  networkErrors,
  validationErrors,
  successMessages
};
