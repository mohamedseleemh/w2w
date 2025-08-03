/**
 * Custom Error Handling Hook
 * Hook مخصص لمعالجة الأخطاء
 * 
 * يوفر طرق محسنة لمعالجة الأخطاء في مكونات React
 */

import { useState, useCallback } from 'react';
import { showErrorToast, showSuccessToast, showWarningToast } from '../utils/errorToast';

interface UseErrorHandlerReturn {
  error: string | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: unknown, context?: string) => void;
  handleAsyncError: <T>(
    asyncOperation: () => Promise<T>,
    context?: string,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown) => void
  ) => Promise<T | null>;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  withErrorHandling: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => (...args: T) => Promise<R | null>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: unknown, context?: string) => {
    let errorMessage = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      const obj = error as Record<string, any>;
      errorMessage = obj.message || obj.error || obj.details || 'حدث خطأ غير متوقع';
    } else {
      errorMessage = 'حدث خطأ غير متوقع';
    }

    setError(errorMessage);
    showErrorToast(error, context);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown) => void
  ): Promise<T | null> => {
    try {
      clearError();
      const result = await asyncOperation();
      onSuccess?.(result);
      return result;
    } catch (error) {
      handleError(error, context);
      onError?.(error);
      return null;
    }
  }, [handleError, clearError]);

  const showSuccess = useCallback((message: string) => {
    clearError();
    showSuccessToast(message);
  }, [clearError]);

  const showWarning = useCallback((message: string) => {
    showWarningToast(message);
  }, []);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      return handleAsyncError(() => fn(...args), context);
    };
  }, [handleAsyncError]);

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
    handleAsyncError,
    showSuccess,
    showWarning,
    withErrorHandling
  };
};

/**
 * Hook for handling form errors specifically
 * Hook مخصص لمعالجة أخطاء النماذج
 */
export const useFormErrorHandler = () => {
  const { error, handleError, clearError, showSuccess } = useErrorHandler();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, errorMessage: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const handleFormSubmit = useCallback(async <T>(
    submitFunction: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      clearError();
      clearAllFieldErrors();
      
      const result = await submitFunction();
      
      if (successMessage) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (error) {
      // Check if it's a validation error with field-specific errors
      if (error instanceof Error && error.message.includes('validation')) {
        try {
          const validationData = JSON.parse(error.message.replace('validation:', ''));
          if (validationData.fields) {
            setFieldErrors(validationData.fields);
            return null;
          }
        } catch (parseError) {
          // If parsing fails, treat as general error
        }
      }
      
      handleError(error, 'form submission');
      return null;
    }
  }, [clearError, clearAllFieldErrors, showSuccess, handleError]);

  return {
    error,
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    handleFormSubmit,
    clearError
  };
};

/**
 * Hook for handling API errors specifically
 * Hook مخصص لمعالجة أخطاء API
 */
export const useApiErrorHandler = () => {
  const { handleAsyncError, showSuccess, showWarning } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: {
      context?: string;
      loadingState?: boolean;
      successMessage?: string;
      onSuccess?: (result: T) => void;
      onError?: (error: unknown) => void;
    } = {}
  ): Promise<T | null> => {
    const {
      context = 'API call',
      loadingState = true,
      successMessage,
      onSuccess,
      onError
    } = options;

    if (loadingState) {
      setLoading(true);
    }

    try {
      const result = await handleAsyncError(
        apiCall,
        context,
        (result) => {
          if (successMessage) {
            showSuccess(successMessage);
          }
          onSuccess?.(result);
        },
        onError
      );

      return result;
    } finally {
      if (loadingState) {
        setLoading(false);
      }
    }
  }, [handleAsyncError, showSuccess]);

  return {
    loading,
    handleApiCall,
    showSuccess,
    showWarning
  };
};

/**
 * Hook for handling retry logic with exponential backoff
 * Hook لمعالجة منطق إعادة المحاولة مع التأخير المتزايد
 */
export const useRetryHandler = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { handleAsyncError } = useErrorHandler();

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      context?: string;
    } = {}
  ): Promise<T | null> => {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, context } = options;

    setIsRetrying(true);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        const result = await operation();
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          // Final attempt failed
          setIsRetrying(false);
          setRetryCount(0);
          return await handleAsyncError(() => Promise.reject(error), context);
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        
        // Add some jitter to prevent thundering herd
        const jitter = Math.random() * 0.3 * delay;
        const finalDelay = delay + jitter;

        await new Promise(resolve => setTimeout(resolve, finalDelay));
      }
    }

    setIsRetrying(false);
    setRetryCount(0);
    return null;
  }, [handleAsyncError]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    retryCount,
    isRetrying,
    resetRetry
  };
};

export default useErrorHandler;
