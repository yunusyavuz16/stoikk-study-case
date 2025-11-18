/**
 * Tests for useVideoError hook
 * Covers video error handling
 */

import {renderHook, act} from '@testing-library/react-native';
import {useVideoError} from '../useVideoError';

describe('useVideoError', () => {
  it('should initialize without error', () => {
    const {result} = renderHook(() => useVideoError());

    expect(result.current.hasError).toBe(false);
    expect(result.current.retryKey).toBe(0);
  });

  it('should handle error', () => {
    const {result} = renderHook(() => useVideoError());

    act(() => {
      result.current.handleError(new Error('Video error'));
    });

    expect(result.current.hasError).toBe(true);
  });

  it('should reset error and increment retry key', () => {
    const {result} = renderHook(() => useVideoError());

    act(() => {
      result.current.handleError(new Error('Video error'));
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.retryKey).toBe(0);

    act(() => {
      result.current.resetError();
    });

    expect(result.current.hasError).toBe(false);
    expect(result.current.retryKey).toBe(1);
  });
});

