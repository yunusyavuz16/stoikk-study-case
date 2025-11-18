/**
 * Tests for useAutoFocus hook
 * Covers auto-focus functionality
 */

import React from 'react';
import {renderHook} from '@testing-library/react-native';
import {useAutoFocus} from '../useAutoFocus';
import {TextInput} from 'react-native';

// Mock useFocusEffect
const mockUseFocusEffect = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: any) => mockUseFocusEffect(callback),
}));

describe('useAutoFocus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should focus input when screen gains focus', () => {
    const inputRef = React.createRef<TextInput>();
    const mockFocus = jest.fn();
    (inputRef as any).current = {focus: mockFocus};

    renderHook(() => useAutoFocus({inputRef}));

    // Simulate focus effect callback
    const focusCallback = mockUseFocusEffect.mock.calls[0][0];
    focusCallback();

    jest.advanceTimersByTime(100);

    expect(mockFocus).toHaveBeenCalled();
  });

  it('should use custom delay', () => {
    const inputRef = React.createRef<TextInput>();
    const mockFocus = jest.fn();
    (inputRef as any).current = {focus: mockFocus};

    renderHook(() => useAutoFocus({inputRef, delay: 200}));

    const focusCallback = mockUseFocusEffect.mock.calls[0][0];
    focusCallback();

    jest.advanceTimersByTime(100);
    expect(mockFocus).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFocus).toHaveBeenCalled();
  });

  it('should cleanup timer on unmount', () => {
    const inputRef = React.createRef<TextInput>();
    (inputRef as any).current = {focus: jest.fn()};

    const {unmount} = renderHook(() => useAutoFocus({inputRef}));

    const focusCallback = mockUseFocusEffect.mock.calls[0][0];
    const cleanup = focusCallback();

    unmount();
    cleanup();

    jest.advanceTimersByTime(100);
    // Timer should be cleaned up
  });
});

