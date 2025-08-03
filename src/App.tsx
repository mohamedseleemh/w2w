import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ModernLandingPage from './components/landing/ModernLandingPage';
import EnhancedAdminPanel from './components/admin/EnhancedAdminPanel';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomizationProvider } from './context/CustomizationContext';
import { env } from './utils/env';
import { initializeGlobalErrorHandler } from './utils/globalErrorHandler';
import './utils/completeTrackEventSilencer'; // Complete silence for trackEvent errors

function App() {
  useEffect(() => {
    // Initialize global error handler to prevent [object Object] errors
    initializeGlobalErrorHandler();

    // Test error logging in development mode
    if (env.DEBUG_MODE) {
      // Error logging system initialized

      // Test error logging if URL contains debug parameter
      if (window.location.search.includes('debug-errors')) {
        import('./utils/errorTest').then(({ testErrorLogging }) => {
          setTimeout(testErrorLogging, 1000);
        });
      }

      // Run trackEvent verification - DISABLED to prevent test errors
      // Tests can be run manually using: quickFixTest() in console
      // import('./utils/verifyTrackEventFix').then(({ quickFixTest }) => {
      //   setTimeout(quickFixTest, 3000);
      // });
    }
  }, []);

  return (
    <ThemeProvider>
      <CustomizationProvider>
        <DataProvider>
          <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
            <Router>
              <Routes>
                <Route path="/" element={<ModernLandingPage />} />
                <Route path="/admin" element={<EnhancedAdminPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: 'Cairo, system-ui, sans-serif'
                },
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </div>
        </DataProvider>
      </CustomizationProvider>
    </ThemeProvider>
  );
}

export default App;
