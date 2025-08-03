import React from 'react';
import { AlertCircle, RefreshCw, Shield } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 shadow-lg">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="flex items-center space-x-reverse space-x-2 mb-2">
        <Shield className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-red-900">حدث خطأ مؤقت</h3>
      </div>
      <p className="text-red-700 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="flex items-center space-x-reverse space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة المحاولة</span>
          </button>
          <p className="text-xs text-gray-500 text-center">
            إذا استمر الخطأ، يرجى التواصل مع الدعم الفني
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
