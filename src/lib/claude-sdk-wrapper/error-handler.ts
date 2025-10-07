/**
 * Error Handler with Retry Logic
 * Implements exponential backoff for transient failures
 */

import { ClaudeSDKError, RetryConfig } from './types';

export class ErrorHandler {
  private retryConfig: RetryConfig;

  constructor(retryConfig: RetryConfig) {
    this.retryConfig = retryConfig;
  }

  /**
   * Execute an operation with retry logic
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt <= this.retryConfig.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        const sdkError =
          error instanceof ClaudeSDKError
            ? error
            : this.convertToSDKError(lastError);

        if (!sdkError.isRetryable || attempt >= this.retryConfig.maxRetries) {
          throw sdkError;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateBackoff(attempt);
        await this.delay(delay);

        attempt++;
      }
    }

    throw new ClaudeSDKError(
      `Failed after ${this.retryConfig.maxRetries} attempts: ${context}`,
      'MAX_RETRIES_EXCEEDED',
      false,
      { lastError: lastError?.message }
    );
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number): number {
    const delay =
      this.retryConfig.baseDelay *
      Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Convert generic error to ClaudeSDKError
   */
  private convertToSDKError(error: Error): ClaudeSDKError {
    const isRetryable = this.isTransientError(error);

    return new ClaudeSDKError(
      error.message,
      this.getErrorCode(error),
      isRetryable,
      { originalError: error.name }
    );
  }

  /**
   * Determine if error is transient
   */
  private isTransientError(error: Error): boolean {
    const transientPatterns = [
      /transient/i,
      /timeout/i,
      /timed out/i,
      /econnreset/i,
      /etimedout/i,
      /enotfound/i,
      /rate limit/i,
      /429/,
      /503/,
      /502/,
      /504/,
    ];

    return transientPatterns.some((pattern) =>
      pattern.test(error.message + error.name)
    );
  }

  /**
   * Get error code from error
   */
  private getErrorCode(error: Error): string {
    if ('code' in error && typeof error.code === 'string') {
      return error.code;
    }

    if (error.message.includes('timeout')) return 'TIMEOUT';
    if (error.message.includes('rate limit')) return 'RATE_LIMIT';
    if (error.message.includes('auth')) return 'AUTH_ERROR';

    return 'UNKNOWN_ERROR';
  }
}
