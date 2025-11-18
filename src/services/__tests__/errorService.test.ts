/**
 * Tests for ErrorService
 * Covers error classification and handling
 */

import {
  classifyError,
  getUserFriendlyMessage,
  isRetryable,
  createAppError,
  ErrorType,
} from '../errorService';

describe('ErrorService', () => {
  describe('classifyError', () => {
    it('should classify network errors', () => {
      const error = new Error('Network request failed');
      expect(classifyError(error)).toBe(ErrorType.NETWORK);
    });

    it('should classify fetch errors', () => {
      const error = new Error('Failed to fetch');
      expect(classifyError(error)).toBe(ErrorType.NETWORK);
    });

    it('should classify timeout errors', () => {
      const error = new Error('Request timeout');
      expect(classifyError(error)).toBe(ErrorType.TIMEOUT);
    });

    it('should classify unauthorized errors', () => {
      const error = new Error('401 unauthorized');
      expect(classifyError(error)).toBe(ErrorType.UNAUTHORIZED);
    });

    it('should classify not found errors', () => {
      const error = new Error('404 not found');
      expect(classifyError(error)).toBe(ErrorType.NOT_FOUND);
    });

    it('should classify server errors', () => {
      const error = new Error('500 server error');
      expect(classifyError(error)).toBe(ErrorType.SERVER);
    });

    it('should return UNKNOWN for unrecognized errors', () => {
      const error = new Error('Some other error');
      expect(classifyError(error)).toBe(ErrorType.UNKNOWN);
    });

    it('should return UNKNOWN for non-Error types', () => {
      expect(classifyError('string error')).toBe(ErrorType.UNKNOWN);
      expect(classifyError(123)).toBe(ErrorType.UNKNOWN);
      expect(classifyError(null)).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return network error message', () => {
      expect(getUserFriendlyMessage(ErrorType.NETWORK)).toContain('Network error');
    });

    it('should return timeout error message', () => {
      expect(getUserFriendlyMessage(ErrorType.TIMEOUT)).toContain('timed out');
    });

    it('should return unauthorized error message', () => {
      expect(getUserFriendlyMessage(ErrorType.UNAUTHORIZED)).toContain('Authentication');
    });

    it('should return not found error message', () => {
      expect(getUserFriendlyMessage(ErrorType.NOT_FOUND)).toContain('not found');
    });

    it('should return server error message', () => {
      expect(getUserFriendlyMessage(ErrorType.SERVER)).toContain('Server error');
    });

    it('should return default error message for unknown', () => {
      expect(getUserFriendlyMessage(ErrorType.UNKNOWN)).toContain('unexpected error');
    });
  });

  describe('isRetryable', () => {
    it('should return true for retryable errors', () => {
      expect(isRetryable(ErrorType.NETWORK)).toBe(true);
      expect(isRetryable(ErrorType.TIMEOUT)).toBe(true);
      expect(isRetryable(ErrorType.SERVER)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      expect(isRetryable(ErrorType.UNAUTHORIZED)).toBe(false);
      expect(isRetryable(ErrorType.NOT_FOUND)).toBe(false);
      expect(isRetryable(ErrorType.UNKNOWN)).toBe(false);
    });
  });

  describe('createAppError', () => {
    it('should create AppError from Error', () => {
      const error = new Error('Network error');
      const appError = createAppError(error);

      expect(appError.type).toBe(ErrorType.NETWORK);
      expect(appError.message).toBeDefined();
      expect(appError.originalError).toBe(error);
      expect(appError.retryable).toBe(true);
    });

    it('should create AppError from string', () => {
      const appError = createAppError('Some error');

      expect(appError.type).toBe(ErrorType.UNKNOWN);
      expect(appError.message).toBeDefined();
      expect(appError.originalError).toBeInstanceOf(Error);
      expect(appError.retryable).toBe(false);
    });

    it('should create AppError from number', () => {
      const appError = createAppError(123);

      expect(appError.type).toBe(ErrorType.UNKNOWN);
      expect(appError.originalError).toBeInstanceOf(Error);
    });
  });
});

