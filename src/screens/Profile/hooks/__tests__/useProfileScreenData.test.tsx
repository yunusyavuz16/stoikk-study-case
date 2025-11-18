/**
 * Tests for useProfileScreenData hook
 * Covers profile screen data management
 */

import React from 'react';
import {renderHook, act, waitFor} from '@testing-library/react-native';
import {useProfileScreenData} from '../useProfileScreenData';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {createTestStore, defaultTestState, createMockUser} from '../../../../__tests__/utils/testUtils';
import {Alert} from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock useAuthRTK
const mockLogout = jest.fn();
const mockUseAuthRTK = {
  user: createMockUser(),
  logout: mockLogout,
  isLoading: false,
};

jest.mock('@hooks/useAuthRTK', () => ({
  useAuthRTK: () => mockUseAuthRTK,
}));

// Mock navigation
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
  }),
}));

describe('useProfileScreenData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthRTK.user = createMockUser();
    mockUseAuthRTK.isLoading = false;
    mockLogout.mockResolvedValue(undefined);
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

  it('should return profile data', () => {
    const {result} = renderHook(() => useProfileScreenData(), {wrapper: createWrapper()});

    expect(result.current.user).toBeDefined();
    expect(result.current.styles).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.isLoggingOut).toBe(false);
  });

  it('should show logout alert when handleLogout is called', () => {
    const {result} = renderHook(() => useProfileScreenData(), {wrapper: createWrapper()});

    act(() => {
      result.current.handleLogout();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout?',
      expect.any(Array),
    );
  });

  it('should logout and navigate to Login on confirm', async () => {
    const {result} = renderHook(() => useProfileScreenData(), {wrapper: createWrapper()});

    act(() => {
      result.current.handleLogout();
    });

    // Simulate alert confirmation
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const confirmButton = alertCall[2].find((btn: any) => btn.text === 'Logout');
    await act(async () => {
      confirmButton.onPress();
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('Login');
    });
  });

  it('should handle logout errors', async () => {
    mockLogout.mockRejectedValue(new Error('Logout failed'));

    const {result} = renderHook(() => useProfileScreenData(), {wrapper: createWrapper()});

    act(() => {
      result.current.handleLogout();
    });

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const confirmButton = alertCall[2].find((btn: any) => btn.text === 'Logout');
    await act(async () => {
      confirmButton.onPress();
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to logout. Please try again.');
    });
  });
});

