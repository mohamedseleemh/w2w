import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DynamicLandingPage from './components/DynamicLandingPage';
import EnhancedAdminPanel from './components/admin/EnhancedAdminPanel';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { CustomizationProvider } from './context/CustomizationContext';
import { env } from './utils/env';
import { initializeGlobalErrorHandler } from './utils/globalErrorHandler';
// Track event errors are handled by global error handler

function App() {
  useEffect(() => {
    // Initialize global error handler to prevent [object Object] errors
    initializeGlobalErrorHandler();

    // Test error logging in development mode
    if (env.DEBUG_MODE) {
      // Error logging system initialized

      // Debug mode enabled - error logging system initialized
      console.log('🛠️ Debug mode active - enhanced error handling enabled');
    }
  }, []);

  return (
    <ThemeProvider>
      <CustomizationProvider>
        <DataProvider>
          <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
            <Router>
              <Routes>
                <Route path="/" element={<DynamicLandingPage />} />
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
