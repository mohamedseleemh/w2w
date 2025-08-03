/**
 * Rate limiter for errors to prevent console spam
 * محدد معدل الأخطاء لمنع إغراق وحدة التحكم
 */

class ErrorRateLimiter {
  private errorCounts: Map<string, { count: number; lastReset: number }> = new Map();
  private readonly maxErrorsPerMinute = 5;
  private readonly resetInterval = 60000; // 1 minute

  /**
   * Check if we should allow this error to be logged
   */
  shouldLogError(errorKey: string): boolean {
    const now = Date.now();
    const existing = this.errorCounts.get(errorKey);

    if (!existing) {
      this.errorCounts.set(errorKey, { count: 1, lastReset: now });
      return true;
    }

    // Reset counter if enough time has passed
    if (now - existing.lastReset > this.resetInterval) {
      this.errorCounts.set(errorKey, { count: 1, lastReset: now });
      return true;
    }

    // Increment counter
    existing.count++;

    // Allow if under limit
    if (existing.count <= this.maxErrorsPerMinute) {
      return true;
    }

    // Log rate limit message only once per interval
    if (existing.count === this.maxErrorsPerMinute + 1) {
      console.warn(`🔇 Rate limiting errors for: ${errorKey} (max ${this.maxErrorsPerMinute}/minute)`);
    }

    return false;
  }

  /**
   * Create a unique key for an error
   */
  createErrorKey(operation: string, errorMessage: string): string {
    return `${operation}:${errorMessage.substring(0, 50)}`;
  }
}

export const errorRateLimiter = new ErrorRateLimiter();
