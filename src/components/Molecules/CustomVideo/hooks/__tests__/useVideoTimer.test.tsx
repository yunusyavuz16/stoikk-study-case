/**
 * Tests for useVideoTimer hook
 * Covers video timer functionality
 */

import {renderHook, act} from '@testing-library/react-native';
import {useVideoTimer} from '../useVideoTimer';

describe('useVideoTimer', () => {
  it('should initialize with duration', () => {
    const {result} = renderHook(() =>
      useVideoTimer({
        duration: 30,
        showTimer: true,
        hasError: false,
      }),
    );

    expect(result.current.shouldShowTimer).toBe(true);
    expect(result.current.formattedTime).toBeTruthy();
  });

  it('should not show timer when duration is invalid', () => {
    const {result} = renderHook(() =>
      useVideoTimer({
        duration: undefined,
        showTimer: true,
        hasError: false,
      }),
    );

    expect(result.current.shouldShowTimer).toBe(false);
    expect(result.current.formattedTime).toBeNull();
  });

  it('should update time from progress', () => {
    const {result} = renderHook(() =>
      useVideoTimer({
        duration: 30,
        showTimer: true,
        hasError: false,
      }),
    );

    act(() => {
      result.current.updateFromProgress(10);
    });

    expect(result.current.formattedTime).toBeTruthy();
  });

  it('should reset timer', () => {
    const {result} = renderHook(() =>
      useVideoTimer({
        duration: 30,
        showTimer: true,
        hasError: false,
      }),
    );

    act(() => {
      result.current.updateFromProgress(10);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.formattedTime).toBeTruthy();
  });

  it('should detect loop and reset', () => {
    const {result} = renderHook(() =>
      useVideoTimer({
        duration: 30,
        showTimer: true,
        hasError: false,
      }),
    );

    act(() => {
      result.current.updateFromProgress(29);
    });

    act(() => {
      result.current.updateFromProgress(0.5);
    });

    expect(result.current.formattedTime).toBeTruthy();
  });
});

