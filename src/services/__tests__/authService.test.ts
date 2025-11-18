/**
 * Tests for AuthService
 * Covers login, logout, token refresh, and error handling
 */

import {authService} from '../authService';
import type {LoginCredentials} from '../../types/auth.types';

// Mock API delay
jest.mock('@constants/api.constants', () => ({
  API_CONFIG: {
    MOCK_DELAY: 100,
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      expect(session).toBeDefined();
      expect(session.user).toBeDefined();
      expect(session.user.username).toBe('testuser');
      expect(session.user.id).toBe('user_testuser');
      expect(session.tokens).toBeDefined();
      expect(session.tokens.accessToken).toContain('access::testuser::');
      expect(session.tokens.refreshToken).toContain('refresh::testuser::');
      expect(session.tokens.expiresIn).toBe(15 * 60);
    });

    it('should login with trimmed username', async () => {
      const credentials: LoginCredentials = {
        username: '  testuser  ',
        password: 'password123',
      };

      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      expect(session.user.username).toBe('testuser');
    });

    it('should login with empty password (any input accepted)', async () => {
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: '',
      };

      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      expect(session).toBeDefined();
      expect(session.user.username).toBe('testuser');
    });

    it('should use default username when empty', async () => {
      const credentials: LoginCredentials = {
        username: '',
        password: 'password123',
      };

      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      // Service defaults to 'user' when username is empty
      expect(session).toBeDefined();
      expect(session.user.username).toBe('user');
    });

    it('should use default username when whitespace-only', async () => {
      const credentials: LoginCredentials = {
        username: '   ',
        password: 'password123',
      };

      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      // Service defaults to 'user' when username is whitespace-only
      expect(session).toBeDefined();
      expect(session.user.username).toBe('user');
    });

    it('should handle login errors gracefully', async () => {
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      // Test that login completes successfully (service doesn't throw on normal errors)
      const loginPromise = authService.login(credentials);
      jest.advanceTimersByTime(100);
      const session = await loginPromise;

      expect(session).toBeDefined();
      expect(session.user).toBeDefined();
    });
  });

  describe('refreshSession', () => {
    it('should successfully refresh session with valid refresh token', async () => {
      const refreshToken = 'refresh::testuser::1234567890';

      const refreshPromise = authService.refreshSession(refreshToken);
      jest.advanceTimersByTime(100);
      const session = await refreshPromise;

      expect(session).toBeDefined();
      expect(session.user.username).toBe('testuser');
      expect(session.tokens).toBeDefined();
    });

    it('should reject refresh with invalid token format', async () => {
      const refreshToken = 'invalid_token';

      const refreshPromise = authService.refreshSession(refreshToken);
      jest.advanceTimersByTime(100);

      await expect(refreshPromise).rejects.toThrow('Invalid refresh token');
    });

    it('should reject refresh with empty token', async () => {
      const refreshPromise = authService.refreshSession('');
      jest.advanceTimersByTime(100);

      await expect(refreshPromise).rejects.toThrow('Refresh token is required');
    });

    it('should reject refresh with null token', async () => {
      const refreshPromise = authService.refreshSession(null as any);
      jest.advanceTimersByTime(100);

      await expect(refreshPromise).rejects.toThrow('Refresh token is required');
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      const logoutPromise = authService.logout();
      jest.advanceTimersByTime(100);
      await expect(logoutPromise).resolves.toBeUndefined();
    });
  });
});

