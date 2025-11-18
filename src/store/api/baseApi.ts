import {createApi, BaseQueryFn, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import {createAppError} from '@services/errorService';
import {networkService} from '@services/networkService';
import {API_CONFIG} from '@constants/api.constants';

/**
 * Custom base query for mock API
 * Simulates API calls with delay and error handling
 * Prevents API requests when device is offline
 */
/**
 * Exposed for unit tests to directly validate network/error flows.
 */
export const mockBaseQuery: BaseQueryFn<any, unknown, FetchBaseQueryError> = async ({body}) => {
  try {
    // Check network availability before making request
    const isOnline = networkService.isOnline();
    if (!isOnline) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'No internet connection. Please check your network settings.',
        } as FetchBaseQueryError,
      };
    }

    // Simulate API delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), API_CONFIG.MOCK_DELAY));

    // Return the body as data (mock services will handle the logic)
    return {data: body};
  } catch (error) {
    const appError = createAppError(error);
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: appError.message,
      } as FetchBaseQueryError,
    };
  }
};

/**
 * Base API configuration for RTK Query
 * Handles mock API calls with error transformation
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: mockBaseQuery,
  tagTypes: ['Post', 'Media', 'User'],
  endpoints: () => ({}),
});

