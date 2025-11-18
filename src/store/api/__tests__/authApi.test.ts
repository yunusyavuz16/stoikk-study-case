/**
 * Tests for authApi
 * Covers authentication API endpoints
 */

import {authApi} from '../authApi';
import {authService} from '@services/authService';
import {secureStorageService} from '@services/secureStorageService';

jest.mock('@services/authService', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn(),
  },
}));

jest.mock('@services/secureStorageService', () => ({
  secureStorageService: {
    storeRefreshToken: jest.fn(() => Promise.resolve(true)),
    getRefreshToken: jest.fn(() => Promise.resolve(null)),
    clearRefreshToken: jest.fn(() => Promise.resolve()),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should be configured correctly', () => {
    expect(authApi).toBeDefined();
  });

  describe('login endpoint', () => {
    it('should call authService.login and store refresh token', async () => {
      const mockSession = {
        user: {id: 'user_1', username: 'test', email: 'test@example.com', avatar: undefined},
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 900,
        },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockSession);

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      await store.dispatch(
        authApi.endpoints.login.initiate({credentials: {username: 'test', password: 'pass'}}),
      );

      expect(authService.login).toHaveBeenCalledWith({username: 'test', password: 'pass'});
      expect(secureStorageService.storeRefreshToken).toHaveBeenCalledWith('refresh_token');
    });

    it('should handle login errors', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Login failed'));

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      const result = await store.dispatch(
        authApi.endpoints.login.initiate({credentials: {username: 'test', password: 'pass'}}),
      );

      expect(result).toHaveProperty('error');
    });
  });

  describe('logout endpoint', () => {
    it('should call authService.logout and clear refresh token', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      await store.dispatch(authApi.endpoints.logout.initiate());

      expect(authService.logout).toHaveBeenCalled();
      expect(secureStorageService.clearRefreshToken).toHaveBeenCalled();
    });
  });

  describe('checkAuth endpoint', () => {
    it('should return session when refresh token exists', async () => {
      const mockSession = {
        user: {id: 'user_1', username: 'test', email: 'test@example.com', avatar: undefined},
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 900,
        },
      };

      (secureStorageService.getRefreshToken as jest.Mock).mockResolvedValue('refresh_token');
      (authService.refreshSession as jest.Mock).mockResolvedValue(mockSession);

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      await store.dispatch(authApi.endpoints.checkAuth.initiate());

      expect(secureStorageService.getRefreshToken).toHaveBeenCalled();
      expect(authService.refreshSession).toHaveBeenCalledWith('refresh_token');
    });

    it('should return null session when no refresh token', async () => {
      (secureStorageService.getRefreshToken as jest.Mock).mockResolvedValue(null);

      const store = require('@reduxjs/toolkit').configureStore({
        reducer: {
          [require('../baseApi').baseApi.reducerPath]: require('../baseApi').baseApi.reducer,
        },
        middleware: (getDefaultMiddleware: any) =>
          getDefaultMiddleware().concat(require('../baseApi').baseApi.middleware),
      });

      const result = await store.dispatch(authApi.endpoints.checkAuth.initiate());

      expect(result.data?.session).toBeNull();
    });
  });
});

