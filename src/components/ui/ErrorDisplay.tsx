/**
 * Enhanced Error Display Component
 * مكون عرض الأخطاء المحسن
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorDisplayProps {
  error?: string | Error | null;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  onBack?: () => void;
  className?: string;
  variant?: 'default' | 'inline' | 'page' | 'card';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  description,
  showRetry = true,
  showHome = false,
  showBack = false,
  onRetry,
  onHome,
  onBack,
  className = '',
  variant = 'default'
}) => {
  const getErrorMessage = (): string => {
    if (!error) return '';
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'حدث خطأ غير متوقع';
  };

  const getTitle = (): string => {
    if (title) return title;
    
    const errorMsg = getErrorMessage().toLowerCase();
    
    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
      return 'مشكلة في الاتصال';
    }
    
    if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      return 'العنصر غير موجود';
    }
    
    if (errorMsg.includes('unauthorized') || errorMsg.includes('401')) {
      return 'انتهت صلاحية الجلسة';
    }
    
    if (errorMsg.includes('forbidden') || errorMsg.includes('403')) {
      return 'غير مسموح';
    }
    
    if (errorMsg.includes('database') || errorMsg.includes('server')) {
      return 'مشكلة في الخادم';
    }
    
    return 'حدث خطأ';
  };

  const getDescription = (): string => {
    if (description) return description;
    
    const errorMsg = getErrorMessage().toLowerCase();
    
    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      return 'تحقق من اتصال الإنترنت وحاول مرة أخرى.';
    }
    
    if (errorMsg.includes('database')) {
      return 'تم حفظ بياناتك محلياً. سيتم المزامنة عند استعادة الاتصال.';
    }
    
    if (errorMsg.includes('unauthorized')) {
      return 'يرجى تسجيل الدخول مرة أخرى للمتابعة.';
    }
    
    if (errorMsg.includes('not found')) {
      return 'العنصر المطلوب غير موجود أو تم حذفه.';
    }
    
    return 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة.';
  };

  const baseClasses = 'text-center';
  
  const variantClasses = {
    default: 'p-6 bg-red-50 border border-red-200 rounded-lg',
    inline: 'p-4 bg-red-50 border-l-4 border-red-400',
    page: 'min-h-[400px] flex flex-col items-center justify-center p-8',
    card: 'p-6 bg-white border border-red-200 rounded-lg shadow-sm'
  };

  const iconClasses = {
    default: 'h-12 w-12 text-red-500 mx-auto mb-4',
    inline: 'h-8 w-8 text-red-500 inline-block mb-2',
    page: 'h-16 w-16 text-red-500 mb-6',
    card: 'h-12 w-12 text-red-500 mx-auto mb-4'
  };

  const titleClasses = {
    default: 'text-lg font-semibold text-red-800 mb-2',
    inline: 'text-base font-semibold text-red-800 mb-1',
    page: 'text-2xl font-bold text-red-800 mb-4',
    card: 'text-lg font-semibold text-red-800 mb-2'
  };

  const descriptionClasses = {
    default: 'text-red-600 mb-4',
    inline: 'text-red-600 mb-2',
    page: 'text-red-600 mb-6 max-w-md',
    card: 'text-red-600 mb-4'
  };

  if (!error) return null;

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} dir="rtl">
      <AlertTriangle className={iconClasses[variant]} />
      
      <h3 className={titleClasses[variant]}>
        {getTitle()}
      </h3>
      
      <p className={descriptionClasses[variant]}>
        {getDescription()}
      </p>

      {/* Error details for development */}
      {import.meta.env.DEV && (
        <details className="mt-4 text-left">
          <summary className="text-sm text-red-700 cursor-pointer hover:text-red-800">
            تفاصيل الخطأ (للمطورين)
          </summary>
          <pre className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-xs text-red-800 overflow-auto">
            {typeof error === 'string' ? error : error?.toString()}
          </pre>
        </details>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            المحاولة مرة أخرى
          </button>
        )}
        
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            رجوع
          </button>
        )}
        
        {showHome && onHome && (
          <button
            onClick={onHome}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home className="h-4 w-4 ml-2" />
            الصفحة الرئيسية
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;

// Specialized error components
export const NetworkError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="فشل في الاتصال بالخادم"
    title="مشكلة في الاتصال"
    {...props}
  />
);

export const DatabaseError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="مشكلة في قاعدة البيانات"
    title="تم الحفظ محلياً"
    description="تم حفظ بياناتك محلياً. سيتم المزامنة عند استعادة الاتصال."
    {...props}
  />
);

export const NotFoundError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="العنصر غير موجود"
    title="غير موجود"
    description="العنصر المطلوب غير موجود أو تم حذفه."
    showHome={true}
    {...props}
  />
);

export const UnauthorizedError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="انتهت صلاحية الجلسة"
    title="يرجى تسجيل الدخول"
    description="انتهت صلاحية جلستك. يرجى تسجي�� الدخول مرة أخرى."
    showRetry={false}
    {...props}
  />
);

export const LoadingError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="فشل في تحميل البيانات"
    title="فشل التحميل"
    description="حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى."
    {...props}
  />
);

export const SaveError: React.FC<Omit<ErrorDisplayProps, 'error' | 'title'>> = (props) => (
  <ErrorDisplay
    error="فشل في الحفظ"
    title="فشل الحفظ"
    description="حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى."
    {...props}
  />
);
