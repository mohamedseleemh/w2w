/**
 * Error Testing Component
 * مكون اختبار الأخطاء
 * 
 * For testing and debugging error handling improvements
 * لاختبار وتشخيص تحسينات معالجة الأخطاء
 */

import React, { useState } from 'react';
import { useErrorHandler, useApiErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay, DatabaseError, NetworkError } from '../ui/ErrorDisplay';
import { landingPageService } from '../../services/landingPageService';
import { showErrorToast, showSuccessToast } from '../../utils/errorToast';

const ErrorTest: React.FC = () => {
  const { error, handleError, clearError, showSuccess } = useErrorHandler();
  const { loading, handleApiCall } = useApiErrorHandler();
  const [testResult, setTestResult] = useState<string>('');

  const testDatabaseError = async () => {
    await handleApiCall(
      () => {
        throw new Error('Database connection failed');
      },
      {
        context: 'template',
        successMessage: 'تم بنجاح!',
        onError: () => setTestResult('تم اختبار خطأ قاعدة البيانات')
      }
    );
  };

  const testNetworkError = async () => {
    await handleApiCall(
      () => {
        throw new Error('Failed to fetch');
      },
      {
        context: 'customization',
        onError: () => setTestResult('تم اختبار خطأ الشبكة')
      }
    );
  };

  const testTemplateLoad = async () => {
    setTestResult('جاري اختبار تحميل القوالب...');
    await handleApiCall(
      () => landingPageService.getPageTemplates(),
      {
        context: 'template',
        successMessage: 'تم تحميل القوالب بنجاح!',
        onSuccess: (templates) => {
          setTestResult(`تم تحميل ${templates.length} قالب`);
        },
        onError: () => setTestResult('فشل في تحميل القوالب')
      }
    );
  };

  const testCustomizationLoad = async () => {
    setTestResult('جاري اختبار تحميل التخصيص...');
    await handleApiCall(
      () => landingPageService.getLandingCustomization(),
      {
        context: 'customization',
        successMessage: 'تم تحميل التخصيص بنجاح!',
        onSuccess: (customizations) => {
          setTestResult(`تم تحميل ${customizations.length} تخصيص`);
        },
        onError: () => setTestResult('فشل في تحميل التخصيص')
      }
    );
  };

  const testToastMessages = () => {
    showErrorToast('هذا اختبار رسالة خطأ', 'test');
    setTimeout(() => showSuccessToast('هذا اختبار رسالة نجاح'), 1000);
    setTimeout(() => {
      showErrorToast(new Error('[object Object]'), 'template');
    }, 2000);
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50" dir="rtl">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">اختبار معالجة الأخطاء</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testDatabaseError}
          disabled={loading}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
        >
          اختبار خطأ قاعدة البيانات
        </button>
        
        <button
          onClick={testNetworkError}
          disabled={loading}
          className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
        >
          اختبار خطأ الشبكة
        </button>
        
        <button
          onClick={testTemplateLoad}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          اختبار تحميل القوالب
        </button>
        
        <button
          onClick={testCustomizationLoad}
          disabled={loading}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          اختبار تحميل التخصيص
        </button>
        
        <button
          onClick={testToastMessages}
          className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          اختبار رسائل Toast
        </button>
      </div>

      {loading && (
        <div className="text-blue-600 text-sm mb-2">
          جاري التحميل...
        </div>
      )}

      {testResult && (
        <div className="text-sm text-gray-600 mb-2 p-2 bg-gray-100 rounded">
          {testResult}
        </div>
      )}

      {error && (
        <ErrorDisplay
          error={error}
          variant="inline"
          showRetry={true}
          onRetry={clearError}
          className="mb-2"
        />
      )}

      <div className="text-xs text-gray-500 mt-2">
        هذا المكون يظهر فقط في وضع التطوير
      </div>
    </div>
  );
};

export default ErrorTest;
