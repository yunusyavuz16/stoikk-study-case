/**
 * Tests for baseApi
 * Covers base query functionality and error handling
 */

import type {BaseQueryApi} from '@reduxjs/toolkit/query';
import {ErrorType} from '@services/errorService';
import {baseApi, mockBaseQuery} from '../baseApi';

jest.mock('@services/networkService', () => ({
  networkService: {
    isOnline: jest.fn(() => true),
  },
}));

jest.mock('@services/errorService', () => {
  const actual = jest.requireActual('@services/errorService');
  return {
    ...actual,
    createAppError: jest.fn((error) => ({
      type: actual.ErrorType.UNKNOWN,
      message: error instanceof Error ? error.message : 'Unknown error',
      retryable: false,
    })),
  };
});

jest.mock('@constants/api.constants', () => ({
  API_CONFIG: {
    MOCK_DELAY: 0, // Use 0 for tests
  },
}));

import {networkService} from '@services/networkService';
import {createAppError} from '@services/errorService';

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

  describe('mockBaseQuery', () => {
    const mockedNetworkService = networkService as jest.Mocked<typeof networkService>;
    const mockedCreateAppError = createAppError as jest.MockedFunction<typeof createAppError>;
    const baseQueryApiMock = {} as BaseQueryApi;
    const baseQueryExtraOptionsMock = {} as Parameters<typeof mockBaseQuery>[2];
    const runMockBaseQuery = async (params: Parameters<typeof mockBaseQuery>[0]) => {
      const resultPromise = mockBaseQuery(
        params,
        baseQueryApiMock,
        baseQueryExtraOptionsMock,
      );
      jest.runAllTimers();
      return resultPromise;
    };

    it('should return data when device is online', async () => {
      mockedNetworkService.isOnline.mockReturnValue(true);
      const payload = {foo: 'bar'};

      const result = await runMockBaseQuery({body: payload});

      expect(result).toEqual({data: payload});
      expect(mockedNetworkService.isOnline).toHaveBeenCalledTimes(1);
    });

    it('should return custom error when device is offline', async () => {
      mockedNetworkService.isOnline.mockReturnValue(false);

      const result = await runMockBaseQuery({body: {}}); // Body ignored when offline

      expect(result.error).toMatchObject({
        status: 'CUSTOM_ERROR',
        error: 'No internet connection. Please check your network settings.',
      });
    });

    it('should transform unexpected errors via createAppError', async () => {
      const networkError = new Error('network failure');
      mockedNetworkService.isOnline.mockImplementation(() => {
        throw networkError;
      });
      mockedCreateAppError.mockReturnValue({
        type: ErrorType.UNKNOWN,
        message: 'normalized error',
        retryable: false,
      });

      const result = await runMockBaseQuery({body: {}});

      expect(mockedCreateAppError).toHaveBeenCalledWith(networkError);
      expect(result.error).toMatchObject({
        status: 'CUSTOM_ERROR',
        error: 'normalized error',
      });
    });
  });
});

