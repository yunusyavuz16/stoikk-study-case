/**
 * Tests for ThemeContext
 * Covers theme management and persistence
 */

import React from 'react';
import {renderHook, waitFor, act} from '@testing-library/react-native';
import {ThemeProvider, ThemeContext} from '../ThemeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appearance} from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Appearance separately to avoid DevMenu issues
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return RN;
});

jest.spyOn(require('react-native').Appearance, 'getColorScheme').mockReturnValue('light');

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <SafeAreaProvider
      initialMetrics={{
        frame: {x: 0, y: 0, width: 375, height: 812},
        insets: {top: 44, left: 0, bottom: 34, right: 0},
      }}>
      <ThemeProvider>{children}</ThemeProvider>
    </SafeAreaProvider>
  );

  it('should provide theme context', async () => {
    const {result} = renderHook(() => React.useContext(ThemeContext), {wrapper});

    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current?.theme).toBeDefined();
      expect(result.current?.mode).toBeDefined();
      expect(result.current?.setTheme).toBeDefined();
    });
  });

  it('should load stored theme', async () => {
    const {STORAGE_KEYS} = require('@constants/storage.constants');
    // Set the theme before rendering
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, 'dark');

    const {result} = renderHook(() => React.useContext(ThemeContext), {wrapper});

    // Wait for theme to load from storage
    await waitFor(
      () => {
        expect(result.current?.isInitialized).toBe(true);
        expect(result.current?.mode).toBe('dark');
      },
      {timeout: 10000},
    );
  }, 15000);

  it('should use system theme when no stored theme', async () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

    const {result} = renderHook(() => React.useContext(ThemeContext), {wrapper});

    await waitFor(() => {
      expect(result.current?.mode).toBe('dark');
    });
  });

  it('should set and persist theme', async () => {
    const {result} = renderHook(() => React.useContext(ThemeContext), {wrapper});

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    await act(async () => {
      await result.current?.setTheme('dark');
    });

    const {STORAGE_KEYS} = require('@constants/storage.constants');
    await waitFor(() => {
      expect(result.current?.mode).toBe('dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME_MODE, 'dark');
    });
  });

  it('should handle storage errors gracefully', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

    const {result} = renderHook(() => React.useContext(ThemeContext), {wrapper});

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    await act(async () => {
      await result.current?.setTheme('dark');
    });

    // Should still update theme even if storage fails
    expect(result.current?.mode).toBe('dark');
  });
});

