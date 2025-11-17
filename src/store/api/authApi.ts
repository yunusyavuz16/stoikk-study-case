import { authService } from '@services/authService';
import { secureStorageService } from '@services/secureStorageService';
import type { LoginCredentials, User } from '../../types/auth.types';
import { baseApi } from './baseApi';

interface LoginParams {
  credentials: LoginCredentials;
}

interface CheckAuthResponse {
  user: User | null;
}

/**
 * Auth API slice with RTK Query
 * Handles authentication operations
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /**
     * Login mutation
     */
    login: builder.mutation<User, LoginParams>({
      queryFn: async ({ credentials }) => {
        try {
          const user = await authService.login(credentials);
          // Store credentials securely (non-blocking - login succeeds even if storage fails)
          // This allows the app to work on emulators without biometric authentication
          const storageSuccess = await secureStorageService.storeCredentials(
            credentials.username,
            credentials.password,
          );
          if (!storageSuccess) {
            // Log warning but don't fail login
            console.warn('Could not store credentials securely, but login succeeded');
          }
          return {
            data: user,
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Login failed',
            },
          };
        }
      },
      invalidatesTags: ['User'],
    }),

    /**
     * Logout mutation
     */
    logout: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          await authService.logout();
          await secureStorageService.clearCredentials();
          // Return null for mutations that don't return meaningful data
          return {
            data: null,
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Logout failed',
            },
          };
        }
      },
      invalidatesTags: ['User', 'Post'],
    }),

    /**
     * Check auth status (for initial load)
     */
    checkAuth: builder.query<CheckAuthResponse, void>({
      queryFn: async () => {
        try {
          const credentials = await secureStorageService.getCredentials();
          if (credentials) {
            const user = await authService.login(credentials);
            return {
              data: { user },
            };
          }
          return {
            data: { user: null },
          };
        } catch {
          return {
            data: { user: null }, // Return null on error, don't throw
          };
        }
      },
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } = authApi;
