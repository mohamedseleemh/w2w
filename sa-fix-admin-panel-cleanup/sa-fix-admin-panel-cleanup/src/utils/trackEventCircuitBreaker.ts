/**
 * TrackEvent Circuit Breaker
 * قاطع دائرة لوظيفة trackEvent
 * 
 * Prevents spam of failed database requests by implementing a circuit breaker pattern
 */

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
  resetTimeout: number;
  requestCount: number;
  lastResetTime: number;
}

class TrackEventCircuitBreaker {
  private state: CircuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: 0,
    successCount: 0,
    resetTimeout: 30000, // 30 seconds
    requestCount: 0,
    lastResetTime: Date.now()
  };

  private readonly MAX_FAILURES = 5;
  private readonly MAX_REQUESTS_PER_MINUTE = 20;
  private readonly TIME_WINDOW = 60000; // 1 minute

  /**
   * Check if the circuit breaker should allow the request
   */
  canExecute(): boolean {
    const now = Date.now();
    
    // Reset counters if time window has passed
    if (now - this.state.lastResetTime > this.TIME_WINDOW) {
      this.state.requestCount = 0;
      this.state.lastResetTime = now;
    }

    // Rate limiting check
    if (this.state.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      console.warn('🚦 TrackEvent rate limit exceeded, blocking request');
      return false;
    }

    // If circuit is open, check if it should be reset
    if (this.state.isOpen) {
      if (now - this.state.lastFailureTime > this.state.resetTimeout) {
        console.log('🔄 TrackEvent circuit breaker reset attempt');
        this.state.isOpen = false;
        this.state.failureCount = 0;
        return true;
      }
      console.warn('🚫 TrackEvent circuit breaker is open, blocking request');
      return false;
    }

    this.state.requestCount++;
    return true;
  }

  /**
   * Record a successful execution
   */
  recordSuccess(): void {
    this.state.successCount++;
    this.state.failureCount = 0;
    
    // If we were in half-open state, fully close the circuit
    if (this.state.isOpen) {
      console.log('✅ TrackEvent circuit breaker closed after successful request');
      this.state.isOpen = false;
    }
  }

  /**
   * Record a failed execution
   */
  recordFailure(error?: unknown): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    // Open circuit if failure threshold is reached
    if (this.state.failureCount >= this.MAX_FAILURES) {
      this.state.isOpen = true;
      console.warn(`🔴 TrackEvent circuit breaker opened after ${this.state.failureCount} failures`);
      
      // Log the error details for debugging
      if (error) {
        console.error('🚨 TrackEvent failure details:', {
          message: error.message || 'Unknown error',
          type: typeof error,
          failureCount: this.state.failureCount,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Get current circuit breaker status
   */
  getStatus(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Force reset the circuit breaker
   */
  reset(): void {
    console.log('🔧 TrackEvent circuit breaker manually reset');
    this.state = {
      ...this.state,
      isOpen: false,
      failureCount: 0,
      successCount: 0,
      requestCount: 0,
      lastResetTime: Date.now()
    };
  }

  /**
   * Check if the circuit breaker is healthy
   */
  isHealthy(): boolean {
    const now = Date.now();
    const timeSinceLastFailure = now - this.state.lastFailureTime;
    
    return !this.state.isOpen && 
           this.state.failureCount < this.MAX_FAILURES && 
           (this.state.lastFailureTime === 0 || timeSinceLastFailure > this.state.resetTimeout);
  }
}

// Export singleton instance
export const trackEventCircuitBreaker = new TrackEventCircuitBreaker();

// Enhanced trackEvent wrapper with circuit breaker
export const safeTrackEvent = async (
  originalTrackEvent: (eventType: string, metadata?: Record<string, unknown>) => Promise<void>,
  eventType: string,
  metadata?: Record<string, unknown>
): Promise<void> => {
  // Check if circuit breaker allows execution
  if (!trackEventCircuitBreaker.canExecute()) {
    // Silently skip the request to avoid spamming logs
    return;
  }

  try {
    await originalTrackEvent(eventType, metadata);
    trackEventCircuitBreaker.recordSuccess();
  } catch (error) {
    trackEventCircuitBreaker.recordFailure(error);
    
    // Only log if it's the first few failures to avoid spam
    if (trackEventCircuitBreaker.getStatus().failureCount <= 3) {
      console.error('🚨 TrackEvent failed:', {
        eventType,
        error: error instanceof Error ? error.message : String(error),
        failureCount: trackEventCircuitBreaker.getStatus().failureCount
      });
    }
    
    // Don't re-throw the error to prevent breaking the application
  }
};

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { trackEventCircuitBreaker: TrackEventCircuitBreaker }).trackEventCircuitBreaker = trackEventCircuitBreaker;
}

export default trackEventCircuitBreaker;
