/**
 * Tests for useTheme hook
 * Covers theme context access
 */

import React from 'react';
import {renderHook} from '@testing-library/react-native';
import {useTheme} from '../useTheme';
import {ThemeProvider} from '@contexts/ThemeContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

describe('useTheme', () => {
  it('should return theme context when used within ThemeProvider', () => {
    const wrapper = ({children}: {children: React.ReactNode}) => (
      <SafeAreaProvider
        initialMetrics={{
          frame: {x: 0, y: 0, width: 375, height: 812},
          insets: {top: 44, left: 0, bottom: 34, right: 0},
        }}>
        <ThemeProvider>{children}</ThemeProvider>
      </SafeAreaProvider>
    );

    const {result} = renderHook(() => useTheme(), {wrapper});

    expect(result.current).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.mode).toBeDefined();
    expect(result.current.setTheme).toBeDefined();
    expect(result.current.isInitialized).toBeDefined();
  });

  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});

