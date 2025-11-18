/**
 * Tests for useNetwork hook
 * Covers network state management
 */

import React from 'react';
import {renderHook, waitFor} from '@testing-library/react-native';
import {useNetwork} from '../useNetwork';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@contexts/ThemeContext';
import {createTestStore, defaultTestState} from '../../__tests__/utils/testUtils';
import {networkService} from '@services/networkService';

jest.mock('@services/networkService', () => ({
  networkService: {
    initialize: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  },
}));

describe('useNetwork', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (networkService.initialize as jest.Mock).mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      isWifiEnabled: true,
      isCellularEnabled: false,
    });
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

  it('should initialize network monitoring', async () => {
    renderHook(() => useNetwork(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(networkService.initialize).toHaveBeenCalled();
    });
  });

  it('should subscribe to network changes', async () => {
    const mockSubscribe = jest.fn(() => jest.fn());
    (networkService.subscribe as jest.Mock) = mockSubscribe;

    renderHook(() => useNetwork(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(networkService.subscribe).toHaveBeenCalled();
    });
  });

  it('should return network state', async () => {
    const {result} = renderHook(() => useNetwork(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.isOnline).toBeDefined();
      expect(result.current.networkState).toBeDefined();
    });
  });

  it('should handle initialization errors', async () => {
    (networkService.initialize as jest.Mock).mockRejectedValue(new Error('Network error'));

    const {result} = renderHook(() => useNetwork(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(result.current.networkState).toBeDefined();
    });
  });

  it('should cleanup subscription on unmount', async () => {
    const mockUnsubscribe = jest.fn();
    (networkService.subscribe as jest.Mock).mockReturnValue(mockUnsubscribe);

    const {unmount} = renderHook(() => useNetwork(), {wrapper: createWrapper()});

    await waitFor(() => {
      expect(networkService.subscribe).toHaveBeenCalled();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

