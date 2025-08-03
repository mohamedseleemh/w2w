// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Animation settings
  ANIMATION: {
    COUNTER_DURATION: 2000,
    INTERSECTION_THRESHOLD: 0.3,
    INTERSECTION_ROOT_MARGIN: '50px 0px',
    DEBOUNCE_DELAY: 100,
    THROTTLE_DELAY: 16, // ~60fps
  },

  // Loading optimization
  LOADING: {
    LAZY_LOAD_THRESHOLD: '200px',
    IMAGE_QUALITY: 85,
    CHUNK_SIZE_WARNING: 1000,
    PREFETCH_DELAY: 2000,
  },

  // Cache settings
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 100,
    STALE_WHILE_REVALIDATE: 30 * 1000, // 30 seconds
  },

  // Virtual scrolling
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 60,
    BUFFER_SIZE: 5,
    OVERSCAN_COUNT: 3,
  },

  // Network
  NETWORK: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },

  // Bundle optimization
  BUNDLE: {
    MAX_CHUNK_SIZE: 1000 * 1024, // 1MB
    MIN_CHUNK_SIZE: 20 * 1024,   // 20KB
    VENDOR_CHUNK_SIZE: 500 * 1024, // 500KB
  },

  // Memory management
  MEMORY: {
    CLEANUP_INTERVAL: 30000, // 30 seconds
    MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    GARBAGE_COLLECTION_THRESHOLD: 0.8,
  },
} as const;

// Environment-based performance settings
export const getPerformanceConfig = () => {
  const isDev = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    ...PERFORMANCE_CONFIG,
    // Adjust for development
    ...(isDev && {
      ANIMATION: {
        ...PERFORMANCE_CONFIG.ANIMATION,
        COUNTER_DURATION: 1000, // Faster in dev
      },
      LOADING: {
        ...PERFORMANCE_CONFIG.LOADING,
        PREFETCH_DELAY: 1000, // Faster prefetch in dev
      },
    }),
    // Optimize for production
    ...(isProduction && {
      CACHE: {
        ...PERFORMANCE_CONFIG.CACHE,
        TTL: 10 * 60 * 1000, // Longer cache in production
      },
      NETWORK: {
        ...PERFORMANCE_CONFIG.NETWORK,
        TIMEOUT: 5000, // Shorter timeout in production
      },
    }),
  };
};

// Performance monitoring utilities
export const performanceUtils = {
  // Measure component render time
  measureRender: (componentName: string, fn: () => void) => {
    if (import.meta.env.DEV) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`${componentName} render time: ${end - start}ms`);
    } else {
      fn();
    }
  },

  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number = PERFORMANCE_CONFIG.ANIMATION.DEBOUNCE_DELAY
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  // Throttle function calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number = PERFORMANCE_CONFIG.ANIMATION.THROTTLE_DELAY
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), delay);
      }
    };
  },

  // Lazy load images
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    const defaultOptions: IntersectionObserverInit = {
      threshold: PERFORMANCE_CONFIG.ANIMATION.INTERSECTION_THRESHOLD,
      rootMargin: PERFORMANCE_CONFIG.ANIMATION.INTERSECTION_ROOT_MARGIN,
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
  },

  // Memory cleanup
  cleanup: () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Force garbage collection if available
        if ('gc' in window && typeof window.gc === 'function') {
          window.gc();
        }
      });
    }
  },

  // Report performance metrics
  reportMetrics: () => {
    if (import.meta.env.PROD && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
      };

      // Send to analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_performance', {
          custom_parameter: JSON.stringify(metrics),
        });
      }

      return metrics;
    }
  },
};

// React performance hooks
export const usePerformance = () => {
  const config = getPerformanceConfig();

  return {
    config,
    ...performanceUtils,
  };
};

// Export types
export type PerformanceConfig = typeof PERFORMANCE_CONFIG;
export type PerformanceUtils = typeof performanceUtils;
