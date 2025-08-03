import { useState, useEffect } from 'react';
import { appStateManager, appState, type AppState } from '../services/stateManager';

// React hook for using app state
export const useAppState = () => {
  const [state, setState] = useState<AppState>(appStateManager.getState());
  
  useEffect(() => {
    const unsubscribe = appStateManager.subscribe((newState) => {
      setState(newState);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    state,
    actions: appState,
  };
};

// Hook for specific state fields
export const useAppStateField = <K extends keyof AppState>(field: K) => {
  const [value, setValue] = useState<AppState[K]>(appStateManager.getField(field));
  
  useEffect(() => {
    const unsubscribe = appStateManager.subscribe((newState) => {
      setValue(newState[field]);
    });
    
    return unsubscribe;
  }, [field]);
  
  return value;
};

// Hook for loading state
export const useLoading = () => {
  const loading = useAppStateField('isLoading');
  
  return {
    loading,
    setLoading: appState.setLoading,
  };
};

// Hook for error state
export const useError = () => {
  const error = useAppStateField('error');
  
  return {
    error,
    setError: appState.setError,
    clearError: appState.clearError,
  };
};

// Hook for theme management
export const useThemeState = () => {
  const theme = useAppStateField('theme');
  
  return {
    theme,
    setTheme: appState.setTheme,
    isDark: theme === 'dark',
  };
};

// Hook for language management
export const useLanguageState = () => {
  const language = useAppStateField('language');
  
  return {
    language,
    setLanguage: appState.setLanguage,
    isArabic: language === 'ar',
  };
};

// Hook for modal management
export const useModal = () => {
  const activeModal = useAppStateField('activeModal');
  
  return {
    activeModal,
    openModal: appState.openModal,
    closeModal: appState.closeModal,
    isOpen: (modalId: string) => activeModal === modalId,
  };
};

// Hook for authentication state
export const useAuth = () => {
  const isAuthenticated = useAppStateField('isAuthenticated');
  
  return {
    isAuthenticated,
    setAuthenticated: appState.setAuthenticated,
  };
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  const performanceMetrics = useAppStateField('performanceMetrics');
  
  return {
    performanceMetrics,
    incrementRenderCount: appState.incrementRenderCount,
    setLoadTime: appState.setLoadTime,
  };
};

// Hook for feature flags
export const useFeatureFlag = (feature: keyof AppState['enabledFeatures']) => {
  const enabledFeatures = useAppStateField('enabledFeatures');
  
  return {
    isEnabled: enabledFeatures[feature],
    toggle: () => appState.toggleFeature(feature),
  };
};

// Hook for data caching
export const useDataCache = () => {
  return {
    setCache: appState.setCache,
    getCache: appState.getCache,
    clearCache: appState.clearCache,
  };
};

export default useAppState;
