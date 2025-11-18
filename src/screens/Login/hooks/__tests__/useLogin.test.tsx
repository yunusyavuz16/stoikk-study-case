/**
 * Tests for useLogin hook
 * Covers login form state and validation
 */

import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {useLogin} from '../useLogin';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {createTestStore, defaultTestState} from '../../../../__tests__/utils/testUtils';

// Mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
}));

// Mock useAuthRTK
const mockLogin = jest.fn();
jest.mock('@hooks/useAuthRTK', () => ({
  useAuthRTK: () => ({
    login: mockLogin,
    logout: jest.fn(),
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const createWrapper = () => {
    const store = createTestStore(defaultTestState);
    return ({children}: {children: React.ReactNode}) => (
      <Provider store={store}>
        <SafeAreaProvider
          initialMetrics={{
            frame: {x: 0, y: 0, width: 375, height: 812},
            insets: {top: 44, left: 0, bottom: 34, right: 0},
          }}>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    );
  };

  it('should initialize with empty form', () => {
    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update username', () => {
    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('testuser');
    });

    expect(result.current.username).toBe('testuser');
  });

  it('should update password', () => {
    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword('password123');
    });

    expect(result.current.password).toBe('password123');
  });

  it('should show error for empty credentials', async () => {
    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Please enter both username and password');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should show error for whitespace-only credentials', async () => {
    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('   ');
      result.current.setPassword('   ');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Please enter both username and password');
  });

  it('should login successfully with valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined);

    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setPassword('password123');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockReplace).toHaveBeenCalledWith('Feed');
      expect(result.current.error).toBeNull();
    });
  });

  it('should trim username and password before login', async () => {
    mockLogin.mockResolvedValue(undefined);

    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('  testuser  ');
      result.current.setPassword('  password123  ');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should handle login errors', async () => {
    const errorMessage = 'Login failed';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setPassword('password123');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should set loading state during login', async () => {
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>(resolve => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    const {result} = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setUsername('testuser');
      result.current.setPassword('password123');
    });

    act(() => {
      result.current.handleLogin();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveLogin!();
      await loginPromise;
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
