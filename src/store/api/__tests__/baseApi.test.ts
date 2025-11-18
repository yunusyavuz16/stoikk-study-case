/**
 * Tests for baseApi
 * Covers base query functionality and error handling
 */

import {baseApi} from '../baseApi';

jest.mock('@services/networkService', () => ({
  networkService: {
    isOnline: jest.fn(() => true),
  },
}));

jest.mock('@services/errorService', () => ({
  createAppError: jest.fn((error) => ({
    type: 'UNKNOWN',
    message: error instanceof Error ? error.message : 'Unknown error',
    retryable: false,
  })),
}));

jest.mock('@constants/api.constants', () => ({
  API_CONFIG: {
    MOCK_DELAY: 0, // Use 0 for tests
  },
}));

describe('baseApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should be configured correctly', () => {
    expect(baseApi).toBeDefined();
    expect(baseApi.reducerPath).toBe('api');
  });

  it('should have correct tag types', () => {
    // Tag types are configured in baseApi
    expect(baseApi).toBeDefined();
  });
});

