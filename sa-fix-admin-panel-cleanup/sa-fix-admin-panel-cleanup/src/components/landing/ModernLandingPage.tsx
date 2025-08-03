import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import SEOOptimizer from '../optimization/SEOOptimizer';
import PerformanceTracker from '../optimization/PerformanceTracker';
import CustomElementsRenderer from '../CustomElementsRenderer';

const ModernLandingPage: React.FC = () => {
  // Hooks
  const { siteSettings, loading, error, refreshData } = useData();
  const { language } = useTheme();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SEOOptimizer 
        title={siteSettings?.company_name || "KYCtrust - خدمات التحقق الرقمية المتطورة"}
        description="منصة رائدة في خدمات التحقق الرقمية والخدمات المالية المتطورة مع تقنيات حديثة وأمان عالي"
        keywords="KYC, التحقق الرقمي, الخدمات المالية, الأمان الرقمي, التكنولوجيا المالية"
      />
      <PerformanceTracker />
      <CustomElementsRenderer />
    </div>
  );
};

export default ModernLandingPage;
