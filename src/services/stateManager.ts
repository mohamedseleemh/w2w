// Application State Manager
// Centralized state management for the KYCtrust platform

type StateChangeListener<T> = (newState: T, previousState: T) => void;

interface StateManager<T> {
  getState(): T;
  setState(newState: Partial<T>): void;
  subscribe(listener: StateChangeListener<T>): () => void;
  reset(): void;
}

class AppStateManager<T> implements StateManager<T> {
  private state: T;
  private listeners: Set<StateChangeListener<T>> = new Set();
  private readonly initialState: T;

  constructor(initialState: T) {
    this.state = { ...initialState };
    this.initialState = { ...initialState };
  }

  getState(): T {
    return { ...this.state };
  }

  setState(newState: Partial<T>): void {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.getState(), previousState);
      } catch (error) {
        // Use proper error logging with serialization
        const errorMessage = error instanceof Error ? error.message : 'Unknown error in state change listener';
        console.error('🚨 Error in state change listener:', {
          message: errorMessage,
          type: typeof error,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  subscribe(listener: StateChangeListener<T>): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  reset(): void {
    this.setState(this.initialState as Partial<T>);
  }

  // Get specific field from state
  getField<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  // Set specific field in state
  setField<K extends keyof T>(key: K, value: T[K]): void {
    this.setState({ [key]: value } as Partial<T>);
  }
}

// Application state interface
interface AppState {
  // UI State
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  
  // Navigation
  currentPage: string;
  isMenuOpen: boolean;
  activeModal: string | null;
  
  // User session
  isAuthenticated: boolean;
  sessionExpiry: number | null;
  
  // Cache
  dataCache: Record<string, any>;
  cacheTimestamps: Record<string, number>;
  
  // Performance
  performanceMetrics: {
    loadTime: number;
    renderCount: number;
    lastActivity: number;
  };
  
  // Features
  enabledFeatures: {
    analytics: boolean;
    whatsapp: boolean;
    darkMode: boolean;
    multiLanguage: boolean;
    pageBuilder: boolean;
  };
}

// Initial state
const initialAppState: AppState = {
  isLoading: false,
  error: null,
  theme: 'light',
  language: 'ar',
  currentPage: '/',
  isMenuOpen: false,
  activeModal: null,
  isAuthenticated: false,
  sessionExpiry: null,
  dataCache: {},
  cacheTimestamps: {},
  performanceMetrics: {
    loadTime: 0,
    renderCount: 0,
    lastActivity: Date.now(),
  },
  enabledFeatures: {
    analytics: true,
    whatsapp: true,
    darkMode: true,
    multiLanguage: true,
    pageBuilder: true,
  },
};

// Create global state manager
export const appStateManager = new AppStateManager(initialAppState);

// Convenience functions for common operations
export const appState = {
  // Loading state
  setLoading: (isLoading: boolean) => appStateManager.setField('isLoading', isLoading),
  getLoading: () => appStateManager.getField('isLoading'),
  
  // Error handling
  setError: (error: string | null) => appStateManager.setField('error', error),
  getError: () => appStateManager.getField('error'),
  clearError: () => appStateManager.setField('error', null),
  
  // Theme
  setTheme: (theme: 'light' | 'dark') => appStateManager.setField('theme', theme),
  getTheme: () => appStateManager.getField('theme'),
  
  // Language
  setLanguage: (language: 'ar' | 'en') => appStateManager.setField('language', language),
  getLanguage: () => appStateManager.getField('language'),
  
  // Modal management
  openModal: (modalId: string) => appStateManager.setField('activeModal', modalId),
  closeModal: () => appStateManager.setField('activeModal', null),
  getActiveModal: () => appStateManager.getField('activeModal'),
  
  // Authentication
  setAuthenticated: (isAuth: boolean) => {
    appStateManager.setState({
      isAuthenticated: isAuth,
      sessionExpiry: isAuth ? Date.now() + (3600000) : null, // 1 hour
    });
  },
  isAuthenticated: () => appStateManager.getField('isAuthenticated'),
  
  // Cache management
  setCache: (key: string, data: any) => {
    const cache = appStateManager.getField('dataCache');
    const timestamps = appStateManager.getField('cacheTimestamps');
    appStateManager.setState({
      dataCache: { ...cache, [key]: data },
      cacheTimestamps: { ...timestamps, [key]: Date.now() },
    });
  },
  
  getCache: (key: string, maxAge = 300000) => { // 5 minutes default
    const cache = appStateManager.getField('dataCache');
    const timestamps = appStateManager.getField('cacheTimestamps');
    const timestamp = timestamps[key];
    
    if (!timestamp || Date.now() - timestamp > maxAge) {
      return null;
    }
    
    return cache[key];
  },
  
  clearCache: (key?: string) => {
    if (key) {
      const cache = appStateManager.getField('dataCache');
      const timestamps = appStateManager.getField('cacheTimestamps');
      const { [key]: _, ...newCache } = cache;
      const { [key]: __, ...newTimestamps } = timestamps;
      
      appStateManager.setState({
        dataCache: newCache,
        cacheTimestamps: newTimestamps,
      });
    } else {
      appStateManager.setState({
        dataCache: {},
        cacheTimestamps: {},
      });
    }
  },
  
  // Performance tracking
  incrementRenderCount: () => {
    const metrics = appStateManager.getField('performanceMetrics');
    appStateManager.setField('performanceMetrics', {
      ...metrics,
      renderCount: metrics.renderCount + 1,
      lastActivity: Date.now(),
    });
  },
  
  setLoadTime: (loadTime: number) => {
    const metrics = appStateManager.getField('performanceMetrics');
    appStateManager.setField('performanceMetrics', {
      ...metrics,
      loadTime,
    });
  },
  
  // Feature flags
  isFeatureEnabled: (feature: keyof AppState['enabledFeatures']) => {
    return appStateManager.getField('enabledFeatures')[feature];
  },
  
  toggleFeature: (feature: keyof AppState['enabledFeatures']) => {
    const features = appStateManager.getField('enabledFeatures');
    appStateManager.setField('enabledFeatures', {
      ...features,
      [feature]: !features[feature],
    });
  },
  
  // Subscribe to state changes
  subscribe: (listener: StateChangeListener<AppState>) => 
    appStateManager.subscribe(listener),
  
  // Get full state
  getFullState: () => appStateManager.getState(),
  
  // Reset to initial state
  reset: () => appStateManager.reset(),
};

// Note: React hook implementation moved to separate hooks file to avoid import issues

// State persistence utilities
export const statePersistence = {
  // Save state to localStorage
  save: (key = 'kyctrust_app_state') => {
    try {
      const state = appStateManager.getState();
      // Only persist certain fields
      const persistableState = {
        theme: state.theme,
        language: state.language,
        enabledFeatures: state.enabledFeatures,
      };
      localStorage.setItem(key, JSON.stringify(persistableState));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  },
  
  // Load state from localStorage
  load: (key = 'kyctrust_app_state') => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedState = JSON.parse(saved);
        appStateManager.setState(parsedState);
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
    }
  },
  
  // Clear persisted state
  clear: (key = 'kyctrust_app_state') => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear state from localStorage:', error);
    }
  },
};

// Initialize state from localStorage on module load
if (typeof window !== 'undefined') {
  statePersistence.load();
  
  // Save state changes automatically
  appStateManager.subscribe(() => {
    statePersistence.save();
  });
  
  // Clear cache periodically
  setInterval(() => {
    const timestamps = appStateManager.getField('cacheTimestamps');
    const now = Date.now();
    const staleKeys = Object.keys(timestamps).filter(
      key => now - timestamps[key] > 600000 // 10 minutes
    );
    
    staleKeys.forEach(key => appState.clearCache(key));
  }, 60000); // Check every minute
}

export type { AppState, StateManager };
export default appStateManager;
