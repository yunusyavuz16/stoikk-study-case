/**
 * Tests for useVideoControls hook
 * Covers video control logic
 */

import {renderHook, act} from '@testing-library/react-native';
import {useVideoControls} from '../useVideoControls';

describe('useVideoControls', () => {
  it('should use pausedProp when tap to play is disabled', () => {
    const {result} = renderHook(() =>
      useVideoControls({
        pausedProp: true,
        enableTapToPlay: false,
        hasError: false,
        onErrorReset: jest.fn(),
      }),
    );

    expect(result.current.actualPaused).toBe(true);
  });

  it('should allow tap to play when enabled', () => {
    const {result} = renderHook(() =>
      useVideoControls({
        pausedProp: false,
        enableTapToPlay: true,
        hasError: false,
        onErrorReset: jest.fn(),
      }),
    );

    expect(result.current.actualPaused).toBe(false);

    act(() => {
      result.current.handleTap();
    });

    expect(result.current.actualPaused).toBe(true);
  });

  it('should reset error on tap when error exists', () => {
    const mockReset = jest.fn();
    const {result} = renderHook(() =>
      useVideoControls({
        pausedProp: false,
        enableTapToPlay: true,
        hasError: true,
        onErrorReset: mockReset,
      }),
    );

    act(() => {
      result.current.handleTap();
    });

    expect(mockReset).toHaveBeenCalled();
  });

  it('should sync with autoplay', () => {
    const {result} = renderHook(() =>
      useVideoControls({
        pausedProp: false,
        enableTapToPlay: true,
        hasError: false,
        onErrorReset: jest.fn(),
      }),
    );

    act(() => {
      result.current.syncWithAutoplay();
    });

    expect(result.current.actualPaused).toBe(false);
  });
});

